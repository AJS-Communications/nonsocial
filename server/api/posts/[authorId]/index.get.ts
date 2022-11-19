import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  let data = []

  async function main() {
    return await prisma.post.findMany({
      where: {
        author: {
          id: parseInt(event.context.params.authorId)
        },
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