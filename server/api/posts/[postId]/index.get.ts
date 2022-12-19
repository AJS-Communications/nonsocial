import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  let data = null

  async function main() {
    const [bookmarkCount, likeCount, boostCount, commentCount, commenters, post] = await prisma.$transaction([
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
      }),
      prisma.post.findMany({
        where: {
          parentId: parseInt(event.context.params.postId)
        },
        select: {
          id: true,
          author: true
        }
      }),
      prisma.post.findFirst({
        where: {
          id: parseInt(event.context.params.postId),
          published: true,
          visibility: 'PUBLIC'
        },
        include: {
          author: true,
          likes: {
            include: {
              author: true
            }
          },
          boosts: {
            include: {
              author: true
            }
          }
        }
      })
    ])
    return Object.assign({}, post, {
      counts: {
        bookmarkCount,
        likeCount,
        boostCount,
        commentCount,
      },
      commenters
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