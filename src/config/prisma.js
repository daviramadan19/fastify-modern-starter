import { PrismaClient } from '@prisma/client';
import { Logger } from '../utils/logger.js';

/**
 * Prisma Client instance
 * Singleton pattern to prevent multiple instances
 */
let prismaInstance;

export function getPrismaClient() {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    });

    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      prismaInstance.$on('query', (e) => {
        Logger.debug('Query', {
          query: e.query,
          duration: `${e.duration}ms`,
        });
      });
    }

    Logger.info('Prisma Client initialized');
  }

  return prismaInstance;
}

/**
 * Disconnect Prisma Client
 */
export async function disconnectPrisma() {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    Logger.info('Prisma Client disconnected');
  }
}

/**
 * Test database connection
 */
export async function testDatabaseConnection() {
  try {
    const client = getPrismaClient();
    await client.$queryRaw`SELECT 1`;
    Logger.info('Database connection successful');
    return true;
  } catch (error) {
    Logger.error('Database connection failed', error);
    return false;
  }
}

// Export singleton instance
export const prisma = getPrismaClient();


