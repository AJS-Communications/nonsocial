import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const { username, password } = await readBody(event)

  const user = await prisma.user.findUnique({ where: { username } })

  if (!user || !await bcrypt.compare(password, user.password)) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

  const token = jwt.sign({ userId: user.id }, runtimeConfig.JWT_SECRET, { expiresIn: '1h' })

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 // 1 hour
  })

  return { message: 'Logged in successfully' }
})