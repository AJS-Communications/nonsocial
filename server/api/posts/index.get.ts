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
    return await prisma.post.findMany({
      take: parseInt(runtimeConfig.public.RESULTS_PER_PAGE),
      skip: query.cursor ? 1 : undefined,
      cursor: query.cursor ? {
        id: query.cursor as string
      } : undefined,
      where: {
        parentId: null,
        published: true,
        visibility: 'PUBLIC'
      },
      include: {
        author: true,
        _count: {
          select: {
            children: true,
            bookmarks: true,
            likes: true,
            boosts: true
          }
        }
      },
      orderBy: {
        createdDate: 'desc',
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