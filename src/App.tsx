import { ExpenseProvider } from './context/ExpenseContext'
import { AddExpensePage } from './pages/AddExpensePage'

function App() {
  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Expense Tracker</h1>
            <p className="text-gray-600 mt-2">
              Track, categorize, and analyze your personal expenses
            </p>
          </header>

          <main>
            <AddExpensePage />
          </main>
        </div>
      </div>
    </ExpenseProvider>
  )
}

export default App
