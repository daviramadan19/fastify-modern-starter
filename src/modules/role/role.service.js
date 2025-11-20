import { prisma } from '../../config/prisma.js';
import { RoleModel } from './role.model.js';

/**
 * Role Service
 * CRUD operations for roles and role-permission management
 */

export class RoleService {
  /**
   * Get all roles
   */
  static async getAll(options = {}) {
    const { skip = 0, take = 50, includeInactive = false, includePermissions = false } = options;

    const where = includeInactive ? {} : { isActive: true };

    const include = includePermissions ? {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
      _count: {
        select: { userRoles: true },
      },
    } : {
      _count: {
        select: { 
          rolePermissions: true,
          userRoles: true,
        },
      },
    };

    const [roles, total] = await Promise.all([
      prisma.role.findMany({
        where,
        skip,
        take,
        include,
        orderBy: { name: 'asc' },
      }),
      prisma.role.count({ where }),
    ]);

    return {
      roles: RoleModel.toResponseArray(roles),
      total,
    };
  }

  /**
   * Get role by ID
   */
  static async getById(id, includePermissions = true) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: includePermissions ? {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: { userRoles: true },
        },
      } : {},
    });

    return RoleModel.toResponse(role);
  }

  /**
   * Get role by name
   */
  static async getByName(name, includePermissions = true) {
    const role = await prisma.role.findUnique({
      where: { name },
      include: includePermissions ? {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      } : {},
    });

    return RoleModel.toResponse(role);
  }

  /**
   * Create new role
   */
  static async create(data) {
    // Validate
    const validation = RoleModel.validateCreate(data);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if exists
    const existing = await prisma.role.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new Error('Role with this name already exists');
    }

    // Transform and create
    const transformed = RoleModel.toDatabase(data);
    const role = await prisma.role.create({
      data: transformed,
    });

    return RoleModel.toResponse(role);
  }

  /**
   * Update role
   */
  static async update(id, data) {
    // Validate
    const validation = RoleModel.validateUpdate(data);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Transform and update
    const transformed = RoleModel.toDatabase(data);
    const role = await prisma.role.update({
      where: { id },
      data: transformed,
    });

    return RoleModel.toResponse(role);
  }

  /**
   * Delete role
   */
  static async delete(id) {
    return await prisma.role.delete({
      where: { id },
    });
  }

  /**
   * Assign permission to role
   */
  static async assignPermission(roleId, permissionId) {
    // Check if already assigned
    const existing = await prisma.rolePermission.findFirst({
      where: {
        roleId,
        permissionId,
      },
    });

    if (existing) {
      throw new Error('Permission already assigned to this role');
    }

    // Create assignment
    const assignment = await prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
      include: {
        role: true,
        permission: true,
      },
    });

    return {
      id: assignment.id,
      role: assignment.role.name,
      permission: assignment.permission.name,
      createdAt: assignment.createdAt,
    };
  }

  /**
   * Remove permission from role
   */
  static async removePermission(roleId, permissionId) {
    const assignment = await prisma.rolePermission.findFirst({
      where: {
        roleId,
        permissionId,
      },
    });

    if (!assignment) {
      throw new Error('Permission not assigned to this role');
    }

    return await prisma.rolePermission.delete({
      where: {
        id: assignment.id,
      },
    });
  }

  /**
   * Get role permissions
   */
  static async getPermissions(roleId) {
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { roleId },
      include: {
        permission: true,
      },
    });

    return rolePermissions.map(rp => ({
      id: rp.permission.id,
      name: rp.permission.name,
      description: rp.permission.description,
      resource: rp.permission.resource,
      action: rp.permission.action,
    }));
  }
}

