import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let data: any = []

  async function main() {
    const following = await prisma.follow.findMany({
      where: { authorId: parseInt(event.context.params.userId) },
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
          id: parseInt(query.cursor as string)
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
                    parseInt(event.context.params.userId)
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
                  parseInt(event.context.params.userId)
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
    console.error(e)
    await prisma.$disconnect()
  }

  return data
})