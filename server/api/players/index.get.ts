import { PlayerModel } from "../../lib/db/schema"
import { z } from "zod"

export default defineZodEventHandler({
  input: {
    query: z.object({
      page: z.coerce.number().optional().default(1),
      pageSize: z.coerce.number().optional().default(20),
    }),
  },
  async handler(event, { input: { query } }) {
    const [total, data] = await Promise.all([
      PlayerModel.countDocuments(),
      PlayerModel.find().skip((query.page - 1) * query.pageSize).limit(query.pageSize),
    ])

    return {
      data,
      pagination: {
        total,
        page: query.page,
        pageSize: query.pageSize,
      },
    }
  },
})
