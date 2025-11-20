import { RoleService } from './role.service.js';
import { RBACService } from './rbac.service.js';
import { ResponseUtil } from '../../utils/response.js';

/**
 * Role Controller
 * Handle role management requests
 */

export class RoleController {
  /**
   * Get all roles
   */
  static async list(request, reply) {
    try {
      const { page = 1, limit = 50, includeInactive = false, includePermissions = false } = request.query;
      const skip = (page - 1) * limit;

      const { roles, total } = await RoleService.getAll({
        skip,
        take: parseInt(limit),
        includeInactive: includeInactive === 'true',
        includePermissions: includePermissions === 'true',
      });

      return ResponseUtil.paginated(roles, {
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
   * Get role by ID
   */
  static async getById(request, reply) {
    try {
      const { id } = request.params;
      const role = await RoleService.getById(id);

      if (!role) {
        return reply.code(404).send(ResponseUtil.error('Role not found'));
      }

      return ResponseUtil.success(role);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send(ResponseUtil.error(error.message));
    }
  }

  /**
   * Create role
   */
  static async create(request, reply) {
    try {
      const role = await RoleService.create(request.body);
      return reply.code(201).send(
        ResponseUtil.success(role, 'Role created successfully')
      );
    } catch (error) {
      request.log.error(error);
      const statusCode = error.message.includes('already exists') ? 400 : 500;
      return reply.code(statusCode).send(ResponseUtil.error(error.message));
    }
  }

  /**
   * Update role
   */
  static async update(request, reply) {
    try {
      const { id } = request.params;
      const role = await RoleService.update(id, request.body);
      return ResponseUtil.success(role, 'Role updated successfully');
    } catch (error) {
      request.log.error(error);
      const statusCode = error.code === 'P2025' ? 404 : 500;
      return reply.code(statusCode).send(ResponseUtil.error(error.message));
    }
  }

  /**
   * Delete role
   */
  static async delete(request, reply) {
    try {
      const { id } = request.params;
      await RoleService.delete(id);
      return ResponseUtil.success(null, 'Role deleted successfully');
    } catch (error) {
      request.log.error(error);
      const statusCode = error.code === 'P2025' ? 404 : 500;
      return reply.code(statusCode).send(ResponseUtil.error(error.message));
    }
  }

  /**
   * Assign permission to role
   */
  static async assignPermission(request, reply) {
    try {
      const { id: roleId } = request.params;
      const { permissionId } = request.body;

      if (!permissionId) {
        return reply.code(400).send(ResponseUtil.error('permissionId is required'));
      }

      const result = await RoleService.assignPermission(roleId, permissionId);
      return reply.code(201).send(
        ResponseUtil.success(result, 'Permission assigned to role successfully')
      );
    } catch (error) {
      request.log.error(error);
      const statusCode = error.message.includes('already assigned') ? 400 : 500;
      return reply.code(statusCode).send(ResponseUtil.error(error.message));
    }
  }

  /**
   * Remove permission from role
   */
  static async removePermission(request, reply) {
    try {
      const { id: roleId, permissionId } = request.params;
      await RoleService.removePermission(roleId, permissionId);
      return ResponseUtil.success(null, 'Permission removed from role successfully');
    } catch (error) {
      request.log.error(error);
      const statusCode = error.message.includes('not assigned') ? 404 : 500;
      return reply.code(statusCode).send(ResponseUtil.error(error.message));
    }
  }

  /**
   * Get role permissions
   */
  static async getPermissions(request, reply) {
    try {
      const { id } = request.params;
      const permissions = await RoleService.getPermissions(id);
      return ResponseUtil.success(permissions);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send(ResponseUtil.error(error.message));
    }
  }

  /**
   * Assign role to user
   */
  static async assignRoleToUser(request, reply) {
    try {
      const { id: roleId } = request.params;
      const { userId } = request.body;

      if (!userId) {
        return reply.code(400).send(ResponseUtil.error('userId is required'));
      }

      const result = await RBACService.assignRoleToUser(userId, roleId);
      return reply.code(201).send(
        ResponseUtil.success(result, 'Role assigned to user successfully')
      );
    } catch (error) {
      request.log.error(error);
      const statusCode = error.message.includes('already assigned') ? 400 : 500;
      return reply.code(statusCode).send(ResponseUtil.error(error.message));
    }
  }

  /**
   * Get users with this role
   */
  static async getUsers(request, reply) {
    try {
      const { id } = request.params;
      const users = await RBACService.getUsersByRole(id);
      return ResponseUtil.success(users);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send(ResponseUtil.error(error.message));
    }
  }
}


