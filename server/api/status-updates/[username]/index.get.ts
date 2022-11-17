import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  let data = []

  async function main() {
    return await prisma.statusUpdate.findMany({
      where: {
        author: {
          username: event.context.params.username
        }
      },
      include: {
        type: true,
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
    process.exit(1)
  }

  return data
})