import { Category } from './Category'
import { PaymentMethod } from './PaymentMethod'

/**
 * Date range for filtering
 */
export interface DateRange {
  start: Date | null
  end: Date | null
}

/**
 * Amount range for filtering
 */
export interface AmountRange {
  min: number | null
  max: number | null
}

/**
 * Filter criteria for expenses
 */
export interface ExpenseFilter {
  dateRange: DateRange
  categories: Category[]
  amountRange: AmountRange
  paymentMethods: PaymentMethod[]
  searchQuery: string
}

/**
 * Initial/empty filter state
 */
export const initialFilter: ExpenseFilter = {
  dateRange: { start: null, end: null },
  categories: [],
  amountRange: { min: null, max: null },
  paymentMethods: [],
  searchQuery: '',
}

/**
 * Check if a filter is empty (no criteria applied)
 */
export const isFilterEmpty = (filter: ExpenseFilter): boolean => {
  return (
    !filter.dateRange.start &&
    !filter.dateRange.end &&
    filter.categories.length === 0 &&
    !filter.amountRange.min &&
    !filter.amountRange.max &&
    filter.paymentMethods.length === 0 &&
    !filter.searchQuery
  )
}

/**
 * Count active filter criteria
 */
export const getActiveFilterCount = (filter: ExpenseFilter): number => {
  let count = 0
  if (filter.dateRange.start || filter.dateRange.end) count++
  if (filter.categories.length > 0) count++
  if (filter.amountRange.min !== null || filter.amountRange.max !== null) count++
  if (filter.paymentMethods.length > 0) count++
  if (filter.searchQuery) count++
  return count
}
