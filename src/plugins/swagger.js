import fp from 'fastify-plugin';

/**
 * Swagger Plugin for Fastify
 * Provides API documentation
 * Note: Install @fastify/swagger and @fastify/swagger-ui to enable full functionality
 */
async function swaggerPlugin(fastify, options) {
  fastify.log.info('Swagger plugin registered (install @fastify/swagger to enable)');
}

export default fp(swaggerPlugin, {
  name: 'swagger',
});

