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
    if (!event.context.params) return

    return await prisma.user.findFirst({
      where: {
        OR: [
          { id: event.context.params.userId },
          { username: event.context.params.userId }
        ]
      },
      include: {
        bookmarks: true,
        likes: true,
        boosts: true,
        following: true,
        followers: true,
        posts: {
          include: {
            author: true,
            _count: {
              select: {
                children: true,
                bookmarks: true,
                likes: true,
                boosts: true
              }
            }
          }
        },
        _count: {
          select: {
            posts: true,
            bookmarks: true,
            likes: true,
            boosts: true
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