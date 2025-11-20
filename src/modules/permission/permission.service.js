import { prisma } from '../../config/prisma.js';
import { PermissionModel } from './permission.model.js';

/**
 * Permission Service
 * CRUD operations for permissions
 */

export class PermissionService {
  /**
   * Get all permissions
   */
  static async getAll(options = {}) {
    const { skip = 0, take = 50, resource = null } = options;

    const where = resource ? { resource } : {};

    const [permissions, total] = await Promise.all([
      prisma.permission.findMany({
        where,
        skip,
        take,
        orderBy: [{ resource: 'asc' }, { action: 'asc' }],
      }),
      prisma.permission.count({ where }),
    ]);

    return {
      permissions: PermissionModel.toResponseArray(permissions),
      total,
    };
  }

  /**
   * Get permission by ID
   */
  static async getById(id) {
    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    return PermissionModel.toResponse(permission);
  }

  /**
   * Get permission by name
   */
  static async getByName(name) {
    const permission = await prisma.permission.findUnique({
      where: { name },
    });

    return PermissionModel.toResponse(permission);
  }

  /**
   * Create new permission
   */
  static async create(data) {
    // Validate
    const validation = PermissionModel.validateCreate(data);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if exists
    const existing = await prisma.permission.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new Error('Permission with this name already exists');
    }

    // Transform and create
    const transformed = PermissionModel.toDatabase(data);
    const permission = await prisma.permission.create({
      data: transformed,
    });

    return PermissionModel.toResponse(permission);
  }

  /**
   * Update permission
   */
  static async update(id, data) {
    // Validate
    const validation = PermissionModel.validateUpdate(data);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Transform and update
    const transformed = PermissionModel.toDatabase(data);
    const permission = await prisma.permission.update({
      where: { id },
      data: transformed,
    });

    return PermissionModel.toResponse(permission);
  }

  /**
   * Delete permission
   */
  static async delete(id) {
    return await prisma.permission.delete({
      where: { id },
    });
  }

  /**
   * Get permissions by resource
   */
  static async getByResource(resource) {
    const permissions = await prisma.permission.findMany({
      where: { resource },
      orderBy: { action: 'asc' },
    });

    return PermissionModel.toResponseArray(permissions);
  }
}

