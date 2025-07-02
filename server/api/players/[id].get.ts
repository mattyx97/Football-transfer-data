import { PlayerModel } from "../../lib/db/schema"
import { z } from "zod"

export default defineZodEventHandler({
  input: {
    params: z.object({
      id: z.coerce.number(),
    }),
  },
  async handler(event, { input: { params } }) {
    const player = await PlayerModel.findOne({ player_id: params.id })
    if (!player) {
      return createBadRequestError()
    }
    return player
  },
})
