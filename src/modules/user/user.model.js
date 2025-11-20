/**
 * User Model
 * Handles validation, transformation, and serialization
 * Acts as abstraction layer between Service and Database
 */
export class UserModel {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.password = data.password;
    this.role = data.role || 'user';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * Validate user data for creation
   */
  static validateCreate(data) {
    const errors = [];

    // Email validation
    if (!data.email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    // Password validation
    if (!data.password) {
      errors.push('Password is required');
    } else if (data.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    } else if (data.password.length > 100) {
      errors.push('Password too long (max 100 characters)');
    }

    // Name validation (optional)
    if (data.name && data.name.length > 191) {
      errors.push('Name too long (max 191 characters)');
    }

    // Role validation
    if (data.role && !['user', 'admin'].includes(data.role)) {
      errors.push('Invalid role. Must be "user" or "admin"');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate user data for update
   */
  static validateUpdate(data) {
    const errors = [];

    // Email validation (if provided)
    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    // Name validation
    if (data.name && data.name.length > 191) {
      errors.push('Name too long (max 191 characters)');
    }

    // Role validation
    if (data.role && !['user', 'admin'].includes(data.role)) {
      errors.push('Invalid role. Must be "user" or "admin"');
    }

    // isActive validation
    if (data.isActive !== undefined && typeof data.isActive !== 'boolean') {
      errors.push('isActive must be a boolean');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Transform data before saving to database
   */
  static toDatabase(data) {
    const transformed = {};

    if (data.email) transformed.email = data.email.toLowerCase().trim();
    if (data.name) transformed.name = data.name.trim();
    if (data.password) transformed.password = data.password;
    if (data.role) transformed.role = data.role;
    if (data.isActive !== undefined) transformed.isActive = data.isActive;

    return transformed;
  }

  /**
   * Serialize user for response (removes sensitive data)
   */
  static toResponse(user) {
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Serialize array of users for response
   */
  static toResponseArray(users) {
    if (!Array.isArray(users)) return [];
    return users.map(user => this.toResponse(user));
  }

  /**
   * Validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

