import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  let data = null

  async function main() {
    return await prisma.like.create({
      data: {
        published: true,
        authorId: parseInt(event.context.params.userId),
        postId: body.postId
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