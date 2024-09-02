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

    const [bookmarkCount, likeCount, boostCount, commentCount] = await prisma.$transaction([
      prisma.bookmark.count({
        where: {
          postId: event.context.params.postId
        }
      }),
      prisma.like.count({
        where: {
          postId: event.context.params.postId
        }
      }),
      prisma.boost.count({
        where: {
          postId: event.context.params.postId
        }
      }),
      prisma.post.count({
        where: {
          parentId: event.context.params.postId
        }
      })
    ])

    return {
      bookmarkCount,
      likeCount,
      boostCount,
      commentCount
    }
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