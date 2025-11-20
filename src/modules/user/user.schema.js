/**
 * User Schema - Request validation schemas for user operations
 */

export const getUserSchema = {
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

export const updateUserSchema = {
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
        maxLength: 191,
      },
      email: {
        type: 'string',
        format: 'email',
      },
      isActive: {
        type: 'boolean',
      },
    },
  },
};

export const deleteUserSchema = {
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

export const listUsersSchema = {
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
        default: 10,
      },
      includeInactive: {
        type: 'string',
        enum: ['true', 'false'],
      },
    },
  },
};


