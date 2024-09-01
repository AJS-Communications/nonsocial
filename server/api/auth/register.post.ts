import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { username, email, password } = await readBody(event)

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword
    }
  })

  return { message: 'User registered successfully' }
})