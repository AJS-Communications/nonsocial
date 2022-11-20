import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  let data = null

  async function main() {
    const [bookmarkCount, favoriteCount, commentCount, comments, post] = await prisma.$transaction([
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
      prisma.post.count({
        where: {
          parentId: parseInt(event.context.params.postId)
        }
      }),
      prisma.post.findMany({
        where: {
          parentId: parseInt(event.context.params.postId),
        },
        include: {
          author: true
        },
        orderBy: {
          createdDate: 'desc'
        }
      }),
      prisma.post.findFirst({
        where: {
          id: parseInt(event.context.params.postId),
          author: {
            id: parseInt(event.context.params.authorId)
          },
          published: true,
          visibility: 'PUBLIC'
        },
        include: {
          author: true
        }
      })
    ])
    return {
      bookmarkCount,
      favoriteCount,
      commentCount,
      comments,
      post
    }
    // return await prisma.post.findFirst({
    //   where: {
    //     id: parseInt(event.context.params.postId),
    //     author: {
    //       id: parseInt(event.context.params.authorId)
    //     },
    //     published: true,
    //     visibility: 'PUBLIC'
    //   },
    //   include: {
    //     author: true
    //   }
    // })
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