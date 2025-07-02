import { TransferModel } from '../../lib/db/schema'
import { z } from 'zod'

export default defineZodEventHandler({
  input: {
    query: z.object({
      limit: z.coerce.number().optional().default(5)
    })
  },
  async handler(event, { input: { query } }) {
    try {
      const recentTransfers = await TransferModel.aggregate([
        {
          $match: {
            transfer_date: { $exists: true, $ne: null },
            market_value_in_eur: { $exists: true, $gt: 0 },
            player_name: { $exists: true, $nin: [null, "", "Missing"] },
            from_club_name: { $exists: true, $nin: [null, "", "Missing"] },
            to_club_name: { $exists: true, $nin: [null, "", "Missing"] }
          }
        },
        {
          $sort: { transfer_date: -1 }
        },
        {
          $limit: query.limit
        },
        {
          $lookup: {
            from: 'players',
            localField: 'player_id',
            foreignField: 'player_id',
            as: 'player_info'
          }
        },
        {
          $project: {
            player_id: 1,
            player_name: 1,
            from_club_name: 1,
            to_club_name: 1,
            transfer_fee: 1,
            market_value_in_eur: 1,
            transfer_date: 1,
            player_photo: { $arrayElemAt: ['$player_info.image_url', 0] },
            player_nationality: { $arrayElemAt: ['$player_info.country_of_citizenship', 0] }
          }
        }
      ])

      // Mappa i paesi ai flag emoji (simplified per i trasferimenti)
      const countryFlags: Record<string, string> = {
        'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        'Argentina': '🇦🇷',
        'Ecuador': '🇪🇨',
        'France': '🇫🇷',
        'Brazil': '🇧🇷',
        'Spain': '🇪🇸',
        'Portugal': '🇵🇹',
        'Germany': '🇩🇪',
        'Netherlands': '🇳🇱',
        'Belgium': '🇧🇪',
        'Italy': '🇮🇹',
        'Croatia': '🇭🇷',
        'Poland': '🇵🇱'
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

      // Formatta i risultati
      const formattedTransfers = recentTransfers.map((transfer, index) => {
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
        const formattedValue = valueInMillions >= 1000 
          ? `€${(valueInMillions / 1000).toFixed(1)}B`
          : `€${Math.round(valueInMillions)}M`

        // Formatta la data
        const transferDate = new Date(transfer.transfer_date)
        const formattedDate = transferDate.toISOString().split('T')[0] // YYYY-MM-DD

        // Usa nazionalità e foto reali dal database
        const nationality = countryFlags[transfer.player_nationality] || '🌍'

        return {
          player: transfer.player_name,
          from: transfer.from_club_name,
          to: transfer.to_club_name,
          value: formattedValue,
          date: formattedDate,
          playerPhoto: transfer.player_photo || '/default-player.png',
          fromLogo: getClubLogo(transfer.from_club_name || ''),
          toLogo: getClubLogo(transfer.to_club_name || ''),
          nationality
        }
      })

      return {
        recentTransfers: formattedTransfers
      }
    } catch (error) {
      console.error('Errore nel recupero dei trasferimenti recenti:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Errore interno del server'
      })
    }
  }
}) 