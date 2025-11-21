/**
 * Role Model
 * Validation and serialization for roles
 */
export class RoleModel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * Validate role creation
   */
  static validateCreate(data) {
    const errors = [];

    // Name validation
    if (!data.name) {
      errors.push('Role name is required');
    } else if (!/^[a-z_]+$/.test(data.name)) {
      errors.push('Role name must be lowercase letters and underscores only');
    } else if (data.name.length < 2) {
      errors.push('Role name must be at least 2 characters');
    } else if (data.name.length > 50) {
      errors.push('Role name must be less than 50 characters');
    }

    // Description validation
    if (data.description && data.description.length > 255) {
      errors.push('Description must be less than 255 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate role update
   */
  static validateUpdate(data) {
    const errors = [];

    if (data.name) {
      if (!/^[a-z_]+$/.test(data.name)) {
        errors.push('Role name must be lowercase letters and underscores only');
      } else if (data.name.length < 2) {
        errors.push('Role name must be at least 2 characters');
      } else if (data.name.length > 50) {
        errors.push('Role name must be less than 50 characters');
      }
    }

    if (data.description && data.description.length > 255) {
      errors.push('Description must be less than 255 characters');
    }

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

    if (data.name) transformed.name = data.name.toLowerCase().trim();
    if (data.description !== undefined) transformed.description = data.description?.trim() || null;
    if (data.isActive !== undefined) transformed.isActive = data.isActive;

    return transformed;
  }

  /**
   * Serialize role for response
   */
  static toResponse(role) {
    if (!role) return null;

    // If role has rolePermissions included, transform them
    if (role.rolePermissions && Array.isArray(role.rolePermissions)) {
      return {
        id: role.id,
        name: role.name,
        description: role.description,
        isActive: role.isActive,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        permissions: role.rolePermissions.map(rp => ({
          id: rp.permission?.id,
          name: rp.permission?.name,
          resource: rp.permission?.resource,
          action: rp.permission?.action,
        })),
        _count: role._count,
      };
    }

    return {
      id: role.id,
      name: role.name,
      description: role.description,
      isActive: role.isActive,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      _count: role._count,
    };
  }

  /**
   * Serialize array of roles for response
   */
  static toResponseArray(roles) {
    if (!Array.isArray(roles)) return [];
    return roles.map(role => this.toResponse(role));
  }
}



