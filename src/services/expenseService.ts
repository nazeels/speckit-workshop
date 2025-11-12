import { v4 as uuidv4 } from 'uuid'
import {
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
  CreateExpenseSchema,
  UpdateExpenseSchema,
} from '../models/Expense'
import { Category } from '../models/Category'
import { ValidationError, NotFoundError } from '../utils/errors'
import { toISOString } from '../utils/dateUtils'

/**
 * Expense Service
 * Handles all CRUD operations for expenses
 */
export class ExpenseService {
  /**
   * Create a new expense
   */
  createExpense(input: CreateExpenseInput): Expense {
    // Validate input
    const validated = CreateExpenseSchema.parse(input)

    const now = toISOString(new Date())

    const expense: Expense = {
      id: uuidv4(),
      amount: validated.amount,
      date: validated.date,
      category: validated.category,
      paymentMethod: validated.paymentMethod,
      description: validated.description || '',
      merchant: validated.merchant || '',
      createdAt: now,
      updatedAt: now,
    }

    return expense
  }

  /**
   * Update an existing expense
   */
  updateExpense(existingExpense: Expense, input: UpdateExpenseInput): Expense {
    // Validate input
    const validated = UpdateExpenseSchema.parse(input)

    if (validated.id !== existingExpense.id) {
      throw new ValidationError('Cannot change expense ID', 'id')
    }

    const updated: Expense = {
      ...existingExpense,
      ...validated,
      updatedAt: toISOString(new Date()),
    }

    return updated
  }

  /**
   * Get all expenses sorted by date (newest first)
   */
  getAllExpenses(expenses: Expense[]): Expense[] {
    return [...expenses].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }

  /**
   * Get expense by ID
   */
  getExpenseById(expenses: Expense[], id: string): Expense | null {
    return expenses.find(e => e.id === id) || null
  }

  /**
   * Delete expense by ID
   */
  deleteExpense(expenses: Expense[], id: string): Expense[] {
    const expense = this.getExpenseById(expenses, id)
    if (!expense) {
      throw new NotFoundError(`Expense with id ${id} not found`)
    }
    return expenses.filter(e => e.id !== id)
  }

  /**
   * Delete multiple expenses by IDs
   */
  deleteExpenses(expenses: Expense[], ids: string[]): Expense[] {
    return expenses.filter(e => !ids.includes(e.id))
  }

  /**
   * Get expenses count
   */
  getExpenseCount(expenses: Expense[]): number {
    return expenses.length
  }

  /**
   * Get expenses within date range
   */
  getExpensesByDateRange(
    expenses: Expense[],
    startDate: string,
    endDate: string
  ): Expense[] {
    const start = new Date(startDate)
    const end = new Date(endDate)

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= start && expenseDate <= end
    })
  }

  /**
   * Get expenses by category
   */
  getExpensesByCategory(expenses: Expense[], category: Category): Expense[] {
    return expenses.filter(e => e.category === category)
  }

  /**
   * Export expenses as JSON string
   */
  exportExpenses(expenses: Expense[]): string {
    return JSON.stringify(expenses, null, 2)
  }

  /**
   * Import expenses from JSON string
   */
  importExpenses(
    currentExpenses: Expense[],
    jsonData: string,
    mode: 'merge' | 'replace'
  ): Expense[] {
    try {
      const imported = JSON.parse(jsonData) as Expense[]

      // Validate each expense
      if (!Array.isArray(imported)) {
        throw new ValidationError('Invalid JSON format: expected an array')
      }

      // If replace mode, return imported expenses
      if (mode === 'replace') {
        return imported
      }

      // Merge mode: combine with existing, avoiding duplicates by ID
      const existingIds = new Set(currentExpenses.map(e => e.id))
      const newExpenses = imported.filter(e => !existingIds.has(e.id))

      return [...currentExpenses, ...newExpenses]
    } catch (error) {
      if (error instanceof ValidationError) throw error
      throw new ValidationError('Failed to parse JSON data')
    }
  }
}

/**
 * Singleton instance
 */
export const expenseService = new ExpenseService()
