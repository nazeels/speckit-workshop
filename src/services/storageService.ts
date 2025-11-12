import { StorageError } from '../utils/errors'

/**
 * Storage usage information
 */
export interface StorageUsage {
  used: number // Bytes used
  available: number // Estimated bytes available
  percentage: number // Usage percentage (0-100)
}

/**
 * Storage service interface
 */
export interface StorageService {
  isAvailable(): boolean
  getItem<T>(key: string): T | null
  setItem<T>(key: string, value: T): boolean
  removeItem(key: string): void
  clear(): void
  getStorageUsage(): StorageUsage
  isNearQuota(threshold?: number): boolean
}

/**
 * LocalStorage implementation of StorageService
 */
export class LocalStorageService implements StorageService {
  private readonly QUOTA_ESTIMATE = 5 * 1024 * 1024 // 5MB typical limit

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    try {
      const testKey = '__storage_test__'
      localStorage.setItem(testKey, testKey)
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  /**
   * Get item from storage
   */
  getItem<T>(key: string): T | null {
    if (!this.isAvailable()) {
      throw new StorageError('localStorage is not available', 'UNAVAILABLE')
    }

    try {
      const item = localStorage.getItem(key)
      if (item === null) return null
      return JSON.parse(item) as T
    } catch (error) {
      if (error instanceof StorageError) throw error
      throw new StorageError('Failed to parse stored data', 'PARSE_ERROR')
    }
  }

  /**
   * Set item in storage
   */
  setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      throw new StorageError('localStorage is not available', 'UNAVAILABLE')
    }

    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
      return true
    } catch (error) {
      // Check if it's a quota exceeded error
      if (error instanceof DOMException) {
        if (
          error.name === 'QuotaExceededError' ||
          error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
        ) {
          return false // Quota exceeded
        }
      }
      throw error
    }
  }

  /**
   * Remove item from storage
   */
  removeItem(key: string): void {
    if (!this.isAvailable()) {
      return
    }
    localStorage.removeItem(key)
  }

  /**
   * Clear all items from storage
   */
  clear(): void {
    if (!this.isAvailable()) {
      return
    }
    localStorage.clear()
  }

  /**
   * Get current storage usage
   */
  getStorageUsage(): StorageUsage {
    let used = 0

    if (!this.isAvailable()) {
      return { used: 0, available: this.QUOTA_ESTIMATE, percentage: 0 }
    }

    try {
      // Calculate total bytes used
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          const value = localStorage[key]
          // Count both key and value length (each character is ~2 bytes in UTF-16)
          used += (key.length + value.length) * 2
        }
      }
    } catch (error) {
      console.error('Failed to calculate storage usage:', error)
    }

    const percentage = (used / this.QUOTA_ESTIMATE) * 100

    return {
      used,
      available: this.QUOTA_ESTIMATE,
      percentage: Math.min(percentage, 100), // Cap at 100%
    }
  }

  /**
   * Check if storage is near quota
   */
  isNearQuota(threshold = 80): boolean {
    const usage = this.getStorageUsage()
    return usage.percentage >= threshold
  }
}

/**
 * Singleton instance
 */
export const storageService = new LocalStorageService()
