// Load database URL builder first (must be before any Prisma imports)
import '../prisma/database-url.js';

import Fastify from 'fastify';
import { config } from './config/env.js';
import { registerPlugins } from './plugins/index.js';
import { registerRoutes } from './routes.js';

/**
 * Build Fastify server instance
 */
export async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: config.LOG_LEVEL,
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  });

  // Register plugins
  await registerPlugins(fastify);

  // Register routes
  await registerRoutes(fastify);

  return fastify;
}


