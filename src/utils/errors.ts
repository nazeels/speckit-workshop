/**
 * Custom error classes for the application
 */

/**
 * Storage-related errors (localStorage issues)
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public code: 'UNAVAILABLE' | 'QUOTA_EXCEEDED' | 'PARSE_ERROR'
  ) {
    super(message)
    this.name = 'StorageError'
  }
}

/**
 * Validation errors for invalid user input
 */
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * Not found errors for missing resources
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}
