import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { config } from '../config/env.js';

/**
 * CORS Plugin for Fastify
 * Handles Cross-Origin Resource Sharing
 */
async function corsPlugin(fastify, options) {
  await fastify.register(cors, {
    origin: config.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  fastify.log.info('CORS plugin registered');
}

export default fp(corsPlugin, {
  name: 'cors',
});

