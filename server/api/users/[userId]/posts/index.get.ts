import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createError({
      status: 401,
      message: 'Unauthorized'
    })
  }

  const query = getQuery(event)
  let data: any = []

  async function main() {
    if (!event.context.params) return

    const following = await prisma.follow.findMany({
      where: { authorId: event.context.params.userId },
      select: {
        followingId: true
      }
    }) || []

    const likes = await prisma.like.findMany({
      where: { 
        authorId: { 
          in: [...following.map(i => i.followingId)]
        }
      },
      select: {
        postId: true
      }
    }) || []

    const boosts = await prisma.boost.findMany({
      where: { 
        authorId: { 
          in: [...following.map(i => i.followingId)]
        }
      },
      select: {
        postId: true
      }
    }) || []
    

    if (typeof query.cursor !== 'undefined') {
      return await prisma.post.findMany({
        take: 10,
        skip: 1,
        cursor: {
          id: query.cursor as string
        },
        where: {
          OR: [
            {
              id: {
                in: [
                  ...likes.map(i => i.postId),
                  ...boosts.map(i => i.postId)
                ]
              }
            },
            {
              author: {
                id: {
                  in: [
                    ...following.map(i => i.followingId),
                    event.context.params.userId
                  ]
                }
              }
            }
          ],
          parentId: null,
          published: true,
          visibility: 'PUBLIC'
        },
        select: {
          id: true
        },
        orderBy: {
          createdDate: 'desc'
        }
      })
    }

    return await prisma.post.findMany({
      take: 10,
      where: {
        OR: [
          {
            id: {
              in: [
                ...likes.map(i => i.postId),
                ...boosts.map(i => i.postId)
              ]
            }
          },
          {
            author: {
              id: {
                in: [
                  ...following.map(i => i.followingId),
                  event.context.params.userId
                ]
              }
            }
          }
        ],
        parentId: null,
        published: true,
        visibility: 'PUBLIC'
      },
      select: {
        id: true
      },
      orderBy: {
        createdDate: 'desc'
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