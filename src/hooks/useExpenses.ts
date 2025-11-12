import { useCallback } from 'react'
import { useExpenseContext } from '../context/ExpenseContext'
import { expenseService } from '../services/expenseService'
import { CreateExpenseInput, UpdateExpenseInput } from '../models/Expense'
import { Category } from '../models/Category'

/**
 * Custom hook for managing expenses
 * Provides convenient methods for CRUD operations
 */
export function useExpenses() {
  const { expenses, setExpenses, clearExpenses } = useExpenseContext()

  /**
   * Get all expenses (sorted by date, newest first)
   */
  const getAllExpenses = useCallback(() => {
    return expenseService.getAllExpenses(expenses)
  }, [expenses])

  /**
   * Get expense by ID
   */
  const getExpenseById = useCallback(
    (id: string) => {
      return expenseService.getExpenseById(expenses, id)
    },
    [expenses]
  )

  /**
   * Create a new expense
   */
  const createExpense = useCallback(
    (input: CreateExpenseInput) => {
      const newExpense = expenseService.createExpense(input)
      setExpenses(prev => [...prev, newExpense])
      return newExpense
    },
    [setExpenses]
  )

  /**
   * Update an existing expense
   */
  const updateExpense = useCallback(
    (input: UpdateExpenseInput) => {
      const existing = expenseService.getExpenseById(expenses, input.id)
      if (!existing) {
        throw new Error(`Expense with id ${input.id} not found`)
      }

      const updated = expenseService.updateExpense(existing, input)
      setExpenses(prev => prev.map(e => (e.id === updated.id ? updated : e)))
      return updated
    },
    [expenses, setExpenses]
  )

  /**
   * Delete an expense
   */
  const deleteExpense = useCallback(
    (id: string) => {
      const filtered = expenseService.deleteExpense(expenses, id)
      setExpenses(filtered)
    },
    [expenses, setExpenses]
  )

  /**
   * Delete multiple expenses
   */
  const deleteExpenses = useCallback(
    (ids: string[]) => {
      const filtered = expenseService.deleteExpenses(expenses, ids)
      setExpenses(filtered)
    },
    [expenses, setExpenses]
  )

  /**
   * Get expense count
   */
  const getExpenseCount = useCallback(() => {
    return expenseService.getExpenseCount(expenses)
  }, [expenses])

  /**
   * Get expenses by date range
   */
  const getExpensesByDateRange = useCallback(
    (startDate: string, endDate: string) => {
      return expenseService.getExpensesByDateRange(expenses, startDate, endDate)
    },
    [expenses]
  )

  /**
   * Get expenses by category
   */
  const getExpensesByCategory = useCallback(
    (category: Category) => {
      return expenseService.getExpensesByCategory(expenses, category)
    },
    [expenses]
  )

  /**
   * Export expenses as JSON
   */
  const exportExpenses = useCallback(() => {
    return expenseService.exportExpenses(expenses)
  }, [expenses])

  /**
   * Import expenses from JSON
   */
  const importExpenses = useCallback(
    (jsonData: string, mode: 'merge' | 'replace' = 'merge') => {
      const imported = expenseService.importExpenses(expenses, jsonData, mode)
      setExpenses(imported)
      return imported.length
    },
    [expenses, setExpenses]
  )

  /**
   * Clear all expenses
   */
  const clearAllExpenses = useCallback(() => {
    clearExpenses()
  }, [clearExpenses])

  return {
    expenses: getAllExpenses(),
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
    deleteExpenses,
    getExpenseCount,
    getExpensesByDateRange,
    getExpensesByCategory,
    exportExpenses,
    importExpenses,
    clearAllExpenses,
  }
}
