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

      // Funzione per ottenere il logo del club
      const getClubLogo = (clubName: string): string => {
        const clubLogos: Record<string, string> = {
          'Manchester City': 'https://logoeps.com/wp-content/uploads/2013/03/manchester-city-vector-logo.png',
          'Real Madrid': 'https://logoeps.com/wp-content/uploads/2013/03/real-madrid-vector-logo.png',
          'Barcelona': 'https://logoeps.com/wp-content/uploads/2013/03/fc-barcelona-vector-logo.png',
          'FC Barcelona': 'https://logoeps.com/wp-content/uploads/2013/03/fc-barcelona-vector-logo.png',
          'Chelsea': 'https://logoeps.com/wp-content/uploads/2013/03/chelsea-vector-logo.png',
          'Arsenal': 'https://logoeps.com/wp-content/uploads/2013/03/arsenal-vector-logo.png',
          'Liverpool': 'https://logoeps.com/wp-content/uploads/2013/03/liverpool-vector-logo.png',
          'Manchester United': 'https://logoeps.com/wp-content/uploads/2013/03/manchester-united-vector-logo.png',
          'Bayern Munich': 'https://logoeps.com/wp-content/uploads/2013/03/bayern-munich-vector-logo.png',
          'Paris Saint-Germain': 'https://logoeps.com/wp-content/uploads/2013/03/paris-saint-germain-vector-logo.png',
          'Juventus': 'https://logoeps.com/wp-content/uploads/2013/03/juventus-vector-logo.png',
          'AC Milan': 'https://logoeps.com/wp-content/uploads/2013/03/ac-milan-vector-logo.png',
          'Inter Milan': 'https://logoeps.com/wp-content/uploads/2013/03/inter-milan-vector-logo.png',
          'Atletico Madrid': 'https://logoeps.com/wp-content/uploads/2013/03/atletico-madrid-vector-logo.png',
          'Tottenham': 'https://logoeps.com/wp-content/uploads/2013/03/tottenham-vector-logo.png',
          'Borussia Dortmund': 'https://logoeps.com/wp-content/uploads/2013/03/borussia-dortmund-vector-logo.png',
          'Ajax': 'https://logoeps.com/wp-content/uploads/2013/03/ajax-vector-logo.png',
          'West Ham': 'https://logoeps.com/wp-content/uploads/2013/03/west-ham-vector-logo.png',
          'Brighton': 'https://logoeps.com/wp-content/uploads/2013/03/brighton-hove-albion-vector-logo.png',
          'Benfica': 'https://logoeps.com/wp-content/uploads/2013/03/sl-benfica-vector-logo.png',
          'Sporting CP': 'https://logoeps.com/wp-content/uploads/2013/03/sporting-cp-vector-logo.png'
        }
        
        return clubLogos[clubName] || '/default-club.png'
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
          fromLogo: getClubLogo(transfer.from_club_name || ''),
          toLogo: getClubLogo(transfer.to_club_name || '')
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