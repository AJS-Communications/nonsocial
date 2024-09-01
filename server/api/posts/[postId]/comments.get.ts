import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true
    }
  }
})

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let data: any = []

  async function main() {
    if (!event.context.params) return

    if (typeof query.cursor !== 'undefined') {
      return await prisma.post.findMany({
        take: 10,
        skip: 1,
        cursor: {
          id: query.cursor as string
        },
        where: {
          parentId: event.context.params.postId,
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
        parentId: event.context.params.postId,
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