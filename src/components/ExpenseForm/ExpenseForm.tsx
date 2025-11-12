import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateExpenseSchema, CreateExpenseInput } from '../../models/Expense'
import { Category, CategoryLabels, getAllCategories } from '../../models/Category'
import {
  PaymentMethod,
  PaymentMethodLabels,
  getAllPaymentMethods,
} from '../../models/PaymentMethod'
import { Input } from '../common/Input/Input'
import { Select } from '../common/Select/Select'
import { DatePicker } from '../common/DatePicker/DatePicker'
import { Button } from '../common/Button/Button'
import { formatDate, toISOString } from '../../utils/dateUtils'

export interface ExpenseFormProps {
  onSubmit: (data: CreateExpenseInput) => void | Promise<void>
  onCancel?: () => void
  defaultValues?: Partial<CreateExpenseInput>
  submitLabel?: string
}

/**
 * ExpenseForm component with React Hook Form and Zod validation
 */
export function ExpenseForm({
  onSubmit,
  onCancel,
  defaultValues,
  submitLabel = 'Add Expense',
}: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateExpenseInput>({
    resolver: zodResolver(CreateExpenseSchema),
    defaultValues: {
      date: toISOString(new Date()), // Smart default: today's date
      description: '',
      merchant: '',
      ...defaultValues,
    },
  })

  const onSubmitHandler = async (data: CreateExpenseInput) => {
    await onSubmit(data)
    reset() // Clear form after successful submission
  }

  // Prepare category options
  const categoryOptions = getAllCategories().map(cat => ({
    value: cat,
    label: CategoryLabels[cat as Category],
  }))

  // Prepare payment method options
  const paymentMethodOptions = getAllPaymentMethods().map(pm => ({
    value: pm,
    label: PaymentMethodLabels[pm as PaymentMethod],
  }))

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Amount */}
        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          error={errors.amount?.message}
          {...register('amount', { valueAsNumber: true })}
          required
        />

        {/* Date */}
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Date"
              error={errors.date?.message}
              max={formatDate(new Date(), 'yyyy-MM-dd')} // Prevent future dates
              {...field}
              required
            />
          )}
        />

        {/* Category */}
        <Select
          label="Category"
          options={categoryOptions}
          placeholder="Select a category"
          error={errors.category?.message}
          {...register('category')}
          required
        />

        {/* Payment Method */}
        <Select
          label="Payment Method"
          options={paymentMethodOptions}
          placeholder="Select payment method"
          error={errors.paymentMethod?.message}
          {...register('paymentMethod')}
          required
        />
      </div>

      {/* Merchant */}
      <Input
        label="Merchant"
        type="text"
        placeholder="Where did you spend?"
        error={errors.merchant?.message}
        {...register('merchant')}
      />

      {/* Description */}
      <div>
        <label htmlFor="description" className="label">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Add notes about this expense..."
          className={`input resize-none ${errors.description ? 'input-error' : ''}`}
          {...register('description')}
        />
        {errors.description && <p className="error-message">{errors.description.message}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" fullWidth loading={isSubmitting}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
