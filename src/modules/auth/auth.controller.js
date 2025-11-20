import { AuthService } from './auth.service.js';
import { ResponseUtil } from '../../utils/response.js';

/**
 * Auth Controller
 * Handle authentication requests
 */

export class AuthController {
  /**
   * Register new user
   */
  static async register(request, reply) {
    try {
      const { email, name, password, role } = request.body;

      // Basic validation
      if (!email || !password) {
        return reply.code(400).send(
          ResponseUtil.error('Email and password are required')
        );
      }

      if (password.length < 6) {
        return reply.code(400).send(
          ResponseUtil.error('Password must be at least 6 characters')
        );
      }

      const result = await AuthService.register({
        email,
        name,
        password,
        role,
      });

      return reply.code(201).send(
        ResponseUtil.success(result, 'User registered successfully')
      );
    } catch (error) {
      request.log.error(error);
      const statusCode = error.message.includes('already exists') ? 400 : 500;
      return reply.code(statusCode).send(ResponseUtil.error(error.message));
    }
  }

  /**
   * Login user
   */
  static async login(request, reply) {
    try {
      const { email, password } = request.body;

      // Basic validation
      if (!email || !password) {
        return reply.code(400).send(
          ResponseUtil.error('Email and password are required')
        );
      }

      const result = await AuthService.login(email, password);

      return ResponseUtil.success(result, 'Login successful');
    } catch (error) {
      request.log.error(error);
      const statusCode = error.message.includes('Invalid') || error.message.includes('deactivated')
        ? 401
        : 500;
      return reply.code(statusCode).send(ResponseUtil.error(error.message));
    }
  }

  /**
   * Verify token
   */
  static async verify(request, reply) {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return reply.code(401).send(
          ResponseUtil.error('No token provided')
        );
      }

      const decoded = AuthService.verifyToken(token);

      return ResponseUtil.success(
        { valid: true, user: decoded },
        'Token is valid'
      );
    } catch (error) {
      request.log.error(error);
      return reply.code(401).send(ResponseUtil.error(error.message));
    }
  }
}

