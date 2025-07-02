import { ClubModel } from "../../lib/db/schema"
import { z } from "zod"

const PAGE_SIZE = 20

export default defineZodEventHandler({
  input: {
    query: z.object({
      page: z.coerce.number().optional().default(1),
      search: z.string().optional(),
    }),
  },
  async handler(event, { input: { query } }) {
    const { page, search } = query
    const filter: Record<string, any> = {}
    if (search) {
      // Case-insensitive partial match on name or club_code
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { club_code: { $regex: search, $options: "i" } },
      ]
    }
    const skip = (page - 1) * PAGE_SIZE
    const [total, data] = await Promise.all([
      ClubModel.countDocuments(filter),
      ClubModel.find(filter).skip(skip).limit(PAGE_SIZE),
    ])
    return {
      data: data,
      pagination: {
        total,
        page,
        pageSize: PAGE_SIZE,
      },
    }
  },
})
