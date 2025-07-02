import { PlayerModel } from "../../lib/db/schema"
import { z } from "zod"

const PAGE_SIZE = 20

export default defineZodEventHandler({
  input: {
    query: z.object({
      page: z.coerce.number().optional().default(1),
    }),
  },
  async handler(event, { input: { query } }) {
    const [total, data] = await Promise.all([
      PlayerModel.countDocuments(),
      PlayerModel.find().skip((query.page - 1) * PAGE_SIZE).limit(PAGE_SIZE),
    ])

    return {
      data,
      pagination: {
        total,
        page: query.page,
        pageSize: PAGE_SIZE,
      },
    }
  },
})
