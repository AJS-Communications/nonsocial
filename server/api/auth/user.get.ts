import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  let data = null

  async function main() {
    if (event.context.auth?.userId) {
      return await prisma.user.findUnique({
        where: {
          id: event.context.auth.userId,
        },
        include: {
          bookmarks: true,
          likes: true,
          boosts: true,
          following: true,
          followers: true
        }
      })
    } else {
      return null
    }
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