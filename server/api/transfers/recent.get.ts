import { TransferModel } from "../../lib/db/schema"
import { z } from "zod"

export default defineZodEventHandler({
  input: {
    query: z.object({
      limit: z.coerce.number().optional().default(5),
    }),
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
            to_club_name: { $exists: true, $nin: [null, "", "Missing"] },
          },
        },
        {
          $sort: { transfer_date: -1 },
        },
        {
          $limit: query.limit,
        },
        {
          $lookup: {
            from: "players",
            localField: "player_id",
            foreignField: "player_id",
            as: "player_info",
          },
        },
        {
          $project: {
            player_id: 1,
            player_name: 1,
            from_club_name: 1,
            to_club_name: 1,
            from_club_id: 1,
            to_club_id: 1,
            transfer_fee: 1,
            market_value_in_eur: 1,
            transfer_date: 1,
            player_photo: { $arrayElemAt: ["$player_info.image_url", 0] },
            player_nationality: { $arrayElemAt: ["$player_info.country_of_citizenship", 0] },
          },
        },
      ])

      // Mappa i paesi ai flag emoji (simplified per i trasferimenti)
      const countryFlags: Record<string, string> = {
        England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        Argentina: "🇦🇷",
        Ecuador: "🇪🇨",
        France: "🇫🇷",
        Brazil: "🇧🇷",
        Spain: "🇪🇸",
        Portugal: "🇵🇹",
        Germany: "🇩🇪",
        Netherlands: "🇳🇱",
        Belgium: "🇧🇪",
        Italy: "🇮🇹",
        Croatia: "🇭🇷",
        Poland: "🇵🇱",
      }


      // Formatta i risultati
      const formattedTransfers = recentTransfers.map((transfer, index) => {
        // Usa principalmente market_value_in_eur che è già in euro
        let transferValue = transfer.market_value_in_eur || 0

        // Se transfer_fee è disponibile e contiene "€", prova a parsarlo
        if (
          transfer.transfer_fee &&
          typeof transfer.transfer_fee === "string" &&
          transfer.transfer_fee.includes("€")
        ) {
          const feeMatch = transfer.transfer_fee.match(/€([\d,.]+)([KMB])?/)
          if (feeMatch) {
            let amount = parseFloat(feeMatch[1].replace(/,/g, ""))
            const unit = feeMatch[2]

            if (unit === "K") {
              amount *= 1000
            } else if (unit === "M") {
              amount *= 1000000
            } else if (unit === "B") {
              amount *= 1000000000
            }

            transferValue = amount
          }
        }

        const valueInMillions = transferValue / 1000000
        const formattedValue =
          valueInMillions >= 1000
            ? `€${(valueInMillions / 1000).toFixed(1)}B`
            : `€${Math.round(valueInMillions)}M`

        // Formatta la data
        const transferDate = new Date(transfer.transfer_date)
        const formattedDate = transferDate.toISOString().split("T")[0] // YYYY-MM-DD

        // Usa nazionalità e foto reali dal database
        const nationality = countryFlags[transfer.player_nationality] || "🌍"

        return {
          player: transfer.player_name,
          from: transfer.from_club_name,
          to: transfer.to_club_name,
          fromClubId: transfer.from_club_id,
          toClubId: transfer.to_club_id,
          value: formattedValue,
          date: formattedDate,
          playerPhoto: transfer.player_photo || "/default-player.png",
          fromLogo: `https://tmssl.akamaized.net/images/wappen/head/${transfer.from_club_id}.png`,
          toLogo: `https://tmssl.akamaized.net/images/wappen/head/${transfer.to_club_id}.png`,
          nationality,
        }
      })

      return {
        recentTransfers: formattedTransfers,
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Errore interno del server",
      })
    }
  },
})
