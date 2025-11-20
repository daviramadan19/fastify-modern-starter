import bcrypt from 'bcrypt';

/**
 * Hash utility functions
 */

/**
 * Hash password
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

