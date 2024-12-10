import { PrismaClient } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'

// For Bun, we use its built-in WebSocket implementation
neonConfig.webSocketConstructor = WebSocket

declare global {
  var prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  // Use the same configuration for both development and production
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    log: ['query', 'error', 'warn']
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export { prisma }