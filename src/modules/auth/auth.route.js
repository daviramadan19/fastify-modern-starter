import { AuthController } from './auth.controller.js';
import { registerSchema, loginSchema, verifySchema } from './auth.schema.js';

/**
 * Auth Routes
 * Public authentication endpoints
 */
export async function authRoutes(fastify, options) {
  // Register new user
  fastify.post('/register', {
    schema: registerSchema,
  }, AuthController.register);

  // Login user
  fastify.post('/login', {
    schema: loginSchema,
  }, AuthController.login);

  // Verify token
  fastify.get('/verify', {
    schema: verifySchema,
  }, AuthController.verify);
}

