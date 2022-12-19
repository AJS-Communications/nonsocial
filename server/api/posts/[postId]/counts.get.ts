import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  let data = null

  async function main() {
    const [bookmarkCount, likeCount, boostCount, commentCount] = await prisma.$transaction([
      prisma.bookmark.count({
        where: {
          postId: parseInt(event.context.params.postId)
        }
      }),
      prisma.like.count({
        where: {
          postId: parseInt(event.context.params.postId)
        }
      }),
      prisma.boost.count({
        where: {
          postId: parseInt(event.context.params.postId)
        }
      }),
      prisma.post.count({
        where: {
          parentId: parseInt(event.context.params.postId)
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
    console.error(e)
    await prisma.$disconnect()
  }

  return data
})