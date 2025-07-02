import { ClubModel, PlayerModel, TransferModel } from '../../lib/db/schema'
import { z } from 'zod'

export default defineZodEventHandler({
  input: {
    query: z.object({}).optional()
  },
  async handler(event, { input }) {
    try {
      // Esegui le query in parallelo per migliori performance
      const [
        totalPlayers,
        totalClubs,
        totalTransfers,
        playersWithValue,
        recentPlayers,
        recentClubs,
        recentTransfers
      ] = await Promise.all([
        PlayerModel.countDocuments(),
        ClubModel.countDocuments(),
        TransferModel.countDocuments(),
        PlayerModel.aggregate([
          { $match: { market_value_in_eur: { $exists: true, $ne: null, $gt: 0 } } },
          { $group: { _id: null, totalValue: { $sum: '$market_value_in_eur' } } }
        ]),
        // Per calcolare la crescita, contiamo i giocatori delle ultime 2 stagioni
        PlayerModel.countDocuments({
          last_season: { $gte: new Date().getFullYear() - 1 }
        }),
        ClubModel.countDocuments({
          last_season: { $gte: new Date().getFullYear() - 1 }
        }),
        TransferModel.countDocuments({
          transfer_date: { 
            $exists: true, 
            $ne: null,
            $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // ultimo anno
          }
        })
      ])

      // Calcola le percentuali di crescita (mock basate sui dati recenti)
      const playersGrowth = totalPlayers > 0 ? Math.min(25, Math.max(5, Math.round((recentPlayers / totalPlayers) * 20))) : 12
      const clubsGrowth = totalClubs > 0 ? Math.min(20, Math.max(3, Math.round((recentClubs / totalClubs) * 15))) : 8
      const transfersGrowth = totalTransfers > 0 ? Math.min(30, Math.max(8, Math.round((recentTransfers / totalTransfers) * 25))) : 24

      // Calcola il valore totale e formattalo
      const totalValue = playersWithValue.length > 0 ? playersWithValue[0].totalValue : 0
      const valueInBillions = totalValue / 1000000000
      const formattedTotalValue = valueInBillions >= 1 
        ? `€${valueInBillions.toFixed(1)}B`
        : `€${(totalValue / 1000000).toLocaleString('it-IT', { maximumFractionDigits: 0 })}M`
      
      return {
        stats: [
          {
            title: 'Giocatori Analizzati',
            value: totalPlayers.toLocaleString(),
            change: `+${playersGrowth}%`,
            icon: 'i-heroicons-user-group',
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/20',
            borderColor: 'border-emerald-500/30',
            details: 'Analisi completa su 150+ campionati'
          },
          {
            title: 'Club Monitorati',
            value: totalClubs.toLocaleString(),
            change: `+${clubsGrowth}%`,
            icon: 'i-heroicons-building-office',
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/20',
            borderColor: 'border-amber-500/30',
            details: 'Copertura globale in tempo reale'
          },
          {
            title: 'Trasferimenti Tracciati',
            value: totalTransfers.toLocaleString(),
            change: `+${transfersGrowth}%`,
            icon: 'i-heroicons-arrow-path',
            color: 'text-lime-400',
            bgColor: 'bg-lime-500/20',
            borderColor: 'border-lime-500/30',
            details: 'Ultimi 5 anni di mercato'
          },
          {
            title: 'Valore Totale Analizzato',
            value: formattedTotalValue,
            change: '+15%',
            icon: 'i-heroicons-currency-euro',
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/20',
            borderColor: 'border-yellow-500/30',
            details: 'Valutazioni basate su AI'
          }
        ]
      }
    } catch (error) {
      console.error('Errore nel recupero delle statistiche:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Errore interno del server'
      })
    }
  }
}) 