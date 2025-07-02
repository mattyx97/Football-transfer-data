import type { EventHandlerRequest, H3Event } from "h3"
import type { z } from "zod"
import { H3Error } from "h3"

export function defineZodEventHandler<
  Request extends EventHandlerRequest,
  Response,
  P extends z.Schema | undefined = undefined,
  Q extends z.Schema | undefined = undefined,
  B extends z.Schema | undefined = undefined,
>(
  handler: {
    input?: {
      params?: P
      query?: Q
      body?: B
    }
    handler: (
      event: H3Event<Request>,
      payload: {
        input: {
          params: P extends z.Schema ? z.infer<P> : never
          query: Q extends z.Schema ? z.infer<Q> : never
          body: B extends z.Schema ? z.infer<B> : never
        }
      }
    ) => Response | Promise<Response>
  },
) {
  return defineEventHandler(async (event) => {
    const { input, handler: h } = handler
    const { params, query, body } = input || {}

    try {
      /* INPUT */
      let parsedParams
      let parsedQuery
      let parsedBody

      if (params) {
        const { data, error } = await getValidatedRouterParams(event, params.safeParse)
        if (error) {
          throw createBadRequestError(error.toString())
        }
        parsedParams = data
      }
      if (query) {
        const { data, error } = await getValidatedQuery(event, query.safeParse)
        if (error) {
          throw createBadRequestError(error.toString())
        }
        parsedQuery = data
      }
      if (body) {
        const { data, error } = await readValidatedBody(event, body.safeParse)
        if (error) {
          throw createBadRequestError(error.toString())
        }
        parsedBody = data
      }

      return h(event, {
        input: {
          params: parsedParams,
          query: parsedQuery,
          body: parsedBody,
        }
      })
    }
    catch (err: unknown) {
      if (err instanceof H3Error)
        throw err
      throw createInternalServerError()
    }
  })
}