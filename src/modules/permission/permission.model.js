/**
 * Permission Model
 * Validation and serialization for permissions
 */
export class PermissionModel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.resource = data.resource;
    this.action = data.action;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * Validate permission creation
   */
  static validateCreate(data) {
    const errors = [];

    // Name validation
    if (!data.name) {
      errors.push('Permission name is required');
    } else if (!/^[a-z_]+\.[a-z_]+$/.test(data.name)) {
      errors.push('Permission name must be in format: resource.action (e.g., users.create)');
    }

    // Resource validation
    if (!data.resource) {
      errors.push('Resource is required');
    } else if (!/^[a-z_]+$/.test(data.resource)) {
      errors.push('Resource must be lowercase letters and underscores only');
    }

    // Action validation
    const validActions = ['create', 'read', 'update', 'delete', 'list', 'manage'];
    if (!data.action) {
      errors.push('Action is required');
    } else if (!validActions.includes(data.action)) {
      errors.push(`Action must be one of: ${validActions.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate permission update
   */
  static validateUpdate(data) {
    const errors = [];

    if (data.name && !/^[a-z_]+\.[a-z_]+$/.test(data.name)) {
      errors.push('Permission name must be in format: resource.action (e.g., users.create)');
    }

    if (data.resource && !/^[a-z_]+$/.test(data.resource)) {
      errors.push('Resource must be lowercase letters and underscores only');
    }

    const validActions = ['create', 'read', 'update', 'delete', 'list', 'manage'];
    if (data.action && !validActions.includes(data.action)) {
      errors.push(`Action must be one of: ${validActions.join(', ')}`);
    }

    if (data.description && data.description.length > 255) {
      errors.push('Description must be less than 255 characters');
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
    if (data.resource) transformed.resource = data.resource.toLowerCase().trim();
    if (data.action) transformed.action = data.action.toLowerCase().trim();
    if (data.description !== undefined) transformed.description = data.description?.trim() || null;

    return transformed;
  }

  /**
   * Serialize permission for response
   */
  static toResponse(permission) {
    if (!permission) return null;

    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      resource: permission.resource,
      action: permission.action,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }

  /**
   * Serialize array of permissions for response
   */
  static toResponseArray(permissions) {
    if (!Array.isArray(permissions)) return [];
    return permissions.map(permission => this.toResponse(permission));
  }
}


