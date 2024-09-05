import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createError({
      status: 401,
      message: 'Unauthorized'
    })
  }

  const runtimeConfig = useRuntimeConfig()
  const query = getQuery(event)
  let data: any = []

  async function main() {
    if (!event.context.params) return

    if (typeof query.cursor !== 'undefined') {
      return await prisma.post.findMany({
        take: parseInt(runtimeConfig.public.RESULTS_PER_PAGE),
        skip: 1,
        cursor: {
          id: query.cursor as string
        },
        where: {
          parentId: event.context.params.postId,
        },
        include: {
          author: true
        },
        orderBy: {
          createdDate: 'desc'
        }
      })
    }

    return await prisma.post.findMany({
      take: parseInt(runtimeConfig.public.RESULTS_PER_PAGE),
      where: {
        parentId: event.context.params.postId,
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
    await prisma.$disconnect()
    throw createError(e as Error)
  }

  return data
})