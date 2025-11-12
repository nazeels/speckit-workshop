/**
 * Chart Data Service Contract
 *
 * Transforms expense data into chart-ready formats for visualization libraries.
 * Provides data structures optimized for Recharts components.
 */

import { Expense, Category, PaymentMethod } from '../data-model'

export interface PieChartDataPoint {
  name: string // Human-readable label
  value: number // Numeric value (spending amount)
  color: string // Hex color code
  percentage: number // Percentage of total
  count: number // Number of transactions
}

export interface BarChartDataPoint {
  date: string // Formatted date label
  amount: number // Total spending for period
  count: number // Number of transactions
}

export interface LineChartDataPoint {
  date: string // Formatted date label
  amount: number // Spending amount (cumulative or period total)
}

export interface TimeGranularity {
  type: 'daily' | 'weekly' | 'monthly'
}

export interface ChartDataService {
  /**
   * Transform expenses into pie chart data (category breakdown)
   * @param expenses - Array of expenses
   * @returns Array of pie chart data points, sorted by value descending
   */
  toPieChartData(expenses: Expense[]): PieChartDataPoint[]

  /**
   * Transform expenses into bar chart data (spending over time)
   * @param expenses - Array of expenses
   * @param granularity - Time grouping (daily, weekly, monthly)
   * @param dateFormat - Optional custom date format (uses default if not provided)
   * @returns Array of bar chart data points, sorted chronologically
   */
  toBarChartData(
    expenses: Expense[],
    granularity: 'daily' | 'weekly' | 'monthly',
    dateFormat?: string
  ): BarChartDataPoint[]

  /**
   * Transform expenses into line chart data (spending trend)
   * @param expenses - Array of expenses
   * @param granularity - Time grouping
   * @param cumulative - If true, show cumulative total; if false, show period totals
   * @returns Array of line chart data points, sorted chronologically
   */
  toLineChartData(
    expenses: Expense[],
    granularity: 'daily' | 'weekly' | 'monthly',
    cumulative: boolean
  ): LineChartDataPoint[]

  /**
   * Transform payment method breakdown into pie chart data
   * @param expenses - Array of expenses
   * @returns Array of pie chart data points for payment methods
   */
  toPaymentMethodPieChartData(expenses: Expense[]): PieChartDataPoint[]

  /**
   * Generate chart data for category comparison
   * @param expenses1 - First period expenses
   * @param expenses2 - Second period expenses
   * @param label1 - Label for first period
   * @param label2 - Label for second period
   * @returns Data for grouped bar chart
   */
  toCategoryComparisonData(
    expenses1: Expense[],
    expenses2: Expense[],
    label1: string,
    label2: string
  ): CategoryComparisonDataPoint[]

  /**
   * Format date according to granularity
   * @param date - Date to format
   * @param granularity - Time grouping
   * @returns Formatted date string
   */
  formatDateByGranularity(
    date: Date,
    granularity: 'daily' | 'weekly' | 'monthly'
  ): string

  /**
   * Group expenses by time period
   * @param expenses - Array of expenses
   * @param granularity - Time grouping
   * @returns Map of period key to expenses
   */
  groupExpensesByPeriod(
    expenses: Expense[],
    granularity: 'daily' | 'weekly' | 'monthly'
  ): Map<string, Expense[]>

  /**
   * Calculate percentage values for pie chart
   * @param values - Array of numeric values
   * @returns Array of percentages (0-100)
   */
  calculatePercentages(values: number[]): number[]
}

export interface CategoryComparisonDataPoint {
  category: string // Category label
  [key: string]: string | number // Dynamic keys for period labels
}

/**
 * Example Usage:
 *
 * const chartDataService = new ChartDataServiceImpl()
 * const expenses = expenseService.getAllExpenses()
 *
 * // Pie chart data for Recharts PieChart
 * const pieData = chartDataService.toPieChartData(expenses)
 * <PieChart>
 *   <Pie data={pieData} dataKey="value" nameKey="name" />
 * </PieChart>
 *
 * // Bar chart data for Recharts BarChart
 * const barData = chartDataService.toBarChartData(expenses, 'weekly')
 * <BarChart data={barData}>
 *   <Bar dataKey="amount" />
 *   <XAxis dataKey="date" />
 * </BarChart>
 *
 * // Line chart data for Recharts LineChart
 * const lineData = chartDataService.toLineChartData(expenses, 'daily', true)
 * <LineChart data={lineData}>
 *   <Line dataKey="amount" />
 *   <XAxis dataKey="date" />
 * </LineChart>
 *
 * // Category comparison (current vs previous month)
 * const thisMonth = filterService.filterByDateRange(expenses, startOfMonth, endOfMonth)
 * const lastMonth = filterService.filterByDateRange(expenses, startOfLastMonth, endOfLastMonth)
 * const comparison = chartDataService.toCategoryComparisonData(
 *   lastMonth,
 *   thisMonth,
 *   'Last Month',
 *   'This Month'
 * )
 * <BarChart data={comparison}>
 *   <Bar dataKey="Last Month" fill="#8884d8" />
 *   <Bar dataKey="This Month" fill="#82ca9d" />
 * </BarChart>
 */
