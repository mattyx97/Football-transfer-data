import { PlayerModel } from '../../../lib/db/schema'
import { z } from 'zod'

export default defineZodEventHandler({
  input: {
    params: z.object({
      id: z.coerce.number()
    })
  },
  async handler(event, { input: { params } }) {
    try {
      const player = await PlayerModel.findOne({ player_id: params.id })
      
      if (!player) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Giocatore non trovato'
        })
      }

      // Mappa i paesi ai flag emoji
      const countryFlags: Record<string, string> = {
        'Norway': '🇳🇴', 'France': '🇫🇷', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Spain': '🇪🇸', 
        'Brazil': '🇧🇷', 'Argentina': '🇦🇷', 'Portugal': '🇵🇹', 'Germany': '🇩🇪',
        'Netherlands': '🇳🇱', 'Belgium': '🇧🇪', 'Italy': '🇮🇹', 'Croatia': '🇭🇷',
        'Poland': '🇵🇱', 'Slovenia': '🇸🇮', 'Austria': '🇦🇹', 'Denmark': '🇩🇰',
        'Sweden': '🇸🇪', 'Ukraine': '🇺🇦', 'Serbia': '🇷🇸', 'Morocco': '🇲🇦',
        'Senegal': '🇸🇳', 'Algeria': '🇩🇿', 'Egypt': '🇪🇬', 'Colombia': '🇨🇴',
        'Uruguay': '🇺🇾', 'Chile': '🇨🇱', 'Mexico': '🇲🇽', 'Japan': '🇯🇵',
        'South Korea': '🇰🇷', 'Ghana': '🇬🇭', 'Nigeria': '🇳🇬', 'Ivory Coast': '🇨🇮',
        'Mali': '🇲🇱', 'Burkina Faso': '🇧🇫', 'Cameroon': '🇨🇲'
      }

      // Funzione per calcolare l'età
      const calculateAge = (dateOfBirth: Date): number => {
        const today = new Date()
        const birthDate = new Date(dateOfBirth)
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
        
        return age
      }

      // Funzione per tradurre posizioni
      const translatePosition = (position: string): string => {
        const translations: Record<string, string> = {
          'Centre-Forward': 'Centravanti',
          'Central Midfield': 'Centrocampo Centrale',
          'Right Winger': 'Ala Destra',
          'Left Winger': 'Ala Sinistra',
          'Left-Back': 'Terzino Sinistro',
          'Right-Back': 'Terzino Destro',
          'Centre-Back': 'Difensore Centrale',
          'Goalkeeper': 'Portiere',
          'Defensive Midfield': 'Mediano',
          'Attacking Midfield': 'Trequartista',
          'Left Midfield': 'Centrocampo Sinistro',
          'Right Midfield': 'Centrocampo Destro',
          'Secondary Striker': 'Seconda Punta'
        }
        
        return translations[position] || position
      }

      // Formatta i valori
      const marketValue = player.market_value_in_eur || 0
      const highestValue = player.highest_market_value_in_eur || 0
      
      const formatValue = (value: number): string => {
        const valueInMillions = value / 1000000
        return valueInMillions >= 1000 
          ? `€${(valueInMillions / 1000).toFixed(1)}B`
          : `€${Math.round(valueInMillions)}M`
      }

      const age = player.date_of_birth ? calculateAge(player.date_of_birth) : null
      const nationality = countryFlags[player.country_of_citizenship || ''] || '🌍'

      return {
        player: {
          id: player.player_id,
          name: player.name,
          firstName: player.first_name,
          lastName: player.last_name,
          age: age ? age.toString() : 'N/A',
          nationality,
          countryOfBirth: player.country_of_birth,
          cityOfBirth: player.city_of_birth,
          countryOfCitizenship: player.country_of_citizenship,
          dateOfBirth: player.date_of_birth ? player.date_of_birth.toISOString().split('T')[0] : null,
          position: translatePosition(player.position || ''),
          subPosition: player.sub_position,
          foot: player.foot,
          height: player.height_in_cm ? `${player.height_in_cm} cm` : 'N/A',
          currentClub: player.current_club_name,
          currentClubId: player.current_club_id,
          marketValue: formatValue(marketValue),
          marketValueRaw: marketValue,
          highestMarketValue: formatValue(highestValue),
          highestMarketValueRaw: highestValue,
          contractExpiration: player.contract_expiration_date ? player.contract_expiration_date.toISOString().split('T')[0] : null,
          agent: player.agent_name,
          photo: player.image_url || '/default-player.png',
          url: player.url,
          lastSeason: player.last_season
        }
      }
    } catch (error: any) {
      if (error.statusCode === 404) {
        throw error
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Errore interno del server'
      })
    }
  }
}) 