import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createError({
      status: 401,
      message: 'Unauthorized'
    })
  }

  let data = null

  async function main() {
    return await prisma.user.findUnique({
      where: {
        id: event.context.auth.userId,
      },
      include: {
        bookmarks: true,
        likes: true,
        boosts: true,
        followers: {
          include: {
            follower: true
          }
        },
        following: {
          include: {
            follower: true
          }
        },
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