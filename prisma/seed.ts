import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Jason Shimkoski',
      email: 'jshimkoski@me.com',
      username: 'jshimkoski',
      photoUrl: 'https://pbs.twimg.com/profile_images/1333160856188833792/tMNnHY9F_x96.jpg'
    },
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