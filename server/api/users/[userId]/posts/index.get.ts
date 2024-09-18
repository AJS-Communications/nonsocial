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

    const following = await prisma.follow.findMany({
      where: { authorId: event.context.params.userId },
      select: {
        followerId: true
      }
    }) || []

    const children = await prisma.post.findMany({
      where: {
        authorId: { 
          in: [...following.map(i => i.followerId)]
        },
        parentId: {
          not: null
        }
      },
      select: {
        parentId: true
      }
    }) || []

    const likes = await prisma.like.findMany({
      where: { 
        authorId: { 
          in: [...following.map(i => i.followerId)]
        }
      },
      select: {
        postId: true
      }
    }) || []

    const boosts = await prisma.boost.findMany({
      where: { 
        authorId: { 
          in: [...following.map(i => i.followerId)]
        }
      },
      select: {
        postId: true
      }
    }) || []

    return await prisma.post.findMany({
      take: parseInt(runtimeConfig.public.RESULTS_PER_PAGE),
      skip: query.cursor ? 1 : undefined,
      cursor: query.cursor ? {
        id: query.cursor as string
      } : undefined,
      where: {
        OR: [
          {
            id: {
              in: [
                ...children.map(i => i.parentId as string),
                ...likes.map(i => i.postId),
                ...boosts.map(i => i.postId)
              ]
            }
          },
          {
            author: {
              id: {
                in: [
                  ...following.map(i => i.followerId),
                  event.context.params.userId
                ]
              }
            }
          }
        ],
        parentId: null,
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
          take: 1,
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