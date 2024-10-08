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
  let data = null

  async function main() {
    if (!event.context.params) return

    return await prisma.post.findFirst({
      where: {
        id: event.context.params.postId,
        published: true,
        visibility: 'PUBLIC'
      },
      include: {
        author: true,
        parent: {
          include: {
            author: true,
            likes: {
              include: {
                author: true
              }
            },
            boosts: {
              include: {
                author: true
              }
            },
            _count: {
              select: {
                children: true,
                bookmarks: true,
                likes: true,
                boosts: true
              }
            }
          }
        },
        children: {
          take: parseInt(runtimeConfig.public.RESULTS_PER_PAGE),
          orderBy: [
            { createdDate: 'desc' },
            { likes: { _count: 'desc' } },
            { boosts: { _count: 'desc' } },
            { children: { _count: 'desc' } }
          ],
          include: {
            author: true,
            likes: {
              include: {
                author: true
              }
            },
            boosts: {
              include: {
                author: true
              }
            },
            _count: {
              select: {
                children: true,
                bookmarks: true,
                likes: true,
                boosts: true
              }
            },
            parent: {
              include: {
                author: true,
                likes: {
                  include: {
                    author: true
                  }
                },
                boosts: {
                  include: {
                    author: true
                  }
                },
                _count: {
                  select: {
                    children: true,
                    bookmarks: true,
                    likes: true,
                    boosts: true
                  }
                }
              }
            },
            children: {
              take: 1,
              orderBy: [
                { createdDate: 'desc' },
                { likes: { _count: 'desc' } },
                { boosts: { _count: 'desc' } },
                { children: { _count: 'desc' } }
              ],
              include: {
                author: true,
                parent: {
                  include: {
                    author: true,
                    likes: {
                      include: {
                        author: true
                      }
                    },
                    boosts: {
                      include: {
                        author: true
                      }
                    },
                    _count: {
                      select: {
                        children: true,
                        bookmarks: true,
                        likes: true,
                        boosts: true
                      }
                    }
                  }
                },
                likes: {
                  include: {
                    author: true
                  }
                },
                boosts: {
                  include: {
                    author: true
                  }
                },
                _count: {
                  select: {
                    children: true,
                    bookmarks: true,
                    likes: true,
                    boosts: true
                  }
                }
              }
            }
          }
        },
        likes: {
          include: {
            author: true
          }
        },
        boosts: {
          include: {
            author: true
          }
        },
        _count: {
          select: {
            children: true,
            bookmarks: true,
            likes: true,
            boosts: true
          }
        }
      },
      orderBy: [
        { createdDate: 'desc' },
        { likes: { _count: 'desc' } },
        { boosts: { _count: 'desc' } },
        { children: { _count: 'desc' } }
      ]
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