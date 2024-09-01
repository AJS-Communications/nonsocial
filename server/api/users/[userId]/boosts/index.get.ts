import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true
    }
  }
})

export default defineEventHandler(async (event) => {
  let data: any = []

  async function main() {
    if (!event.context.params) return

    return await prisma.boost.findMany({
      where: {
        author: {
          id: event.context.params.userId
        }
      },
      include: {
        author: true,
        post: true
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