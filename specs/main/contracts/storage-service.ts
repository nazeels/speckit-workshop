/**
 * Storage Service Contract
 *
 * Abstraction layer over browser localStorage to provide:
 * - Error handling for quota exceeded and unavailable storage
 * - Storage usage monitoring
 * - Type-safe get/set operations
 * - Data versioning support
 */

export interface StorageUsage {
  used: number       // Bytes used
  available: number  // Estimated bytes available (typically ~5-10MB)
  percentage: number // Usage percentage (0-100)
}

export interface StorageService {
  /**
   * Check if localStorage is available
   * @returns true if localStorage is accessible, false otherwise
   */
  isAvailable(): boolean

  /**
   * Get item from storage
   * @param key - Storage key
   * @returns Parsed value or null if not found
   * @throws StorageError if parsing fails
   */
  getItem<T>(key: string): T | null

  /**
   * Set item in storage
   * @param key - Storage key
   * @param value - Value to store (will be JSON stringified)
   * @returns true if successful, false if quota exceeded
   * @throws StorageError if localStorage unavailable
   */
  setItem<T>(key: string, value: T): boolean

  /**
   * Remove item from storage
   * @param key - Storage key
   */
  removeItem(key: string): void

  /**
   * Clear all items from storage
   * @warning This will delete ALL data
   */
  clear(): void

  /**
   * Get current storage usage statistics
   * @returns Storage usage information
   */
  getStorageUsage(): StorageUsage

  /**
   * Check if storage is near quota limit
   * @param threshold - Percentage threshold (default 80)
   * @returns true if usage exceeds threshold
   */
  isNearQuota(threshold?: number): boolean
}

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
 * Example Usage:
 *
 * const storage = new LocalStorageService()
 *
 * if (!storage.isAvailable()) {
 *   console.error('localStorage is not available')
 *   return
 * }
 *
 * const success = storage.setItem('expenses', expensesArray)
 * if (!success) {
 *   alert('Storage quota exceeded. Please delete old expenses.')
 * }
 *
 * const expenses = storage.getItem<Expense[]>('expenses') ?? []
 *
 * if (storage.isNearQuota(80)) {
 *   console.warn('Storage is 80% full')
 * }
 */
