/**
 * Data structures for chart visualizations (Recharts compatible)
 */

/**
 * Pie chart data point
 */
export interface PieChartDataPoint {
  name: string // Human-readable label
  value: number // Numeric value (spending amount)
  color: string // Hex color code
  percentage: number // Percentage of total
  count: number // Number of transactions
}

/**
 * Bar chart data point (spending over time)
 */
export interface BarChartDataPoint {
  date: string // Formatted date label
  amount: number // Total spending for period
  count: number // Number of transactions
}

/**
 * Line chart data point (spending trend)
 */
export interface LineChartDataPoint {
  date: string // Formatted date label
  amount: number // Spending amount (cumulative or period total)
}

/**
 * Time granularity for grouping
 */
export type TimeGranularity = 'daily' | 'weekly' | 'monthly'

/**
 * Category comparison data point (for grouped bar charts)
 */
export interface CategoryComparisonDataPoint {
  category: string // Category label
  [key: string]: string | number // Dynamic keys for period labels
}
