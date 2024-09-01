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
    return await prisma.user.findMany({
      where: {
        visibility: 'PUBLIC'
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