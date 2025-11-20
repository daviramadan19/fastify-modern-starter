import { RBACService } from '../modules/role/rbac.service.js';

/**
 * RBAC Middleware
 * Permission-based access control
 */

/**
 * Require specific permission
 */
export function requirePermission(permissionName) {
  return async (request, reply) => {
    try {
      const userId = request.user?.id;

      if (!userId) {
        return reply.code(401).send({
          success: false,
          message: 'Authentication required',
        });
      }

      const hasPermission = await RBACService.userHasPermission(userId, permissionName);

      if (!hasPermission) {
        return reply.code(403).send({
          success: false,
          message: `Permission denied. Required: ${permissionName}`,
        });
      }
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Error checking permissions',
      });
    }
  };
}

/**
 * Require any of the permissions
 */
export function requireAnyPermission(...permissionNames) {
  return async (request, reply) => {
    try {
      const userId = request.user?.id;

      if (!userId) {
        return reply.code(401).send({
          success: false,
          message: 'Authentication required',
        });
      }

      const hasPermission = await RBACService.userHasAnyPermission(userId, permissionNames);

      if (!hasPermission) {
        return reply.code(403).send({
          success: false,
          message: `Permission denied. Required any of: ${permissionNames.join(', ')}`,
        });
      }
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Error checking permissions',
      });
    }
  };
}

/**
 * Require all permissions
 */
export function requireAllPermissions(...permissionNames) {
  return async (request, reply) => {
    try {
      const userId = request.user?.id;

      if (!userId) {
        return reply.code(401).send({
          success: false,
          message: 'Authentication required',
        });
      }

      const hasPermission = await RBACService.userHasAllPermissions(userId, permissionNames);

      if (!hasPermission) {
        return reply.code(403).send({
          success: false,
          message: `Permission denied. Required all: ${permissionNames.join(', ')}`,
        });
      }
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Error checking permissions',
      });
    }
  };
}

/**
 * Require specific role
 */
export function requireRole(roleName) {
  return async (request, reply) => {
    try {
      const userId = request.user?.id;

      if (!userId) {
        return reply.code(401).send({
          success: false,
          message: 'Authentication required',
        });
      }

      const hasRole = await RBACService.userHasRole(userId, roleName);

      if (!hasRole) {
        return reply.code(403).send({
          success: false,
          message: `Role required: ${roleName}`,
        });
      }
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Error checking role',
      });
    }
  };
}

/**
 * Require owner or permission
 * User can access their own resource OR have specific permission
 */
export function requireOwnerOrPermission(permissionName) {
  return async (request, reply) => {
    try {
      const userId = request.user?.id;
      const resourceId = request.params.id;

      if (!userId) {
        return reply.code(401).send({
          success: false,
          message: 'Authentication required',
        });
      }

      // Check if owner
      const isOwner = userId === resourceId;

      // Check if has permission
      const hasPermission = await RBACService.userHasPermission(userId, permissionName);

      if (!isOwner && !hasPermission) {
        return reply.code(403).send({
          success: false,
          message: 'Access denied. You must be the owner or have required permission',
        });
      }
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Error checking access',
      });
    }
  };
}

/**
 * Permission constants
 */
export const PERMISSIONS = {
  // Users
  USERS_CREATE: 'users.create',
  USERS_READ: 'users.read',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
  USERS_LIST: 'users.list',
  USERS_MANAGE: 'users.manage',

  // Roles
  ROLES_CREATE: 'roles.create',
  ROLES_READ: 'roles.read',
  ROLES_UPDATE: 'roles.update',
  ROLES_DELETE: 'roles.delete',
  ROLES_LIST: 'roles.list',
  ROLES_MANAGE: 'roles.manage',

  // Permissions
  PERMISSIONS_CREATE: 'permissions.create',
  PERMISSIONS_READ: 'permissions.read',
  PERMISSIONS_UPDATE: 'permissions.update',
  PERMISSIONS_DELETE: 'permissions.delete',
  PERMISSIONS_LIST: 'permissions.list',
  PERMISSIONS_MANAGE: 'permissions.manage',
};

