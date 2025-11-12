import { z } from 'zod'
import { Category } from './Category'
import { PaymentMethod } from './PaymentMethod'

/**
 * Expense entity representing a single financial transaction
 */
export interface Expense {
  id: string
  amount: number
  date: string // ISO 8601 format
  category: Category
  paymentMethod: PaymentMethod
  description: string
  merchant: string
  createdAt: string // ISO 8601 format
  updatedAt: string // ISO 8601 format
}

/**
 * Zod validation schema for Expense
 */
export const ExpenseSchema = z.object({
  id: z.string().uuid(),
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(999999.99, 'Amount too large')
    .refine(val => Number.isFinite(val), 'Amount must be a valid number')
    .refine(val => (val * 100) % 1 === 0, 'Amount can have at most 2 decimal places'),
  date: z
    .string()
    .datetime('Invalid date format')
    .refine(val => new Date(val) <= new Date(), 'Date cannot be in the future'),
  category: z.nativeEnum(Category, {
    errorMap: () => ({ message: 'Invalid category' }),
  }),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    errorMap: () => ({ message: 'Invalid payment method' }),
  }),
  description: z.string().max(200, 'Description must be 200 characters or less').default(''),
  merchant: z.string().max(100, 'Merchant name must be 100 characters or less').default(''),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

/**
 * Schema for creating new expenses (without generated fields)
 */
export const CreateExpenseSchema = ExpenseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  description: z.string().max(200, 'Description must be 200 characters or less').optional(),
  merchant: z.string().max(100, 'Merchant name must be 100 characters or less').optional(),
})

/**
 * Schema for updating expenses (all fields optional except id)
 */
export const UpdateExpenseSchema = ExpenseSchema.partial()
  .required({ id: true })
  .refine(
    data => {
      // If amount is provided, validate it's positive and has max 2 decimals
      if (data.amount !== undefined) {
        return data.amount > 0 && (data.amount * 100) % 1 === 0
      }
      return true
    },
    { message: 'Amount must be positive with at most 2 decimal places', path: ['amount'] }
  )
  .refine(
    data => {
      // If date is provided, validate it's not in the future
      if (data.date !== undefined) {
        return new Date(data.date) <= new Date()
      }
      return true
    },
    { message: 'Date cannot be in the future', path: ['date'] }
  )

/**
 * Type for creating new expenses (inferred from schema)
 */
export type CreateExpenseInput = z.infer<typeof CreateExpenseSchema>

/**
 * Type for updating expenses (inferred from schema)
 */
export type UpdateExpenseInput = z.infer<typeof UpdateExpenseSchema>
