import { RoleController } from './role.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission, PERMISSIONS } from '../../middleware/rbac.middleware.js';
import {
  getRoleSchema,
  createRoleSchema,
  updateRoleSchema,
  deleteRoleSchema,
  listRolesSchema,
  assignPermissionSchema,
  removePermissionSchema,
} from './role.schema.js';

/**
 * Role routes (Admin only)
 */
export async function roleRoutes(fastify, options) {
  // GET all roles
  fastify.get('/', {
    schema: listRolesSchema,
    preHandler: [authMiddleware, requirePermission(PERMISSIONS.ROLES_LIST)]
  }, RoleController.list);

  // GET role by ID
  fastify.get('/:id', {
    schema: getRoleSchema,
    preHandler: [authMiddleware, requirePermission(PERMISSIONS.ROLES_READ)]
  }, RoleController.getById);

  // POST create role
  fastify.post('/', {
    schema: createRoleSchema,
    preHandler: [authMiddleware, requirePermission(PERMISSIONS.ROLES_CREATE)]
  }, RoleController.create);

  // PUT update role
  fastify.put('/:id', {
    schema: updateRoleSchema,
    preHandler: [authMiddleware, requirePermission(PERMISSIONS.ROLES_UPDATE)]
  }, RoleController.update);

  // DELETE role
  fastify.delete('/:id', {
    schema: deleteRoleSchema,
    preHandler: [authMiddleware, requirePermission(PERMISSIONS.ROLES_DELETE)]
  }, RoleController.delete);

  // POST assign permission to role
  fastify.post('/:id/permissions', {
    schema: assignPermissionSchema,
    preHandler: [authMiddleware, requirePermission(PERMISSIONS.ROLES_MANAGE)]
  }, RoleController.assignPermission);

  // DELETE remove permission from role
  fastify.delete('/:id/permissions/:permissionId', {
    schema: removePermissionSchema,
    preHandler: [authMiddleware, requirePermission(PERMISSIONS.ROLES_MANAGE)]
  }, RoleController.removePermission);

  // GET role permissions
  fastify.get('/:id/permissions', {
    schema: getRoleSchema,
    preHandler: [authMiddleware, requirePermission(PERMISSIONS.ROLES_READ)]
  }, RoleController.getPermissions);

  // POST assign role to user
  fastify.post('/:id/users', {
    schema: assignPermissionSchema, // Reuse schema structure
    preHandler: [authMiddleware, requirePermission(PERMISSIONS.USERS_MANAGE)]
  }, RoleController.assignRoleToUser);

  // GET users with this role
  fastify.get('/:id/users', {
    schema: getRoleSchema,
    preHandler: [authMiddleware, requirePermission(PERMISSIONS.ROLES_READ)]
  }, RoleController.getUsers);
}


