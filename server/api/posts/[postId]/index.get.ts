import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  let data = null

  async function main() {
    const [bookmarkCount, favoriteCount, repostCount, commentCount, post] = await prisma.$transaction([
      prisma.bookmark.count({
        where: {
          postId: parseInt(event.context.params.postId)
        }
      }),
      prisma.favorite.count({
        where: {
          postId: parseInt(event.context.params.postId)
        }
      }),
      prisma.repost.count({
        where: {
          postId: parseInt(event.context.params.postId)
        }
      }),
      prisma.post.count({
        where: {
          parentId: parseInt(event.context.params.postId)
        }
      }),
      prisma.post.findFirst({
        where: {
          id: parseInt(event.context.params.postId),
          published: true,
          visibility: 'PUBLIC'
        },
        include: {
          author: true
        }
      })
    ])
    return Object.assign({}, post, {
      counts: {
        bookmarkCount,
        favoriteCount,
        repostCount,
        commentCount,
      }
    })
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