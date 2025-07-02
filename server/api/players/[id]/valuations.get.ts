import { PlayerValuationModel } from "../../../lib/db/schema"
import { z } from "zod"

export default defineZodEventHandler({
  input: {
    params: z.object({
      id: z.coerce.number(),
    }),
  },
  async handler(event, { input: { params } }) {
    try {
      const valuations = await PlayerValuationModel.find({ player_id: params.id })
        .sort({ date: -1 })
        .lean()

      if (!valuations || valuations.length === 0) {
        return {
          valuations: [],
          chartData: [],
        }
      }

      // Formatta le valutazioni
      const formattedValuations = valuations.map((valuation) => {
        const value = valuation.market_value_in_eur || 0
        const valueInMillions = value / 1000000
        const formattedValue =
          valueInMillions >= 1000
            ? `€${(valueInMillions / 1000).toFixed(1)}B`
            : `€${Math.round(valueInMillions)}M`

        return {
          date: valuation.date ? valuation.date.toISOString().split("T")[0] : "N/A",
          value: formattedValue,
          valueRaw: value,
          clubId: valuation.current_club_id,
        }
      })

      // Crea dati per il grafico
      const chartData = formattedValuations.map((valuation) => ({
        date: valuation.date,
        value: valuation.valueRaw / 1000000, // Valore in milioni per il grafico
        formattedValue: valuation.value,
      }))

      // Calcola statistiche
      const values = formattedValuations.map((v) => v.valueRaw).filter((v) => v > 0)
      const maxValue = Math.max(...values)
      const minValue = Math.min(...values)
      // Ora che le valutazioni sono ordinate per data decrescente, il primo è il più recente
      const currentValue = values[0] || 0
      const previousValue = values[1] || 0

      // Calcola la variazione percentuale
      const changePercentNum =
        previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0
      const changePercent = changePercentNum.toFixed(1)

      const formatValue = (value: number): string => {
        const valueInMillions = value / 1000000
        return valueInMillions >= 1000
          ? `€${(valueInMillions / 1000).toFixed(1)}B`
          : `€${Math.round(valueInMillions)}M`
      }

      return {
        valuations: formattedValuations,
        chartData,
        stats: {
          current: formatValue(currentValue),
          max: formatValue(maxValue),
          min: formatValue(minValue),
          changePercent: `${changePercentNum >= 0 ? "+" : ""}${changePercent}%`,
          totalEntries: valuations.length,
        },
      }
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: "Errore interno del server",
      })
    }
  },
})
