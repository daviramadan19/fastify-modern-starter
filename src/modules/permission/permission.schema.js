/**
 * Permission Schema - Request validation schemas for permission operations
 */

export const getPermissionSchema = {
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

export const createPermissionSchema = {
  body: {
    type: 'object',
    required: ['name', 'resource', 'action'],
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-z_]+\\.[a-z_]+$',
      },
      resource: {
        type: 'string',
        pattern: '^[a-z_]+$',
      },
      action: {
        type: 'string',
        enum: ['create', 'read', 'update', 'delete', 'list', 'manage'],
      },
      description: {
        type: 'string',
        maxLength: 255,
      },
    },
  },
};

export const updatePermissionSchema = {
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
        pattern: '^[a-z_]+\\.[a-z_]+$',
      },
      resource: {
        type: 'string',
        pattern: '^[a-z_]+$',
      },
      action: {
        type: 'string',
        enum: ['create', 'read', 'update', 'delete', 'list', 'manage'],
      },
      description: {
        type: 'string',
        maxLength: 255,
      },
    },
  },
};

export const deletePermissionSchema = {
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

export const listPermissionsSchema = {
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
      resource: {
        type: 'string',
      },
    },
  },
};

export const getByResourceSchema = {
  params: {
    type: 'object',
    properties: {
      resource: {
        type: 'string',
      },
    },
    required: ['resource'],
  },
};

