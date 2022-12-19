import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'Jason Shimkoski',
        email: 'jshimkoski@me.com',
        username: 'jshimkoski',
        photoUrl: 'https://pbs.twimg.com/profile_images/1333160856188833792/tMNnHY9F_x96.jpg'
      },
      {
        name: 'George Takei',
        email: 'test@test.com',
        username: 'gtakei',
        photoUrl: 'https://pbs.twimg.com/profile_images/1395773050881196032/yCpIyKBt_x96.jpg'
      },
      {
        name: 'William Shatner',
        email: 'cool@awesome.com',
        username: 'wshatner',
        photoUrl: 'https://pbs.twimg.com/profile_images/1478179341582299138/2paPd3Uk_x96.jpg'
      },
    ]
  })
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })