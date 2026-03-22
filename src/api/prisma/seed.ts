import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const userId = '123e4567-e89b-12d3-a456-426614174000'
  
  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: 'test@foodiegen.com',
      fullName: 'Test User',
      passwordHash: 'dummy',
    },
  })

  await prisma.videoProject.upsert({
    where: { id: userId }, // Using same UUID for simple testing
    update: {},
    create: {
      id: userId,
      userId: user.id,
      title: 'Demo Project',
      status: 'draft',
    },
  })

  console.log('Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
