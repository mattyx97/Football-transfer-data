import { z } from 'zod'
import { ClubModel, PlayerModel, TransferModel, PlayerValuationModel } from '../../lib/db/schema'

export default defineZodEventHandler({
  input: {
    query: z.object({
      type: z.enum(['players', 'clubs', 'transfers', 'valuations', 'stats']).optional(),
      clubId: z.coerce.number().optional(),
      limit: z.coerce.number().optional().default(50)
    })
  },
  async handler(event, { input: { query } }) {
    try {
      let data: any = {}

      switch (query.type) {
        case 'players':
          const playersQuery = query.clubId 
            ? PlayerModel.find({ current_club_id: query.clubId }).limit(query.limit)
            : PlayerModel.find().limit(query.limit)
          
          data.players = await playersQuery.lean()
          break

        case 'clubs':
          data.clubs = await ClubModel.find().limit(query.limit).lean()
          break

        case 'transfers':
          data.transfers = await TransferModel.find().limit(query.limit).lean()
          break

        case 'valuations':
          data.valuations = await PlayerValuationModel.find().limit(query.limit).lean()
          break

        case 'stats':
        default:
          // Statistiche aggregate
          const [totalPlayers, totalClubs, totalTransfers, avgPlayerValue] = await Promise.all([
            PlayerModel.countDocuments(),
            ClubModel.countDocuments(),
            TransferModel.countDocuments(),
            PlayerModel.aggregate([
              { $group: { _id: null, avgValue: { $avg: '$market_value_in_eur' } } }
            ])
          ])

          // Top 10 giocatori per valore
          const topPlayers = await PlayerModel.find()
            .sort({ market_value_in_eur: -1 })
            .limit(10)
            .lean()

          // Distribuzione per posizione
          const positionStats = await PlayerModel.aggregate([
            { $group: { _id: '$position', count: { $sum: 1 }, avgValue: { $avg: '$market_value_in_eur' } } },
            { $sort: { count: -1 } }
          ])

          // Distribuzione per età
          const ageStats = await PlayerModel.aggregate([
            { $group: { _id: '$date_of_birth', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
          ])

          data = {
            summary: {
              totalPlayers,
              totalClubs,
              totalTransfers,
              avgPlayerValue: avgPlayerValue[0]?.avgValue || 0
            },
            topPlayers,
            positionStats,
            ageStats
          }
          break
      }

      return {
        success: true,
        data,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Errore nel recupero dati per IA:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Errore nel recupero dati'
      })
    }
  }
}) 