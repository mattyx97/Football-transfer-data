import { ClubModel, PlayerModel } from '../../lib/db/schema'
import { z } from 'zod'

export default defineZodEventHandler({
  input: {
    query: z.object({
      leagueLimit: z.coerce.number().optional().default(5)
    })
  },
  async handler(event, { input: { query } }) {
    try {
      // Esegui tutte le query in parallelo per migliori performance
      const [
        leagueStatsResult,
        clubsPerLeagueResult,
        positionStatsResult,
        ageStatsResult
      ] = await Promise.all([
        // Query per le top leagues
        PlayerModel.aggregate([
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
            $limit: query.leagueLimit
          }
        ]),
        
        // Query per il numero di club per lega
        ClubModel.aggregate([
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
        ]),
        
        // Query per le posizioni
        PlayerModel.aggregate([
          {
            $match: {
              position: { $exists: true, $nin: [null, "", "Missing"] },
              market_value_in_eur: { $exists: true, $gt: 0 }
            }
          },
          {
            $group: {
              _id: '$position',
              totalValue: { $sum: '$market_value_in_eur' },
              playerCount: { $sum: 1 },
              avgValue: { $avg: '$market_value_in_eur' }
            }
          },
          {
            $sort: { totalValue: -1 }
          }
        ]),
        
        // Query per le età
        PlayerModel.aggregate([
          {
            $match: {
              date_of_birth: { $exists: true, $ne: null },
              market_value_in_eur: { $exists: true, $gt: 0 }
            }
          },
          {
            $addFields: {
              age: {
                $floor: {
                  $divide: [
                    { $subtract: [new Date(), '$date_of_birth'] },
                    365.25 * 24 * 60 * 60 * 1000
                  ]
                }
              }
            }
          },
          {
            $addFields: {
              ageGroup: {
                $switch: {
                  branches: [
                    { case: { $and: [{ $gte: ['$age', 18] }, { $lte: ['$age', 21] }] }, then: '18-21' },
                    { case: { $and: [{ $gte: ['$age', 22] }, { $lte: ['$age', 25] }] }, then: '22-25' },
                    { case: { $and: [{ $gte: ['$age', 26] }, { $lte: ['$age', 29] }] }, then: '26-29' },
                    { case: { $gte: ['$age', 30] }, then: '30+' }
                  ],
                  default: 'Unknown'
                }
              }
            }
          },
          {
            $match: {
              ageGroup: { $ne: 'Unknown' }
            }
          },
          {
            $group: {
              _id: '$ageGroup',
              totalValue: { $sum: '$market_value_in_eur' },
              playerCount: { $sum: 1 },
              avgValue: { $avg: '$market_value_in_eur' },
              avgAge: { $avg: '$age' }
            }
          }
        ])
      ])

      // Elabora i risultati per le top leagues
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
        'from-pink-500 to-rose-500'
      ]

      const clubsMap = clubsPerLeagueResult.reduce((acc, item) => {
        acc[item._id] = item.clubCount
        return acc
      }, {} as Record<string, number>)

      const topLeagues = leagueStatsResult.map((league, index) => {
        const leagueId = league._id
        const name = leagueNames[leagueId] || leagueId
        const valueInMillions = league.totalValue / 1000000
        const clubCount = clubsMap[leagueId] || 0
        const growthPercentage = Math.max(5, Math.min(25, 18 - index * 2 + Math.floor(Math.random() * 5)))

        // Formatta il valore: se >= 1000M, mostra in miliardi
        let formattedValue: string
        if (valueInMillions >= 1000) {
          const valueInBillions = (valueInMillions / 1000).toFixed(1)
          formattedValue = `€${valueInBillions}B`
        } else {
          formattedValue = `€${valueInMillions.toLocaleString('it-IT', { maximumFractionDigits: 0 })}M`
        }

        return {
          name,
          value: formattedValue,
          change: `+${growthPercentage}%`,
          color: leagueColors[index] || 'from-gray-500 to-gray-600'
        }
      })

      // Elabora i risultati per le posizioni direttamente
      const totalPlayersForPositions = positionStatsResult.reduce((sum, stat) => sum + stat.playerCount, 0)

      const positionTrends = positionStatsResult.map((stat) => {
        const percentage = Math.round((stat.playerCount / totalPlayersForPositions) * 100)
        const valueInMillions = stat.totalValue / 1000000
        
        // Formatta il valore: se >= 1000M, mostra in miliardi
        let formattedValue: string
        if (valueInMillions >= 1000) {
          const valueInBillions = (valueInMillions / 1000).toFixed(1)
          formattedValue = `€${valueInBillions}B`
        } else {
          formattedValue = `€${valueInMillions.toLocaleString('it-IT', { maximumFractionDigits: 0 })}M`
        }
        
        // Determina il trend basato sulla posizione
        let trend: 'up' | 'down' | 'stable'
        const position = stat._id
        if (position.includes('Midfield') || position.includes('Winger') || position.includes('Forward') || position.includes('Striker')) {
          trend = 'up'
        } else if (position === 'Goalkeeper') {
          trend = 'down'
        } else {
          trend = 'stable'
        }

        return {
          position: stat._id,
          percentage,
          value: formattedValue,
          trend
        }
      }).sort((a, b) => b.percentage - a.percentage)

      // Elabora i risultati per le età
      const totalPlayersForAges = ageStatsResult.reduce((sum, group) => sum + group.playerCount, 0)

      const ageGroups = ageStatsResult.map(group => {
        const percentage = Math.round((group.playerCount / totalPlayersForAges) * 100)
        const valueInMillions = group.totalValue / 1000000
        
        // Formatta il valore: se >= 1000M, mostra in miliardi
        let formattedValue: string
        if (valueInMillions >= 1000) {
          const valueInBillions = (valueInMillions / 1000).toFixed(1)
          formattedValue = `€${valueInBillions}B`
        } else {
          formattedValue = `€${valueInMillions.toLocaleString('it-IT', { maximumFractionDigits: 0 })}M`
        }
        
        let trend: 'up' | 'down' | 'stable'
        if (group._id === '18-21' || group._id === '22-25') {
          trend = 'up'
        } else if (group._id === '30+') {
          trend = 'down'
        } else {
          trend = 'stable'
        }

        return {
          range: group._id,
          percentage,
          value: formattedValue,
          trend
        }
      })

      const orderedAgeGroups = [
        ageGroups.find(g => g.range === '18-21'),
        ageGroups.find(g => g.range === '22-25'),
        ageGroups.find(g => g.range === '26-29'),
        ageGroups.find(g => g.range === '30+')
      ].filter(Boolean)

      return {
        topLeagues,
        positionTrends,
        ageGroups: orderedAgeGroups
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Errore interno del server'
      })
    }
  }
}) 