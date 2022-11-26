import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let data: any = []

  async function main() {
    const follows = await prisma.follow.findMany({
      where: { authorId: parseInt(event.context.params.userId) },
      select: {
        followeeId: true
      }
    }) || []

    const favorites = await prisma.favorite.findMany({
      where: { 
        authorId: { 
          in: [...follows.map(i => i.followeeId)]
        }
      },
      select: {
        postId: true
      }
    }) || []

    const reposts = await prisma.repost.findMany({
      where: { 
        authorId: { 
          in: [...follows.map(i => i.followeeId)]
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
                  ...favorites.map(i => i.postId),
                  ...reposts.map(i => i.postId)
                ]
              }
            },
            {
              author: {
                id: {
                  in: [
                    ...follows.map(i => i.followeeId),
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
        include: {
          author: true
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
                ...favorites.map(i => i.postId),
                ...reposts.map(i => i.postId)
              ]
            }
          },
          {
            author: {
              id: {
                in: [
                  ...follows.map(i => i.followeeId),
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
      include: {
        author: true
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