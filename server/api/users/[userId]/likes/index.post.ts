import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createError({
      status: 401,
      message: 'Unauthorized'
    })
  }

  const body = await readBody(event)

  let data = null

  async function main() {
    if (!event.context.params) return

    return await prisma.like.create({
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
    await prisma.$disconnect()
    throw createError(e as Error)
  }

  return data
})