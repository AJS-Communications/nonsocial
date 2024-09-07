import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createError({
      status: 401,
      message: 'Unauthorized'
    })
  }

  let data: any = []

  async function main() {
    return await prisma.user.findMany({
      where: {
        visibility: 'PUBLIC'
      },
      include: {
        _count: {
          select: {
            bookmarks: true,
            likes: true,
            boosts: true,
            followers: true,
            following: true
          }
        }
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