/**
 * Expense Service Contract
 *
 * Provides CRUD operations for expense management.
 * Handles business logic for creating, reading, updating, and deleting expenses.
 */

import { Expense, Category, PaymentMethod } from '../data-model'

export interface CreateExpenseInput {
  amount: number
  date: string // ISO 8601 format
  category: Category
  paymentMethod: PaymentMethod
  description?: string
  merchant?: string
}

export interface UpdateExpenseInput {
  id: string
  amount?: number
  date?: string
  category?: Category
  paymentMethod?: PaymentMethod
  description?: string
  merchant?: string
}

export interface ExpenseService {
  /**
   * Get all expenses
   * @returns Array of all expenses, sorted by date (newest first)
   */
  getAllExpenses(): Expense[]

  /**
   * Get expense by ID
   * @param id - Expense ID
   * @returns Expense or null if not found
   */
  getExpenseById(id: string): Expense | null

  /**
   * Create new expense
   * @param input - Expense data (without id, timestamps)
   * @returns Created expense with generated id and timestamps
   * @throws ValidationError if input is invalid
   */
  createExpense(input: CreateExpenseInput): Expense

  /**
   * Update existing expense
   * @param input - Updated expense data (must include id)
   * @returns Updated expense
   * @throws ValidationError if input is invalid
   * @throws NotFoundError if expense doesn't exist
   */
  updateExpense(input: UpdateExpenseInput): Expense

  /**
   * Delete expense by ID
   * @param id - Expense ID
   * @returns true if deleted, false if not found
   */
  deleteExpense(id: string): boolean

  /**
   * Delete multiple expenses by IDs
   * @param ids - Array of expense IDs
   * @returns Number of expenses deleted
   */
  deleteExpenses(ids: string[]): number

  /**
   * Count total expenses
   * @returns Total number of expenses
   */
  getExpenseCount(): number

  /**
   * Get expenses within date range
   * @param startDate - Start date (ISO 8601)
   * @param endDate - End date (ISO 8601)
   * @returns Expenses within range
   */
  getExpensesByDateRange(startDate: string, endDate: string): Expense[]

  /**
   * Get expenses by category
   * @param category - Category to filter by
   * @returns Expenses in category
   */
  getExpensesByCategory(category: Category): Expense[]

  /**
   * Export all expenses as JSON
   * @returns JSON string of all expenses
   */
  exportExpenses(): string

  /**
   * Import expenses from JSON
   * @param jsonData - JSON string of expenses array
   * @param mode - 'merge' to add to existing, 'replace' to overwrite
   * @returns Number of expenses imported
   * @throws ValidationError if JSON is invalid
   */
  importExpenses(jsonData: string, mode: 'merge' | 'replace'): number
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

/**
 * Example Usage:
 *
 * const expenseService = new ExpenseServiceImpl(storageService)
 *
 * // Create expense
 * const expense = expenseService.createExpense({
 *   amount: 42.50,
 *   date: new Date().toISOString(),
 *   category: Category.FOOD_DINING,
 *   paymentMethod: PaymentMethod.CREDIT_CARD,
 *   description: 'Lunch',
 *   merchant: 'Cafe Mocha'
 * })
 *
 * // Update expense
 * const updated = expenseService.updateExpense({
 *   id: expense.id,
 *   amount: 45.00
 * })
 *
 * // Delete expense
 * expenseService.deleteExpense(expense.id)
 *
 * // Get all expenses
 * const allExpenses = expenseService.getAllExpenses()
 */
