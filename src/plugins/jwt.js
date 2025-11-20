import fp from 'fastify-plugin';
import { config } from '../config/env.js';

/**
 * JWT Plugin for Fastify
 * Decorates fastify instance with JWT utilities
 * Uses jsonwebtoken library directly
 */
async function jwtPlugin(fastify, options) {
  // Decorate fastify with JWT config
  fastify.decorate('jwt', {
    secret: config.JWT_SECRET,
    expiresIn: config.JWT_EXPIRES_IN,
  });

  fastify.log.info('JWT plugin registered');
}

export default fp(jwtPlugin, {
  name: 'jwt',
});

