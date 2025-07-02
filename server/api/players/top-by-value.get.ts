import { PlayerModel } from "../../lib/db/schema"
import { z } from "zod"

export default defineZodEventHandler({
  input: {
    query: z.object({
      limit: z.coerce.number().optional().default(5),
    }),
  },
  async handler(event, { input: { query } }) {
    try {
      const topPlayers = await PlayerModel.aggregate([
        {
          $match: {
            market_value_in_eur: { $exists: true, $gt: 0 },
            name: { $exists: true, $nin: [null, "", "Missing"] },
          },
        },
        {
          $sort: { market_value_in_eur: -1 },
        },
        {
          $limit: query.limit,
        },
        {
          $project: {
            player_id: 1,
            name: 1,
            market_value_in_eur: 1,
            current_club_id: 1,
            current_club_name: 1,
            position: 1,
            country_of_citizenship: 1,
            date_of_birth: 1,
            image_url: 1,
          },
        },
      ])

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

      // Mappa delle posizioni abbreviate
      const positionMap: Record<string, string> = {
        "Centre-Forward": "CF",
        "Right Winger": "RW",
        "Left Winger": "LW",
        "Attacking Midfield": "AM",
        "Central Midfield": "CM",
        "Defensive Midfield": "DM",
        "Left-Back": "LB",
        "Right-Back": "RB",
        "Centre-Back": "CB",
        Goalkeeper: "GK",
        "Secondary Striker": "SS",
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

      // Formatta i risultati
      const formattedPlayers = topPlayers.map((player) => {
        const valueInMillions = player.market_value_in_eur / 1000000
        const formattedValue =
          valueInMillions >= 1000
            ? `€${(valueInMillions / 1000).toFixed(1)}B`
            : `€${valueInMillions.toFixed(0)}M`

        // Calcola crescita mock basata sulla posizione nell'elenco e valore
        const baseGrowth = Math.floor(Math.random() * 15) + 8 // 8-22%
        const growthPercentage = `+${baseGrowth}%`

        const age = player.date_of_birth ? calculateAge(player.date_of_birth) : null
        const nationality = countryFlags[player.country_of_citizenship] || "🌍"
        const position = positionMap[player.position] || player.position || "N/A"

        return {
          name: player.name,
          club: player.current_club_name || "Sconosciuto",
          clubId: player.current_club_id,
          value: formattedValue,
          change: growthPercentage,
          position,
          nationality,
          age: age ? age.toString() : "N/A",
          photo: player.image_url || "/default-player.png",
          clubLogo: `https://tmssl.akamaized.net/images/wappen/head/${player.current_club_id}.png`,
        }
      })

      return {
        topPlayers: formattedPlayers,
      }
    } catch (error) {
      console.error("Errore nel recupero dei top players:", error)
      throw createError({
        statusCode: 500,
        statusMessage: "Errore interno del server",
      })
    }
  },
})
