/**
 * Role Schema - Request validation schemas for role operations
 */

export const getRoleSchema = {
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
    },
    required: ['id'],
  },
};

export const createRoleSchema = {
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 50,
        pattern: '^[a-z_]+$',
      },
      description: {
        type: 'string',
        maxLength: 255,
      },
    },
  },
};

export const updateRoleSchema = {
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
    },
    required: ['id'],
  },
  body: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 50,
        pattern: '^[a-z_]+$',
      },
      description: {
        type: 'string',
        maxLength: 255,
      },
      isActive: {
        type: 'boolean',
      },
    },
  },
};

export const deleteRoleSchema = {
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
    },
    required: ['id'],
  },
};

export const listRolesSchema = {
  querystring: {
    type: 'object',
    properties: {
      page: {
        type: 'integer',
        minimum: 1,
        default: 1,
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 50,
      },
      includeInactive: {
        type: 'string',
        enum: ['true', 'false'],
      },
      includePermissions: {
        type: 'string',
        enum: ['true', 'false'],
      },
    },
  },
};

export const assignPermissionSchema = {
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
    },
    required: ['id'],
  },
  body: {
    type: 'object',
    required: ['permissionId'],
    properties: {
      permissionId: {
        type: 'string',
      },
    },
  },
};

export const removePermissionSchema = {
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
      permissionId: {
        type: 'string',
      },
    },
    required: ['id', 'permissionId'],
  },
};


