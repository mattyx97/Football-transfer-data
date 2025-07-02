import { ClubModel } from "../../lib/db/schema"
import { z } from "zod"
import { createBadRequestError } from "../../utils/errors"

export default defineZodEventHandler({
  input: {
    params: z.object({
      id: z.string().regex(/^[a-fA-F0-9]{24}$/),
    }),
  },
  async handler(event, { input: { params } }) {
    const club = await ClubModel.findById({ club_id: params.id })
    if (!club) {
      return createBadRequestError()
    }
    return club
  },
})
