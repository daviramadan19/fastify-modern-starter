/**
 * Auth Schema - Request validation schemas for authentication
 */

export const registerSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
      password: {
        type: 'string',
        minLength: 6,
      },
      name: {
        type: 'string',
        maxLength: 191,
      },
      role: {
        type: 'string',
      },
    },
  },
};

export const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
      password: {
        type: 'string',
      },
    },
  },
};

export const verifySchema = {
  headers: {
    type: 'object',
    properties: {
      authorization: {
        type: 'string',
      },
    },
    required: ['authorization'],
  },
};

