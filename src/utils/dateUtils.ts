import {
  format as dateFnsFormat,
  parseISO,
  startOfDay,
  endOfDay,
  isWithinInterval,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  subDays,
  subMonths,
  isValid,
} from 'date-fns'

/**
 * Format date to display string
 * @param date - Date to format (Date object or ISO string)
 * @param formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string, formatStr = 'MMM dd, yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return 'Invalid date'
  return dateFnsFormat(dateObj, formatStr)
}

/**
 * Format date and time
 */
export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, 'MMM dd, yyyy HH:mm')
}

/**
 * Parse ISO string to Date
 */
export const parseDate = (isoString: string): Date => {
  return parseISO(isoString)
}

/**
 * Get current date as ISO string
 */
export const getCurrentDateISO = (): string => {
  return new Date().toISOString()
}

/**
 * Get start of day
 */
export const getStartOfDay = (date: Date): Date => {
  return startOfDay(date)
}

/**
 * Get end of day
 */
export const getEndOfDay = (date: Date): Date => {
  return endOfDay(date)
}

/**
 * Check if date is within range
 */
export const isDateInRange = (
  date: Date | string,
  start: Date | null,
  end: Date | null
): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date

  if (!start && !end) return true

  if (start && !end) {
    return dateObj >= getStartOfDay(start)
  }

  if (!start && end) {
    return dateObj <= getEndOfDay(end)
  }

  if (start && end) {
    return isWithinInterval(dateObj, {
      start: getStartOfDay(start),
      end: getEndOfDay(end),
    })
  }

  return true
}

/**
 * Get date range presets
 */
export interface DateRangePreset {
  label: string
  start: Date
  end: Date
}

export const getDateRangePresets = (): DateRangePreset[] => {
  const today = new Date()

  return [
    {
      label: 'Today',
      start: startOfDay(today),
      end: endOfDay(today),
    },
    {
      label: 'Last 7 days',
      start: subDays(today, 6),
      end: today,
    },
    {
      label: 'Last 30 days',
      start: subDays(today, 29),
      end: today,
    },
    {
      label: 'This month',
      start: startOfMonth(today),
      end: endOfMonth(today),
    },
    {
      label: 'Last month',
      start: startOfMonth(subMonths(today, 1)),
      end: endOfMonth(subMonths(today, 1)),
    },
  ]
}

/**
 * Get week start date
 */
export const getWeekStart = (date: Date): Date => {
  return startOfWeek(date, { weekStartsOn: 0 }) // Sunday
}

/**
 * Get week end date
 */
export const getWeekEnd = (date: Date): Date => {
  return endOfWeek(date, { weekStartsOn: 0 })
}

/**
 * Get month start date
 */
export const getMonthStart = (date: Date): Date => {
  return startOfMonth(date)
}

/**
 * Get month end date
 */
export const getMonthEnd = (date: Date): Date => {
  return endOfMonth(date)
}

/**
 * Validate that date is not in the future
 */
export const isNotFuture = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return dateObj <= new Date()
}

/**
 * Convert Date to ISO string for storage
 */
export const toISOString = (date: Date): string => {
  return date.toISOString()
}
