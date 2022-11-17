import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  let data = null

  async function main() {
    return await prisma.statusUpdate.findFirst({
      where: {
        id: parseInt(event.context.params.id),
        author: {
          username: event.context.params.username
        }
      },
      include: {
        type: true,
        author: true
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