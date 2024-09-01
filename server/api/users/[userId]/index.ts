import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true
    }
  }
})

export default defineEventHandler(async (event) => {
  let data = null

  async function main() {
    if (!event.context.params) return

    return await prisma.user.findUnique({
      where: {
        id: event.context.params.userId,
      },
      include: {
        bookmarks: true,
        likes: true,
        boosts: true,
        following: true,
        followers: true
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