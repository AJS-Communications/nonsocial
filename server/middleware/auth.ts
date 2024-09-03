import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const cookies = parseCookies(event)
  const token = cookies.token
  const refreshToken = cookies['refresh-token']

  if (token) {
    try {
      const decoded = await jwt.verify(token, runtimeConfig.JWT_SECRET)
      event.context.auth = decoded
    } catch (error) {
      event.context.auth = null
      deleteCookie(event, 'token')
    }
  }

  if (!event.context.auth && refreshToken) {
    try {
      const decoded = await jwt.verify(refreshToken, runtimeConfig.JWT_SECRET)
      event.context.auth = decoded

      const newRefreshToken = jwt.sign({
        userId: event.context.auth.userId
      }, runtimeConfig.JWT_SECRET, {
        expiresIn: '30d'
      })
  
      setCookie(event, 'refresh-token', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30d
      })
  
      const token = jwt.sign({
        userId: event.context.auth.userId
      }, runtimeConfig.JWT_SECRET, {
        expiresIn: '1h'
      })
  
      setCookie(event, 'token', token, {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 // 1h
      })

      return sendRedirect(event, event.node.req.url || '/')
    } catch (error) {
      event.context.auth = null
      deleteCookie(event, 'refresh-token')
      deleteCookie(event, 'token')
    }
  }

  if (!event.context.auth) {
    const headerToken = getHeader(event, 'Authorization')?.split(' ')[1]
    if (headerToken) {
      try {
        const decoded = await jwt.verify(headerToken, runtimeConfig.JWT_SECRET)
        event.context.auth = decoded
      } catch (error) {
        event.context.auth = null
        setHeader(event, 'Authorization', '')
      }
    }
  }
})