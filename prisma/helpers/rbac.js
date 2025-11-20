/**
 * RBAC Helper Functions
 * Utility functions for role-based access control operations
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get user's roles with permissions
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of roles with their permissions
 */
export async function getUserRoles(userId) {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  return userRoles.map(ur => ({
    id: ur.role.id,
    name: ur.role.name,
    description: ur.role.description,
    isActive: ur.role.isActive,
    permissions: ur.role.rolePermissions.map(rp => ({
      id: rp.permission.id,
      name: rp.permission.name,
      resource: rp.permission.resource,
      action: rp.permission.action,
      description: rp.permission.description,
    })),
  }));
}

/**
 * Get user's all permissions (from all roles)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of unique permissions
 */
export async function getUserPermissions(userId) {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: {
        where: { isActive: true },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  // Collect all unique permissions
  const permissionMap = new Map();

  userRoles.forEach(ur => {
    if (ur.role && ur.role.rolePermissions) {
      ur.role.rolePermissions.forEach(rp => {
        if (!permissionMap.has(rp.permission.name)) {
          permissionMap.set(rp.permission.name, {
            id: rp.permission.id,
            name: rp.permission.name,
            resource: rp.permission.resource,
            action: rp.permission.action,
            description: rp.permission.description,
            fromRole: ur.role.name,
          });
        }
      });
    }
  });

  return Array.from(permissionMap.values());
}

/**
 * Check if user has specific permission
 * @param {string} userId - User ID
 * @param {string} permissionName - Permission name (e.g., 'users.create')
 * @returns {Promise<boolean>}
 */
export async function userHasPermission(userId, permissionName) {
  const permissions = await getUserPermissions(userId);
  return permissions.some(p => p.name === permissionName);
}

/**
 * Check if user has any of the permissions
 * @param {string} userId - User ID
 * @param {Array<string>} permissionNames - Array of permission names
 * @returns {Promise<boolean>}
 */
export async function userHasAnyPermission(userId, permissionNames) {
  const permissions = await getUserPermissions(userId);
  const userPermissionNames = permissions.map(p => p.name);
  return permissionNames.some(pName => userPermissionNames.includes(pName));
}

/**
 * Check if user has all permissions
 * @param {string} userId - User ID
 * @param {Array<string>} permissionNames - Array of permission names
 * @returns {Promise<boolean>}
 */
export async function userHasAllPermissions(userId, permissionNames) {
  const permissions = await getUserPermissions(userId);
  const userPermissionNames = permissions.map(p => p.name);
  return permissionNames.every(pName => userPermissionNames.includes(pName));
}

/**
 * Check if user has role
 * @param {string} userId - User ID
 * @param {string} roleName - Role name (e.g., 'admin')
 * @returns {Promise<boolean>}
 */
export async function userHasRole(userId, roleName) {
  const userRole = await prisma.userRole.findFirst({
    where: {
      userId,
      role: {
        name: roleName,
        isActive: true,
      },
    },
  });

  return !!userRole;
}

/**
 * Assign role to user
 * @param {string} userId - User ID
 * @param {string} roleId - Role ID
 * @returns {Promise<Object>} Created user role assignment
 */
export async function assignRoleToUser(userId, roleId) {
  // Check if already assigned
  const existing = await prisma.userRole.findFirst({
    where: {
      userId,
      roleId,
    },
  });

  if (existing) {
    throw new Error('Role already assigned to this user');
  }

  return await prisma.userRole.create({
    data: {
      userId,
      roleId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      role: true,
    },
  });
}

/**
 * Remove role from user
 * @param {string} userId - User ID
 * @param {string} roleId - Role ID
 * @returns {Promise<Object>} Deleted user role assignment
 */
export async function removeRoleFromUser(userId, roleId) {
  const assignment = await prisma.userRole.findFirst({
    where: {
      userId,
      roleId,
    },
  });

  if (!assignment) {
    throw new Error('Role not assigned to this user');
  }

  return await prisma.userRole.delete({
    where: {
      id: assignment.id,
    },
  });
}

/**
 * Get users with specific role
 * @param {string} roleId - Role ID
 * @returns {Promise<Array>} Array of users with the role
 */
export async function getUsersByRole(roleId) {
  const userRoles = await prisma.userRole.findMany({
    where: { roleId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          isActive: true,
        },
      },
    },
  });

  return userRoles.map(ur => ur.user);
}

/**
 * Get role by name
 * @param {string} roleName - Role name
 * @returns {Promise<Object|null>} Role object or null
 */
export async function getRoleByName(roleName) {
  return await prisma.role.findUnique({
    where: { name: roleName },
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  });
}

/**
 * Get permission by name
 * @param {string} permissionName - Permission name
 * @returns {Promise<Object|null>} Permission object or null
 */
export async function getPermissionByName(permissionName) {
  return await prisma.permission.findUnique({
    where: { name: permissionName },
  });
}

