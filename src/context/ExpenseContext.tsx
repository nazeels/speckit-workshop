import { createContext, useContext, ReactNode } from 'react'
import { Expense } from '../models/Expense'
import { useLocalStorage } from '../hooks/useLocalStorage'

/**
 * Storage schema version for future migrations
 */
const SCHEMA_VERSION = 1
const STORAGE_KEY = 'expense-tracker-data'

/**
 * Storage structure
 */
interface AppStorage {
  expenses: Expense[]
  version: number
  lastUpdated: string
}

/**
 * Context value type
 */
interface ExpenseContextValue {
  expenses: Expense[]
  setExpenses: (expenses: Expense[] | ((prev: Expense[]) => Expense[])) => void
  clearExpenses: () => void
  storageKey: string
}

/**
 * Create context
 */
const ExpenseContext = createContext<ExpenseContextValue | undefined>(undefined)

/**
 * Provider props
 */
interface ExpenseProviderProps {
  children: ReactNode
}

/**
 * Expense Context Provider
 * Manages global expense state with localStorage persistence
 */
export function ExpenseProvider({ children }: ExpenseProviderProps) {
  // Initialize with empty storage structure
  const initialStorage: AppStorage = {
    expenses: [],
    version: SCHEMA_VERSION,
    lastUpdated: new Date().toISOString(),
  }

  const [storage, setStorage] = useLocalStorage<AppStorage>(STORAGE_KEY, initialStorage)

  // Helper to update expenses and maintain storage structure
  const setExpenses = (value: Expense[] | ((prev: Expense[]) => Expense[])) => {
    setStorage(prevStorage => {
      const newExpenses = value instanceof Function ? value(prevStorage.expenses) : value
      return {
        expenses: newExpenses,
        version: SCHEMA_VERSION,
        lastUpdated: new Date().toISOString(),
      }
    })
  }

  // Clear all expenses
  const clearExpenses = () => {
    setStorage({
      expenses: [],
      version: SCHEMA_VERSION,
      lastUpdated: new Date().toISOString(),
    })
  }

  const value: ExpenseContextValue = {
    expenses: storage.expenses,
    setExpenses,
    clearExpenses,
    storageKey: STORAGE_KEY,
  }

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
}

/**
 * Hook to use expense context
 * Must be used within ExpenseProvider
 */
export function useExpenseContext() {
  const context = useContext(ExpenseContext)
  if (context === undefined) {
    throw new Error('useExpenseContext must be used within ExpenseProvider')
  }
  return context
}
