import { TransferModel } from '../../../lib/db/schema'
import { z } from 'zod'

export default defineZodEventHandler({
  input: {
    params: z.object({
      id: z.coerce.number()
    })
  },
  async handler(event, { input: { params } }) {
    try {
      const transfers = await TransferModel.find({ player_id: params.id })
        .sort({ transfer_date: -1 })
        .lean()
      
      if (!transfers || transfers.length === 0) {
        return {
          transfers: []
        }
      }

      // Formatta i trasferimenti
      const formattedTransfers = transfers.map((transfer) => {
        // Usa principalmente market_value_in_eur che è già in euro
        let transferValue = transfer.market_value_in_eur || 0
        
        // Se transfer_fee è disponibile e contiene "€", prova a parsarlo
        if (transfer.transfer_fee && typeof transfer.transfer_fee === 'string' && transfer.transfer_fee.includes('€')) {
          const feeMatch = transfer.transfer_fee.match(/€([\d,.]+)([KMB])?/)
          if (feeMatch) {
            let amount = parseFloat(feeMatch[1].replace(/,/g, ''))
            const unit = feeMatch[2]
            
            if (unit === 'K') {
              amount *= 1000
            } else if (unit === 'M') {
              amount *= 1000000
            } else if (unit === 'B') {
              amount *= 1000000000
            }
            
            transferValue = amount
          }
        }

        const valueInMillions = transferValue / 1000000
        const formattedValue = transferValue === 0 
          ? 'Svincolato'
          : valueInMillions >= 1000 
            ? `€${(valueInMillions / 1000).toFixed(1)}B`
            : `€${Math.round(valueInMillions)}M`

        // Formatta la data
        const transferDate = transfer.transfer_date ? new Date(transfer.transfer_date) : null
        const formattedDate = transferDate ? transferDate.toISOString().split('T')[0] : 'N/A'

        return {
          id: transfer._id,
          season: transfer.transfer_season,
          date: formattedDate,
          from: transfer.from_club_name || 'Sconosciuto',
          to: transfer.to_club_name || 'Sconosciuto',
          fromClubId: transfer.from_club_id,
          toClubId: transfer.to_club_id,
          fee: formattedValue,
          feeRaw: transferValue,
          marketValue: formattedValue,
          marketValueRaw: transfer.market_value_in_eur || 0,
          fromLogo: `https://tmssl.akamaized.net/images/wappen/head/${transfer.from_club_id}.png`,
          toLogo: `https://tmssl.akamaized.net/images/wappen/head/${transfer.to_club_id}.png`,
        }
      })

      return {
        transfers: formattedTransfers
      }
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Errore interno del server'
      })
    }
  }
}) 