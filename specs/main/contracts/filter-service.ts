/**
 * Filter Service Contract
 *
 * Provides filtering and search capabilities for expenses.
 * Handles complex filtering logic with multiple criteria.
 */

import { Expense, Category, PaymentMethod, ExpenseFilter } from '../data-model'

export interface FilterService {
  /**
   * Filter expenses by given criteria
   * @param expenses - Array of expenses to filter
   * @param filter - Filter criteria
   * @returns Filtered expenses
   */
  filterExpenses(expenses: Expense[], filter: ExpenseFilter): Expense[]

  /**
   * Filter expenses by date range
   * @param expenses - Array of expenses
   * @param startDate - Start date (inclusive)
   * @param endDate - End date (inclusive)
   * @returns Filtered expenses
   */
  filterByDateRange(
    expenses: Expense[],
    startDate: Date | null,
    endDate: Date | null
  ): Expense[]

  /**
   * Filter expenses by categories
   * @param expenses - Array of expenses
   * @param categories - Categories to include (empty = all)
   * @returns Filtered expenses
   */
  filterByCategories(expenses: Expense[], categories: Category[]): Expense[]

  /**
   * Filter expenses by amount range
   * @param expenses - Array of expenses
   * @param minAmount - Minimum amount (inclusive)
   * @param maxAmount - Maximum amount (inclusive)
   * @returns Filtered expenses
   */
  filterByAmountRange(
    expenses: Expense[],
    minAmount: number | null,
    maxAmount: number | null
  ): Expense[]

  /**
   * Filter expenses by payment methods
   * @param expenses - Array of expenses
   * @param paymentMethods - Payment methods to include (empty = all)
   * @returns Filtered expenses
   */
  filterByPaymentMethods(
    expenses: Expense[],
    paymentMethods: PaymentMethod[]
  ): Expense[]

  /**
   * Search expenses by text query
   * @param expenses - Array of expenses
   * @param query - Search query (searches description and merchant)
   * @returns Filtered expenses
   */
  searchExpenses(expenses: Expense[], query: string): Expense[]

  /**
   * Sort expenses
   * @param expenses - Array of expenses
   * @param sortBy - Field to sort by
   * @param order - Sort order
   * @returns Sorted expenses
   */
  sortExpenses(
    expenses: Expense[],
    sortBy: 'date' | 'amount' | 'category' | 'merchant',
    order: 'asc' | 'desc'
  ): Expense[]

  /**
   * Check if filter is empty (no criteria applied)
   * @param filter - Filter to check
   * @returns true if filter is empty
   */
  isFilterEmpty(filter: ExpenseFilter): boolean

  /**
   * Get count of active filter criteria
   * @param filter - Filter to analyze
   * @returns Number of active filters
   */
  getActiveFilterCount(filter: ExpenseFilter): number

  /**
   * Clear all filter criteria
   * @returns Empty filter
   */
  clearFilter(): ExpenseFilter
}

/**
 * Example Usage:
 *
 * const filterService = new FilterServiceImpl()
 * const allExpenses = expenseService.getAllExpenses()
 *
 * // Apply multiple filters
 * const filter: ExpenseFilter = {
 *   dateRange: {
 *     start: new Date('2025-11-01'),
 *     end: new Date('2025-11-30')
 *   },
 *   categories: [Category.FOOD_DINING, Category.ENTERTAINMENT],
 *   amountRange: { min: 10, max: 100 },
 *   paymentMethods: [PaymentMethod.CREDIT_CARD],
 *   searchQuery: 'cafe'
 * }
 *
 * const filtered = filterService.filterExpenses(allExpenses, filter)
 *
 * // Check filter state
 * const activeCount = filterService.getActiveFilterCount(filter)
 * console.log(`${activeCount} filters applied`)
 *
 * // Sort results
 * const sorted = filterService.sortExpenses(filtered, 'date', 'desc')
 */
