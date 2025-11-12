/**
 * Analytics Service Contract
 *
 * Provides statistical analysis and aggregations for expense data.
 * Calculates summary statistics, breakdowns, and trends.
 */

import {
  Expense,
  Category,
  PaymentMethod,
  SummaryStats,
  CategoryBreakdown,
  PaymentMethodBreakdown
} from '../data-model'

export interface AnalyticsService {
  /**
   * Calculate summary statistics for expenses
   * @param expenses - Array of expenses to analyze
   * @returns Summary statistics
   */
  calculateSummaryStats(expenses: Expense[]): SummaryStats

  /**
   * Calculate total spending
   * @param expenses - Array of expenses
   * @returns Total sum of all amounts
   */
  calculateTotalSpending(expenses: Expense[]): number

  /**
   * Calculate average expense amount
   * @param expenses - Array of expenses
   * @returns Average amount (0 if no expenses)
   */
  calculateAverageAmount(expenses: Expense[]): number

  /**
   * Find highest expense
   * @param expenses - Array of expenses
   * @returns Expense with highest amount, or null if empty
   */
  findHighestExpense(expenses: Expense[]): Expense | null

  /**
   * Find most used category
   * @param expenses - Array of expenses
   * @returns Most frequent category, or null if empty
   */
  findMostUsedCategory(expenses: Expense[]): Category | null

  /**
   * Find most used payment method
   * @param expenses - Array of expenses
   * @returns Most frequent payment method, or null if empty
   */
  findMostUsedPaymentMethod(expenses: Expense[]): PaymentMethod | null

  /**
   * Calculate spending breakdown by category
   * @param expenses - Array of expenses
   * @returns Array of category breakdowns with totals and percentages
   */
  calculateSpendingByCategory(expenses: Expense[]): CategoryBreakdown[]

  /**
   * Calculate spending breakdown by payment method
   * @param expenses - Array of expenses
   * @returns Array of payment method breakdowns with totals and percentages
   */
  calculateSpendingByPaymentMethod(expenses: Expense[]): PaymentMethodBreakdown[]

  /**
   * Calculate spending trend over time
   * @param expenses - Array of expenses
   * @param granularity - Time grouping (daily, weekly, monthly)
   * @returns Array of time periods with spending totals
   */
  calculateSpendingTrend(
    expenses: Expense[],
    granularity: 'daily' | 'weekly' | 'monthly'
  ): SpendingTrendPoint[]

  /**
   * Calculate cumulative spending over time
   * @param expenses - Array of expenses (should be sorted by date)
   * @returns Array of dates with cumulative amounts
   */
  calculateCumulativeSpending(expenses: Expense[]): CumulativeSpendingPoint[]

  /**
   * Compare spending between two date ranges
   * @param expenses - Array of all expenses
   * @param range1Start - First range start date
   * @param range1End - First range end date
   * @param range2Start - Second range start date
   * @param range2End - Second range end date
   * @returns Comparison statistics
   */
  compareSpendingPeriods(
    expenses: Expense[],
    range1Start: Date,
    range1End: Date,
    range2Start: Date,
    range2End: Date
  ): PeriodComparison

  /**
   * Get top N merchants by spending
   * @param expenses - Array of expenses
   * @param limit - Number of top merchants to return
   * @returns Array of merchants with totals
   */
  getTopMerchants(expenses: Expense[], limit: number): MerchantTotal[]
}

export interface SpendingTrendPoint {
  date: string // Formatted date (e.g., "2025-11-12", "Week 45", "Nov 2025")
  amount: number
  count: number // Number of transactions
}

export interface CumulativeSpendingPoint {
  date: string // ISO date string
  cumulative: number
}

export interface PeriodComparison {
  period1Total: number
  period2Total: number
  difference: number // period2 - period1
  percentageChange: number // ((period2 - period1) / period1) * 100
  period1Average: number
  period2Average: number
}

export interface MerchantTotal {
  merchant: string
  total: number
  count: number
}

/**
 * Example Usage:
 *
 * const analyticsService = new AnalyticsServiceImpl()
 * const expenses = expenseService.getAllExpenses()
 *
 * // Get summary stats
 * const stats = analyticsService.calculateSummaryStats(expenses)
 * console.log(`Total: $${stats.totalSpending.toFixed(2)}`)
 * console.log(`Average: $${stats.averageAmount.toFixed(2)}`)
 * console.log(`Most used: ${stats.mostUsedCategory}`)
 *
 * // Get category breakdown for pie chart
 * const categoryData = analyticsService.calculateSpendingByCategory(expenses)
 * categoryData.forEach(item => {
 *   console.log(`${item.category}: $${item.total} (${item.percentage}%)`)
 * })
 *
 * // Get spending trend for line chart
 * const trend = analyticsService.calculateSpendingTrend(expenses, 'weekly')
 *
 * // Compare this month vs last month
 * const comparison = analyticsService.compareSpendingPeriods(
 *   expenses,
 *   new Date('2025-10-01'),
 *   new Date('2025-10-31'),
 *   new Date('2025-11-01'),
 *   new Date('2025-11-30')
 * )
 * console.log(`Change: ${comparison.percentageChange.toFixed(1)}%`)
 */
