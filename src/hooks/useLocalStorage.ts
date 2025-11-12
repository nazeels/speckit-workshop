import { useState, useEffect, useCallback } from 'react'
import { storageService } from '../services/storageService'

/**
 * Custom hook for using localStorage with React state
 * Automatically syncs state with localStorage
 *
 * @param key - Storage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [value, setValue, remove] tuple
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = storageService.getItem<T>(key)
      // Parse stored json or return initialValue
      return item !== null ? item : initialValue
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value

        // Save state
        setStoredValue(valueToStore)

        // Save to local storage
        const success = storageService.setItem(key, valueToStore)

        if (!success) {
          console.warn(`Storage quota exceeded when saving ${key}`)
          // You could trigger a notification here
        }
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error)
      }
    },
    [key, storedValue]
  )

  // Remove item from storage
  const remove = useCallback(() => {
    try {
      storageService.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
    }
  }, [key, initialValue])

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parsing storage event for ${key}:`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue, remove]
}
