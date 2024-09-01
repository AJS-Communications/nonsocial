import jwt from 'jsonwebtoken'

export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig()
  const cookies = parseCookies(event)
  const token = cookies.auth_token

  if (token) {
    try {
      const decoded = jwt.verify(token, runtimeConfig.JWT_SECRET)
      event.context.auth = decoded
    } catch (error) {
      throw createError({
        statusCode: 401,
        message: 'Invalid token'
      })
    }
  }
})