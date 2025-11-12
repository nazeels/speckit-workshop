import { forwardRef, InputHTMLAttributes } from 'react'

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  helperText?: string
}

/**
 * DatePicker component (uses native HTML5 date input)
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, helperText, className = '', id, value, ...props }, ref) => {
    const inputId = id || `datepicker-${label?.toLowerCase().replace(/\s+/g, '-')}`

    // Format the value to YYYY-MM-DD for the input
    const formattedValue = value
      ? typeof value === 'string'
        ? value.split('T')[0] // Extract date part from ISO string
        : value
      : ''

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type="date"
          value={formattedValue}
          className={`input ${error ? 'input-error' : ''} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="error-message" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-sm text-gray-500 mt-1">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'
