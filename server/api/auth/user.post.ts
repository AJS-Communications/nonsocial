import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createError({
      status: 401,
      message: 'Unauthorized'
    })
  }

  const body = await readBody(event)

  let data = null

  async function main() {
    return await prisma.user.update({
      where: {
        id: body.id
      },
      data: {
        username: body.username,
        email: body.email,
        name: body.name,
        photoUrl: body.photoUrl || '/user-avatar.svg',
        bio: body.bio
      }
    })
  }

  try {
    data = await main()
    await prisma.$disconnect()
  } catch (e) {
    await prisma.$disconnect()
    throw createError(e as Error)
  }

  return data
})