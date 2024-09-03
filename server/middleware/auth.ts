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
      event.context.auth = null
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
      }
    }
  }

  if (event.context.auth?.userId) {
    const token = jwt.sign({
      userId: event.context.auth.userId
    }, runtimeConfig.JWT_SECRET, {
      expiresIn: '24h'
    })

    setCookie(event, 'token', token, {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24h
    })
  }
})