import { PlayerModel } from '../../lib/db/schema'
import { z } from 'zod'

export default defineZodEventHandler({
  input: {
    query: z.object({}).optional()
  },
  async handler(event, { input }) {
    try {
      // Aggrega i dati per età calcolando l'età dalla data di nascita
      const ageStats = await PlayerModel.aggregate([
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
                  365.25 * 24 * 60 * 60 * 1000 // millisecondi in un anno
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
        },
        {
          $sort: { '_id': 1 }
        }
      ])

      // Calcola le percentuali e formatta i risultati
      const totalPlayers = ageStats.reduce((sum, group) => sum + group.playerCount, 0)
      const totalValue = ageStats.reduce((sum, group) => sum + group.totalValue, 0)

      const ageGroups = ageStats.map(group => {
        const percentage = Math.round((group.playerCount / totalPlayers) * 100)
        const valueInMillions = group.totalValue / 1000000
        
        // Formatta il valore: se >= 1000M, mostra in miliardi
        let formattedValue: string
        if (valueInMillions >= 1000) {
          const valueInBillions = (valueInMillions / 1000).toFixed(1)
          formattedValue = `€${valueInBillions}B`
        } else {
          formattedValue = `€${valueInMillions.toLocaleString('it-IT', { maximumFractionDigits: 0 })}M`
        }
        
        // Determina il trend basato sull'età (giovani in crescita, anziani in calo)
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
          trend,
          playerCount: group.playerCount,
          avgValue: Math.round(group.avgValue),
          avgAge: Math.round(group.avgAge * 10) / 10
        }
      })

      // Ordina per fascia di età
      const orderedAgeGroups = [
        ageGroups.find(g => g.range === '18-21'),
        ageGroups.find(g => g.range === '22-25'),
        ageGroups.find(g => g.range === '26-29'),
        ageGroups.find(g => g.range === '30+')
      ].filter(Boolean)

      return {
        ageGroups: orderedAgeGroups
      }
    } catch (error) {
      console.error('Errore nel recupero della distribuzione per età:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Errore interno del server'
      })
    }
  }
}) 