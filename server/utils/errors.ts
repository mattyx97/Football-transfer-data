export function createBadRequestError(message?: string) {
  return createError({
    statusCode: 400,
    statusMessage: "Bad Request",
    message,
  })
}

export function createUnauthorizedError(message?: string) {
  return createError({
    statusCode: 401,
    statusMessage: "Unauthorized",
    message,
  })
}

export function createInternalServerError(message?: string) {
  return createError({
    statusCode: 500,
    statusMessage: "Internal Server Error",
    message: message ?? "An internal server error occurred",
  })
}
