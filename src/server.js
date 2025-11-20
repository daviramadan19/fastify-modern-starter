import { buildApp } from './app.js';
import { config } from './config/env.js';

/**
 * Start the server
 */
async function start() {
  try {
    const fastify = await buildApp();

    // Start listening
    await fastify.listen({
      port: config.PORT,
      host: config.HOST,
    });

    console.log(`🚀 Server ready at http://${config.HOST}:${config.PORT}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

start();
