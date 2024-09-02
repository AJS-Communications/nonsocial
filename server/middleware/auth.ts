import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const cookies = parseCookies(event)
  const token = cookies.token

  if (token) {
    try {
      const decoded = await jwt.verify(token, runtimeConfig.JWT_SECRET)
      event.context.auth = decoded
    } catch (error) {
      deleteCookie(event, 'token')
      event.context.auth = null
      return sendRedirect(event, '/login')
    }
  }
})