import { PlayerModel, ClubModel } from "../../../lib/db/schema"
import { z } from "zod"

export default defineZodEventHandler({
  input: {
    params: z.object({
      id: z.coerce.number(),
    }),
    query: z.object({
      position: z.string().optional(),
      sortBy: z.enum(["name", "age", "value", "position"]).optional().default("value"),
      order: z.enum(["asc", "desc"]).optional().default("desc"),
    }),
  },
  async handler(event, { input: { params, query } }) {
    try {
      // Prima trova le informazioni del club
      const club = await ClubModel.findOne({ club_id: params.id })

      if (!club) {
        throw createError({
          statusCode: 404,
          statusMessage: "Club non trovato",
        })
      }

      // Crea il filtro per i giocatori
      const playerFilter: any = { current_club_id: params.id }

      if (query.position) {
        playerFilter.position = query.position
      }

      // Trova tutti i giocatori del club
      const players = await PlayerModel.find(playerFilter).lean()

      // Mappa i paesi ai flag emoji
      const countryFlags: Record<string, string> = {
        Norway: "🇳🇴",
        France: "🇫🇷",
        England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        Spain: "🇪🇸",
        Brazil: "🇧🇷",
        Argentina: "🇦🇷",
        Portugal: "🇵🇹",
        Germany: "🇩🇪",
        Netherlands: "🇳🇱",
        Belgium: "🇧🇪",
        Italy: "🇮🇹",
        Croatia: "🇭🇷",
        Poland: "🇵🇱",
        Slovenia: "🇸🇮",
        Austria: "🇦🇹",
        Denmark: "🇩🇰",
        Sweden: "🇸🇪",
        Ukraine: "🇺🇦",
        Serbia: "🇷🇸",
        Morocco: "🇲🇦",
        Senegal: "🇸🇳",
        Algeria: "🇩🇿",
        Egypt: "🇪🇬",
        Colombia: "🇨🇴",
        Uruguay: "🇺🇾",
        Chile: "🇨🇱",
        Mexico: "🇲🇽",
        Japan: "🇯🇵",
        "South Korea": "🇰🇷",
        Ghana: "🇬🇭",
        Nigeria: "🇳🇬",
        "Ivory Coast": "🇨🇮",
        Mali: "🇲🇱",
        "Burkina Faso": "🇧🇫",
        Cameroon: "🇨🇲",
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
          "Centre-Forward": "Centravanti",
          "Central Midfield": "Centrocampo Centrale",
          "Right Winger": "Ala Destra",
          "Left Winger": "Ala Sinistra",
          "Left-Back": "Terzino Sinistro",
          "Right-Back": "Terzino Destro",
          "Centre-Back": "Difensore Centrale",
          Goalkeeper: "Portiere",
          "Defensive Midfield": "Mediano",
          "Attacking Midfield": "Trequartista",
          "Left Midfield": "Centrocampo Sinistro",
          "Right Midfield": "Centrocampo Destro",
          "Secondary Striker": "Seconda Punta",
        }

        return translations[position] || position
      }

      // Formatta i giocatori
      const formattedPlayers = players.map((player) => {
        const marketValue = player.market_value_in_eur || 0
        const valueInMillions = marketValue / 1000000
        const formattedValue =
          valueInMillions >= 1000
            ? `€${(valueInMillions / 1000).toFixed(1)}B`
            : `€${Math.round(valueInMillions)}M`

        const age = player.date_of_birth ? calculateAge(player.date_of_birth) : null
        const nationality = countryFlags[player.country_of_citizenship || ""] || "🌍"

        return {
          id: player.player_id,
          name: player.name,
          age: age ? age.toString() : "N/A",
          ageNum: age || 0, // Per ordinamento
          nationality,
          position: translatePosition(player.position || ""),
          positionOriginal: player.position,
          marketValue: formattedValue,
          marketValueRaw: marketValue,
          height: player.height_in_cm ? `${player.height_in_cm} cm` : "N/A",
          foot: player.foot,
          contractExpiration: player.contract_expiration_date
            ? player.contract_expiration_date.toISOString().split("T")[0]
            : null,
          photo: player.image_url,
        }
      })

      // Ordina i giocatori
      formattedPlayers.sort((a, b) => {
        let comparison = 0

        switch (query.sortBy) {
          case "name":
            comparison = (a.name || "").localeCompare(b.name || "")
            break
          case "age":
            comparison = a.ageNum - b.ageNum
            break
          case "value":
            comparison = a.marketValueRaw - b.marketValueRaw
            break
          case "position":
            comparison = a.position.localeCompare(b.position)
            break
        }

        return query.order === "asc" ? comparison : -comparison
      })

      // Raggruppa per posizione
      const playersByPosition = formattedPlayers.reduce((acc: any, player) => {
        const pos = player.positionOriginal || "Unknown"
        if (!acc[pos]) {
          acc[pos] = []
        }
        acc[pos].push(player)
        return acc
      }, {})

      // Calcola statistiche della rosa
      const stats = {
        totalPlayers: formattedPlayers.length,
        totalValue: formattedPlayers.reduce((sum, p) => sum + p.marketValueRaw, 0),
        averageAge:
          formattedPlayers.reduce((sum, p) => sum + p.ageNum, 0) / formattedPlayers.length,
        foreigners: formattedPlayers.filter((p) => p.nationality !== "🇮🇹").length, // Assume club italiano
      }

      const formatValue = (value: number): string => {
        const valueInMillions = value / 1000000
        return valueInMillions >= 1000
          ? `€${(valueInMillions / 1000).toFixed(1)}B`
          : `€${Math.round(valueInMillions)}M`
      }

      return {
        club: {
          id: club.club_id,
          name: club.name,
          code: club.club_code,
          domesticCompetition: club.domestic_competition_id,
          stadium: club.stadium_name,
          stadiumCapacity: club.stadium_seats,
          coach: club.coach_name,
          lastSeason: club.last_season,
        },
        imageUrl: `https://tmssl.akamaized.net/images/wappen/head/${club.club_id}.png`,
        players: formattedPlayers,
        playersByPosition,
        stats: {
          totalPlayers: stats.totalPlayers,
          totalValue: formatValue(stats.totalValue),
          totalValueRaw: stats.totalValue,
          averageAge: stats.averageAge.toFixed(1),
          foreigners: stats.foreigners,
          foreignersPercentage: ((stats.foreigners / stats.totalPlayers) * 100).toFixed(1),
        },
      }
    } catch (error: any) {
      if (error.statusCode === 404) {
        throw error
      }

      throw createError({
        statusCode: 500,
        statusMessage: "Errore interno del server",
      })
    }
  },
})
