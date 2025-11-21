import { UserService } from './user.service.js';
import { ResponseUtil } from '../../utils/response.js';

/**
 * User Controller
 * Handle user management requests
 */

export class UserController {
  /**
   * Get all users
   */
  static async list(request, reply) {
    try {
      const { page = 1, limit = 10, includeInactive = false } = request.query;
      const skip = (page - 1) * limit;

      const { users, total } = await UserService.getAll({
        skip,
        take: parseInt(limit),
        includeInactive: includeInactive === 'true',
      });

      return ResponseUtil.paginated(users, {
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
   * Get current user profile
   */
  static async me(request, reply) {
    try {
      const user = await UserService.getById(request.user.id);

      if (!user) {
        return reply.code(404).send(ResponseUtil.error('User not found'));
      }

      return ResponseUtil.success(user);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send(ResponseUtil.error(error.message));
    }
  }

  /**
   * Get user by ID
   */
  static async getById(request, reply) {
    try {
      const { id } = request.params;
      const user = await UserService.getById(id);

      if (!user) {
        return reply.code(404).send(ResponseUtil.error('User not found'));
      }

      return ResponseUtil.success(user);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send(ResponseUtil.error(error.message));
    }
  }

  /**
   * Update user
   */
  static async update(request, reply) {
    try {
      const { id } = request.params;
      const user = await UserService.update(id, request.body);
      return ResponseUtil.success(user, 'User updated successfully');
    } catch (error) {
      request.log.error(error);
      const statusCode = error.code === 'P2025' ? 404 : 500;
      return reply.code(statusCode).send(ResponseUtil.error(error.message));
    }
  }

  /**
   * Delete user
   */
  static async delete(request, reply) {
    try {
      const { id } = request.params;
      await UserService.delete(id);
      return ResponseUtil.success(null, 'User deleted successfully');
    } catch (error) {
      request.log.error(error);
      const statusCode = error.code === 'P2025' ? 404 : 500;
      return reply.code(statusCode).send(ResponseUtil.error(error.message));
    }
  }
}



