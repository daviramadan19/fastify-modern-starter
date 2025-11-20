import { PermissionController } from './permission.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission, PERMISSIONS } from '../../middleware/rbac.middleware.js';
import {
  getPermissionSchema,
  createPermissionSchema,
  updatePermissionSchema,
  deletePermissionSchema,
  listPermissionsSchema,
  getByResourceSchema,
} from './permission.schema.js';

/**
 * Permission routes (Admin only)
 */
export async function permissionRoutes(fastify, options) {
  // GET all permissions
  fastify.get('/', {
    schema: listPermissionsSchema,
    preHandler: [authMiddleware, requirePermission(PERMISSIONS.PERMISSIONS_LIST)]
  }, PermissionController.list);

  // GET permission by ID
  fastify.get('/:id', {
    schema: getPermissionSchema,
    preHandler: [authMiddleware, requirePermission(PERMISSIONS.PERMISSIONS_READ)]
  }, PermissionController.getById);

  // POST create permission
  fastify.post('/', {
    schema: createPermissionSchema,
    preHandler: [authMiddleware, requirePermission(PERMISSIONS.PERMISSIONS_CREATE)]
  }, PermissionController.create);

  // PUT update permission
  fastify.put('/:id', {
    schema: updatePermissionSchema,
    preHandler: [authMiddleware, requirePermission(PERMISSIONS.PERMISSIONS_UPDATE)]
  }, PermissionController.update);

  // DELETE permission
  fastify.delete('/:id', {
    schema: deletePermissionSchema,
    preHandler: [authMiddleware, requirePermission(PERMISSIONS.PERMISSIONS_DELETE)]
  }, PermissionController.delete);

  // GET permissions by resource
  fastify.get('/resource/:resource', {
    schema: getByResourceSchema,
    preHandler: [authMiddleware, requirePermission(PERMISSIONS.PERMISSIONS_LIST)]
  }, PermissionController.getByResource);
}


