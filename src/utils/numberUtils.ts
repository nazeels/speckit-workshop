/**
 * Format number as currency
 * @param amount - Number to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format number with commas (no currency symbol)
 */
export const formatNumber = (amount: number, decimals = 2): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Parse currency string to number
 * Removes currency symbols, commas, and spaces
 */
export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^0-9.-]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Round number to specified decimal places
 */
export const roundToDecimals = (value: number, decimals = 2): number => {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0
  return roundToDecimals((value / total) * 100, 1)
}

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${roundToDecimals(value, decimals)}%`
}

/**
 * Validate that a number has at most 2 decimal places
 */
export const hasMaxTwoDecimals = (value: number): boolean => {
  return (value * 100) % 1 === 0
}

/**
 * Calculate sum of array of numbers
 */
export const sum = (numbers: number[]): number => {
  return numbers.reduce((acc, curr) => acc + curr, 0)
}

/**
 * Calculate average of array of numbers
 */
export const average = (numbers: number[]): number => {
  if (numbers.length === 0) return 0
  return sum(numbers) / numbers.length
}

/**
 * Find maximum value in array
 */
export const max = (numbers: number[]): number => {
  if (numbers.length === 0) return 0
  return Math.max(...numbers)
}

/**
 * Find minimum value in array
 */
export const min = (numbers: number[]): number => {
  if (numbers.length === 0) return 0
  return Math.min(...numbers)
}
