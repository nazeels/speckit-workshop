import { ExpenseForm } from '../components/ExpenseForm/ExpenseForm'
import { useExpenses } from '../hooks/useExpenses'
import { useToast } from '../components/common/Toast/Toast'
import { CreateExpenseInput } from '../models/Expense'

/**
 * AddExpensePage - Page for adding new expenses
 */
export function AddExpensePage() {
  const { createExpense } = useExpenses()
  const { showToast, ToastComponent } = useToast()

  const handleSubmit = (data: CreateExpenseInput) => {
    try {
      createExpense(data)
      showToast('Expense added successfully!', 'success')
    } catch (error) {
      console.error('Error creating expense:', error)
      showToast(
        error instanceof Error ? error.message : 'Failed to add expense',
        'error'
      )
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Expense</h1>
        <p className="text-gray-600 mt-2">Record a new expense to track your spending</p>
      </div>

      <div className="card">
        <ExpenseForm onSubmit={handleSubmit} />
      </div>

      {ToastComponent}
    </div>
  )
}
