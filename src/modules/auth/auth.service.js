import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma.js';
import { config } from '../../config/env.js';
import { hashPassword } from '../../utils/hash.js';
import { UserModel } from '../user/user.model.js';

/**
 * Authentication Service
 * Handle user registration, login, and token generation
 */

export class AuthService {
  /**
   * Register new user
   */
  static async register(data) {
    const { email, name, password, role = 'user' } = data;

    // Validate using model
    const validation = UserModel.validateCreate({ email, name, password, role });
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Transform data using model
    const transformedData = UserModel.toDatabase({
      email,
      name,
      password: hashedPassword,
      role,
    });

    // Create user
    const user = await prisma.user.create({
      data: transformedData,
    });

    // Serialize response using model
    const serializedUser = UserModel.toResponse(user);

    // Generate token
    const token = this.generateToken(serializedUser);

    return {
      user: serializedUser,
      token,
    };
  }

  /**
   * Login user
   */
  static async login(email, password) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Serialize response using model (removes password)
    const serializedUser = UserModel.toResponse(user);

    // Generate token
    const token = this.generateToken(serializedUser);

    return {
      user: serializedUser,
      token,
    };
  }

  /**
   * Generate JWT token
   */
  static generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRES_IN,
      }
    );
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Hash password (utility)
   */
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  /**
   * Compare password (utility)
   */
  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

