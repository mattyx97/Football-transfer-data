import { ClubModel, PlayerModel } from '../../lib/db/schema'
import { z } from 'zod'

export default defineZodEventHandler({
  input: {
    query: z.object({
      limit: z.coerce.number().optional().default(5)
    })
  },
  async handler(event, { input: { query } }) {
    try {
      // Mappa i domestic_competition_id ai nomi delle leghe
      const leagueNames: Record<string, string> = {
        'GB1': 'Premier League',
        'ES1': 'La Liga',
        'IT1': 'Serie A',
        'L1': 'Bundesliga',
        'FR1': 'Ligue 1',
        'NL1': 'Eredivisie',
        'PT1': 'Liga Portugal',
        'TR1': 'Süper Lig',
        'BE1': 'Pro League',
        'RU1': 'Premier Liga'
      }

      const leagueColors = [
        'from-purple-500 to-indigo-500',
        'from-orange-500 to-red-500',
        'from-blue-500 to-cyan-500',
        'from-emerald-500 to-teal-500',
        'from-pink-500 to-rose-500',
        'from-yellow-500 to-orange-500',
        'from-green-500 to-emerald-500',
        'from-red-500 to-pink-500',
        'from-cyan-500 to-blue-500',
        'from-indigo-500 to-purple-500'
      ]

      // Aggrega i dati per campionato dal PlayerModel
      const leagueStats = await PlayerModel.aggregate([
        {
          $match: {
            current_club_domestic_competition_id: { $exists: true, $ne: null },
            market_value_in_eur: { $exists: true, $gt: 0 }
          }
        },
        {
          $group: {
            _id: '$current_club_domestic_competition_id',
            totalValue: { $sum: '$market_value_in_eur' },
            playerCount: { $sum: 1 },
            avgValue: { $avg: '$market_value_in_eur' }
          }
        },
        {
          $sort: { totalValue: -1 }
        },
        {
          $limit: query.limit
        }
      ])

      // Ottieni anche il numero di club per lega
      const clubsPerLeague = await ClubModel.aggregate([
        {
          $match: {
            domestic_competition_id: { $exists: true, $ne: null }
          }
        },
        {
          $group: {
            _id: '$domestic_competition_id',
            clubCount: { $sum: 1 }
          }
        }
      ])

      // Crea una mappa per i club
      const clubsMap = clubsPerLeague.reduce((acc, item) => {
        acc[item._id] = item.clubCount
        return acc
      }, {} as Record<string, number>)

      // Formatta i risultati
      const topLeagues = leagueStats.map((league, index) => {
        const leagueId = league._id
        const name = leagueNames[leagueId] || leagueId
        const valueInMillions = league.totalValue / 1000000
        const clubCount = clubsMap[leagueId] || 0
        
        // Formatta il valore: se >= 1000M, mostra in miliardi
        let formattedValue: string
        if (valueInMillions >= 1000) {
          const valueInBillions = (valueInMillions / 1000).toFixed(1)
          formattedValue = `€${valueInBillions}B`
        } else {
          formattedValue = `€${valueInMillions.toLocaleString('it-IT', { maximumFractionDigits: 0 })}M`
        }
        
        // Calcola una crescita mock basata sulla posizione e valore
        const growthPercentage = Math.max(5, Math.min(25, 18 - index * 2 + Math.floor(Math.random() * 5)))

        return {
          name,
          value: formattedValue,
          change: `+${growthPercentage}%`,
          color: leagueColors[index] || 'from-gray-500 to-gray-600',
          playerCount: league.playerCount,
          clubCount,
          avgValue: Math.round(league.avgValue)
        }
      })

      return {
        topLeagues
      }
    } catch (error) {
      console.error('Errore nel recupero delle top leagues:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Errore interno del server'
      })
    }
  }
}) 