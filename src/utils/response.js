/**
 * Standardized response utility functions
 */

export class ResponseUtil {
  /**
   * Success response
   */
  static success(data, message = 'Success') {
    return {
      success: true,
      message,
      data,
    };
  }

  /**
   * Error response
   */
  static error(message = 'Error', errors = null) {
    return {
      success: false,
      message,
      errors,
    };
  }

  /**
   * Paginated response
   */
  static paginated(data, pagination) {
    return {
      success: true,
      data,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        total: pagination.total || 0,
        totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 10)),
      },
    };
  }
}

