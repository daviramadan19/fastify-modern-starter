import { prisma } from '../../config/prisma.js';
import { UserModel } from './user.model.js';

/**
 * User Service
 * Business logic for User operations using Prisma + Model
 */

export class UserService {
  /**
   * Get all users
   */
  static async getAll(options = {}) {
    const { skip = 0, take = 10, includeInactive = false } = options;

    const where = includeInactive ? {} : { isActive: true };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    // Use model to serialize response
    return { 
      users: UserModel.toResponseArray(users), 
      total 
    };
  }

  /**
   * Get user by ID
   */
  static async getById(id) {
    const user = await prisma.user.findUnique({
      where: { id: id }, // UUID is string, no need to parseInt
    });

    // Use model to serialize response
    return UserModel.toResponse(user);
  }

  /**
   * Get user by email
   */
  static async getByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Use model to serialize response
    return UserModel.toResponse(user);
  }

  /**
   * Create new user
   */
  static async create(data) {
    // Validate using model
    const validation = UserModel.validateCreate(data);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Transform data using model
    const transformedData = UserModel.toDatabase(data);

    // Create user
    const user = await prisma.user.create({
      data: transformedData,
    });

    // Serialize response using model
    return UserModel.toResponse(user);
  }

  /**
   * Update user
   */
  static async update(id, data) {
    // Validate using model
    const validation = UserModel.validateUpdate(data);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Transform data using model
    const transformedData = UserModel.toDatabase(data);

    // Update user
    const user = await prisma.user.update({
      where: { id: id }, // UUID is string
      data: transformedData,
    });

    // Serialize response using model
    return UserModel.toResponse(user);
  }

  /**
   * Delete user (soft delete by setting isActive to false)
   */
  static async delete(id) {
    return await prisma.user.update({
      where: { id: id }, // UUID is string
      data: { isActive: false },
    });
  }

  /**
   * Hard delete user
   */
  static async hardDelete(id) {
    return await prisma.user.delete({
      where: { id: id }, // UUID is string
    });
  }
}

