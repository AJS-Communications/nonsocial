import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  let data = null

  async function main() {
    return await prisma.post.findFirst({
      where: {
        id: parseInt(event.context.params.postId),
        author: {
          id: parseInt(event.context.params.authorId)
        }
      },
      include: {
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
  }

  return data
})