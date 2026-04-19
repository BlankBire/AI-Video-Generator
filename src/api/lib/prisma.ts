import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  console.log('[PRISMA] Initializing new PrismaClient instance...');
  const client = new PrismaClient({
    log: ['error', 'warn'],
  });
  
  // Test connection
  client.$connect()
    .then(() => console.log('[PRISMA] Database connected successfully.'))
    .catch((err) => console.error('[PRISMA] Database connection failed:', err));

  return client;
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
