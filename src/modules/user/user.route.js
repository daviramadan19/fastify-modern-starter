import { UserController } from './user.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission, requireOwnerOrPermission, PERMISSIONS } from '../../middleware/rbac.middleware.js';
import { getUserSchema, updateUserSchema, deleteUserSchema, listUsersSchema } from './user.schema.js';

/**
 * User routes
 * All routes require authentication
 */
export async function userRoutes(fastify, options) {
  // GET all users (protected - requires permission)
  fastify.get('/', {
    schema: listUsersSchema,
    preHandler: [authMiddleware, requirePermission(PERMISSIONS.USERS_LIST)]
  }, UserController.list);

  // GET current user profile (protected)
  fastify.get('/me', {
    preHandler: [authMiddleware]
  }, UserController.me);

  // GET user by ID (protected - owner or has permission)
  fastify.get('/:id', {
    schema: getUserSchema,
    preHandler: [authMiddleware, requireOwnerOrPermission(PERMISSIONS.USERS_READ)]
  }, UserController.getById);

  // PUT update user (protected - owner or has permission)
  fastify.put('/:id', {
    schema: updateUserSchema,
    preHandler: [authMiddleware, requireOwnerOrPermission(PERMISSIONS.USERS_UPDATE)]
  }, UserController.update);

  // DELETE user (protected - requires permission)
  fastify.delete('/:id', {
    schema: deleteUserSchema,
    preHandler: [authMiddleware, requirePermission(PERMISSIONS.USERS_DELETE)]
  }, UserController.delete);
}


