import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true
    }
  }
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  let data = null

  async function main() {
    if (!event.context.params) return

    return await prisma.boost.create({
      data: {
        published: true,
        authorId: event.context.params.userId,
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