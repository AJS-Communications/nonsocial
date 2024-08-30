import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let data: any = []

  async function main() {
    if (!event.context.params) return

    if (typeof query.cursor !== 'undefined') {
      return await prisma.bookmark.findMany({
        take: 10,
        skip: 1,
        cursor: {
          id: parseInt(query.cursor as string)
        },
        where: {
          author: {
            id: parseInt(event.context.params.userId)
          }
        },
        include: {
          post: {
            include: {
              author: true
            }
          }
        },
        orderBy: {
          createdDate: 'desc'
        }
      })
    }

    return await prisma.bookmark.findMany({
      take: 10,
      where: {
        author: {
          id: parseInt(event.context.params.userId)
        }
      },
      include: {
        post: {
          include: {
            author: true
          }
        }
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