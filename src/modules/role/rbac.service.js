import { prisma } from '../../config/prisma.js';

/**
 * RBAC Service
 * Core RBAC functionality for user roles and permissions
 */

export class RBACService {
  /**
   * Assign role to user
   */
  static async assignRoleToUser(userId, roleId) {
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

    // Create assignment
    const assignment = await prisma.userRole.create({
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

    return {
      id: assignment.id,
      user: assignment.user,
      role: assignment.role,
      createdAt: assignment.createdAt,
    };
  }

  /**
   * Remove role from user
   */
  static async removeRoleFromUser(userId, roleId) {
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
   * Get user's roles
   */
  static async getUserRoles(userId) {
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
      permissions: ur.role.rolePermissions.map(rp => rp.permission.name),
    }));
  }

  /**
   * Get user's all permissions (from all roles)
   */
  static async getUserPermissions(userId) {
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

    // Collect all unique permissions
    const permissionSet = new Set();
    const permissions = [];

    userRoles.forEach(ur => {
      ur.role.rolePermissions.forEach(rp => {
        if (!permissionSet.has(rp.permission.name)) {
          permissionSet.add(rp.permission.name);
          permissions.push({
            id: rp.permission.id,
            name: rp.permission.name,
            resource: rp.permission.resource,
            action: rp.permission.action,
            fromRole: ur.role.name,
          });
        }
      });
    });

    return permissions;
  }

  /**
   * Check if user has specific permission
   */
  static async userHasPermission(userId, permissionName) {
    const permissions = await this.getUserPermissions(userId);
    return permissions.some(p => p.name === permissionName);
  }

  /**
   * Check if user has any of the permissions
   */
  static async userHasAnyPermission(userId, permissionNames) {
    const permissions = await this.getUserPermissions(userId);
    const userPermissionNames = permissions.map(p => p.name);
    return permissionNames.some(pName => userPermissionNames.includes(pName));
  }

  /**
   * Check if user has all permissions
   */
  static async userHasAllPermissions(userId, permissionNames) {
    const permissions = await this.getUserPermissions(userId);
    const userPermissionNames = permissions.map(p => p.name);
    return permissionNames.every(pName => userPermissionNames.includes(pName));
  }

  /**
   * Check if user has role
   */
  static async userHasRole(userId, roleName) {
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
   * Get users with specific role
   */
  static async getUsersByRole(roleId) {
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
}


