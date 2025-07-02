import { PlayerModel } from '../../lib/db/schema'
import { z } from 'zod'

export default defineZodEventHandler({
  input: {
    query: z.object({}).optional()
  },
  async handler(event, { input }) {
    try {
      // Aggrega i dati direttamente per posizione
      const positionStats = await PlayerModel.aggregate([
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
      ])

      // Calcola le percentuali e formatta i risultati
      const totalPlayers = positionStats.reduce((sum, stat) => sum + stat.playerCount, 0)

      const positionTrends = positionStats.map((stat) => {
        const percentage = Math.round((stat.playerCount / totalPlayers) * 100)
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
          trend,
          playerCount: stat.playerCount,
          avgValue: Math.round(stat.avgValue)
        }
      }).sort((a, b) => b.percentage - a.percentage)

      return {
        positionTrends
      }
    } catch (error) {
      console.error('Errore nel recupero dei trend per posizione:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Errore interno del server'
      })
    }
  }
}) 