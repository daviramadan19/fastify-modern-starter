import { PermissionService } from './permission.service.js';
import { ResponseUtil } from '../../utils/response.js';

/**
 * Permission Controller
 * Handle permission management requests
 */

export class PermissionController {
  /**
   * Get all permissions
   */
  static async list(request, reply) {
    try {
      const { page = 1, limit = 50, resource } = request.query;
      const skip = (page - 1) * limit;

      const { permissions, total } = await PermissionService.getAll({
        skip,
        take: parseInt(limit),
        resource,
      });

      return ResponseUtil.paginated(permissions, {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send(ResponseUtil.error(error.message));
    }
  }

  /**
   * Get permission by ID
   */
  static async getById(request, reply) {
    try {
      const { id } = request.params;
      const permission = await PermissionService.getById(id);

      if (!permission) {
        return reply.code(404).send(ResponseUtil.error('Permission not found'));
      }

      return ResponseUtil.success(permission);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send(ResponseUtil.error(error.message));
    }
  }

  /**
   * Create permission
   */
  static async create(request, reply) {
    try {
      const permission = await PermissionService.create(request.body);
      return reply.code(201).send(
        ResponseUtil.success(permission, 'Permission created successfully')
      );
    } catch (error) {
      request.log.error(error);
      const statusCode = error.message.includes('already exists') ? 400 : 500;
      return reply.code(statusCode).send(ResponseUtil.error(error.message));
    }
  }

  /**
   * Update permission
   */
  static async update(request, reply) {
    try {
      const { id } = request.params;
      const permission = await PermissionService.update(id, request.body);
      return ResponseUtil.success(permission, 'Permission updated successfully');
    } catch (error) {
      request.log.error(error);
      const statusCode = error.code === 'P2025' ? 404 : 500;
      return reply.code(statusCode).send(ResponseUtil.error(error.message));
    }
  }

  /**
   * Delete permission
   */
  static async delete(request, reply) {
    try {
      const { id } = request.params;
      await PermissionService.delete(id);
      return ResponseUtil.success(null, 'Permission deleted successfully');
    } catch (error) {
      request.log.error(error);
      const statusCode = error.code === 'P2025' ? 404 : 500;
      return reply.code(statusCode).send(ResponseUtil.error(error.message));
    }
  }

  /**
   * Get permissions by resource
   */
  static async getByResource(request, reply) {
    try {
      const { resource } = request.params;
      const permissions = await PermissionService.getByResource(resource);
      return ResponseUtil.success(permissions);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send(ResponseUtil.error(error.message));
    }
  }
}

