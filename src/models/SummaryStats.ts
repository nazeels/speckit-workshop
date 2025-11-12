import { Expense } from './Expense'
import { Category } from './Category'
import { PaymentMethod } from './PaymentMethod'

/**
 * Category breakdown with spending totals
 */
export interface CategoryBreakdown {
  category: Category
  total: number
  count: number
  percentage: number
}

/**
 * Payment method breakdown with spending totals
 */
export interface PaymentMethodBreakdown {
  paymentMethod: PaymentMethod
  total: number
  count: number
  percentage: number
}

/**
 * Aggregated summary statistics for expenses
 */
export interface SummaryStats {
  totalSpending: number
  averageAmount: number
  transactionCount: number
  highestExpense: Expense | null
  mostUsedCategory: Category | null
  mostUsedPaymentMethod: PaymentMethod | null
  spendingByCategory: CategoryBreakdown[]
  spendingByPaymentMethod: PaymentMethodBreakdown[]
}

/**
 * Spending trend point for time-series data
 */
export interface SpendingTrendPoint {
  date: string // Formatted date (e.g., "2025-11-12", "Week 45", "Nov 2025")
  amount: number
  count: number
}

/**
 * Cumulative spending point
 */
export interface CumulativeSpendingPoint {
  date: string // ISO date string
  cumulative: number
}

/**
 * Period comparison statistics
 */
export interface PeriodComparison {
  period1Total: number
  period2Total: number
  difference: number
  percentageChange: number
  period1Average: number
  period2Average: number
}

/**
 * Merchant total spending
 */
export interface MerchantTotal {
  merchant: string
  total: number
  count: number
}
