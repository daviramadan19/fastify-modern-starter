import { AuthService } from '../modules/auth/auth.service.js';

/**
 * Authentication middleware
 * Verify JWT token and attach user to request
 */
export async function authMiddleware(request, reply) {
  try {
    // Get token from header
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return reply.code(401).send({
        success: false,
        message: 'No token provided',
      });
    }

    // Verify token
    const decoded = AuthService.verifyToken(token);
    
    // Attach user to request
    request.user = decoded;
  } catch (error) {
    return reply.code(401).send({
      success: false,
      message: 'Invalid or expired token',
      error: error.message,
    });
  }
}

