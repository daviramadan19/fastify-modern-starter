import { authRoutes } from './modules/auth/auth.route.js';
import { userRoutes } from './modules/user/user.route.js';
import { roleRoutes } from './modules/role/role.route.js';
import { permissionRoutes } from './modules/permission/permission.route.js';

/**
 * Auto register all routes
 * This file automatically registers all module routes
 */
export async function registerRoutes(fastify) {
  // Root route
  fastify.get('/', async (request, reply) => {
    return {
      message: 'Welcome to Fastify API with RBAC',
      version: '1.0.0',
      status: 'running',
      database: 'MySQL + Prisma',
      features: [
        'JWT Authentication',
        'User Management',
        'RBAC (Role-Based Access Control)',
        'Permission Management',
        'Multi-Role per User',
      ],
    };
  });

  // Health check route
  fastify.get('/health', async (request, reply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  // Register authentication routes (public)
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  
  // Register user routes (protected)
  await fastify.register(userRoutes, { prefix: '/api/users' });
  
  // Register RBAC routes (protected - admin)
  await fastify.register(permissionRoutes, { prefix: '/api/permissions' });
  await fastify.register(roleRoutes, { prefix: '/api/roles' });
}


