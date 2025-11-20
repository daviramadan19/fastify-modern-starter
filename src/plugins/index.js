import { getPrismaClient, disconnectPrisma } from '../config/prisma.js';
import jwtPlugin from './jwt.js';
import swaggerPlugin from './swagger.js';
import corsPlugin from './cors.js';
import fp from 'fastify-plugin';
import helmet from '@fastify/helmet';

/**
 * Prisma Plugin for Fastify
 * Decorates fastify instance with Prisma client
 */
async function prismaPlugin(fastify, options) {
  const prisma = getPrismaClient();

  // Decorate fastify instance with prisma
  fastify.decorate('prisma', prisma);

  // Handle graceful shutdown
  fastify.addHook('onClose', async (instance) => {
    await disconnectPrisma();
  });

  fastify.log.info('Prisma plugin registered');
}

/**
 * Register all Fastify plugins
 */
export async function registerPlugins(fastify) {
  // Prisma Database plugin (register first for other plugins to use)
  await fastify.register(fp(prismaPlugin, { name: 'prisma' }));

  // CORS plugin
  await fastify.register(corsPlugin);

  // Helmet for security headers
  await fastify.register(helmet, {
    contentSecurityPolicy: false,
  });

  // JWT plugin
  await fastify.register(jwtPlugin);

  // Swagger plugin (optional, for API documentation)
  // Uncomment to enable swagger documentation
  // if (process.env.NODE_ENV !== 'production') {
  //   await fastify.register(swaggerPlugin);
  // }
}
