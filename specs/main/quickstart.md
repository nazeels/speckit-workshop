# Quickstart Guide: Expense Tracker

**Feature**: Expense Tracker Application
**Target Audience**: Developers new to this codebase
**Time to Complete**: ~15 minutes

## Overview

This guide helps you set up your development environment, understand the codebase structure, and make your first contribution to the Expense Tracker application.

---

## Prerequisites

- **Node.js**: 18.x or higher ([Download](https://nodejs.org/))
- **npm**: 9.x or higher (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended (with TypeScript and ESLint extensions)
- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge)

---

## Quick Setup (5 minutes)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd expense-tracker
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- React 18
- TypeScript
- Vite (build tool)
- Recharts (charting library)
- React Hook Form + Zod (forms & validation)
- date-fns (date utilities)
- Tailwind CSS (styling)
- Vitest + Testing Library (testing)

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run Tests

```bash
npm test
```

---

## Project Structure

```
expense-tracker/
├── src/
│   ├── components/        # UI components
│   │   ├── ExpenseForm/   # Add/edit expense form
│   │   ├── ExpenseList/   # List with filtering
│   │   ├── Charts/        # Visualization components
│   │   └── common/        # Reusable UI elements
│   ├── services/          # Business logic
│   │   ├── storageService.ts      # localStorage wrapper
│   │   ├── expenseService.ts      # CRUD operations
│   │   ├── filterService.ts       # Filtering logic
│   │   ├── analyticsService.ts    # Statistics
│   │   └── chartDataService.ts    # Chart data transforms
│   ├── models/            # Data models & types
│   │   ├── Expense.ts
│   │   ├── Category.ts
│   │   └── PaymentMethod.ts
│   ├── utils/             # Utility functions
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Main views
│   └── App.tsx            # Root component
├── tests/                 # Test files
│   ├── unit/              # Service & util tests
│   ├── integration/       # Component tests
│   └── e2e/               # End-to-end tests
├── specs/                 # Design documentation
│   └── main/
│       ├── spec.md        # Feature specification
│       ├── plan.md        # Implementation plan
│       ├── data-model.md  # Data structures
│       ├── research.md    # Technical decisions
│       └── contracts/     # Service interfaces
└── public/                # Static assets
```

---

## Key Concepts

### 1. Data Flow

```
User Action (UI)
    ↓
Component Event Handler
    ↓
Service Method (business logic)
    ↓
Storage Service (persistence)
    ↓
State Update (React Context)
    ↓
UI Re-render
```

### 2. Services (Business Logic Layer)

All business logic lives in `/src/services/`. Services are framework-agnostic TypeScript classes.

**Example: Creating an Expense**

```typescript
import { expenseService } from '@/services/expenseService'
import { Category, PaymentMethod } from '@/models'

const newExpense = expenseService.createExpense({
  amount: 42.50,
  date: new Date().toISOString(),
  category: Category.FOOD_DINING,
  paymentMethod: PaymentMethod.CREDIT_CARD,
  description: 'Lunch at cafe',
  merchant: 'Cafe Mocha'
})
```

### 3. Components (UI Layer)

React functional components with hooks. No business logic in components—use services instead.

**Example: ExpenseForm Component**

```typescript
import { useExpenses } from '@/hooks/useExpenses'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function ExpenseForm() {
  const { createExpense } = useExpenses()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(CreateExpenseSchema)
  })

  const onSubmit = (data) => {
    createExpense(data)
    // Show success message, clear form, etc.
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

### 4. State Management

Global state managed with React Context API + useReducer.

**ExpenseContext**: Manages expenses CRUD
**FilterContext**: Manages filter state

```typescript
import { useExpenses } from '@/hooks/useExpenses'

function MyComponent() {
  const { expenses, createExpense, deleteExpense } = useExpenses()
  // ...
}
```

---

## Common Tasks

### Task 1: Add a New Expense Category

1. **Update enum** in `src/models/Category.ts`:
   ```typescript
   enum Category {
     // ... existing categories
     PETS = 'PETS', // New category
   }
   ```

2. **Add label and color**:
   ```typescript
   const CategoryLabels: Record<Category, string> = {
     // ...
     [Category.PETS]: 'Pet Care',
   }

   const CategoryColors: Record<Category, string> = {
     // ...
     [Category.PETS]: '#FF6B9D',
   }
   ```

3. **Test**: Run tests to ensure no breakage
   ```bash
   npm test
   ```

### Task 2: Add a New Chart

1. **Create component** in `src/components/Charts/MyNewChart/`:
   ```typescript
   // MyNewChart.tsx
   import { useExpenses } from '@/hooks/useExpenses'
   import { chartDataService } from '@/services/chartDataService'
   import { LineChart, Line, XAxis, YAxis } from 'recharts'

   export function MyNewChart() {
     const { expenses } = useExpenses()
     const data = chartDataService.toLineChartData(expenses, 'daily', false)

     return (
       <LineChart data={data}>
         <Line dataKey="amount" />
         <XAxis dataKey="date" />
         <YAxis />
       </LineChart>
     )
   }
   ```

2. **Add to Dashboard** in `src/pages/Dashboard.tsx`:
   ```typescript
   import { MyNewChart } from '@/components/Charts/MyNewChart'

   export function Dashboard() {
     return (
       <div>
         {/* Existing charts */}
         <MyNewChart />
       </div>
     )
   }
   ```

### Task 3: Add a New Filter Option

1. **Update ExpenseFilter type** in `src/models/ExpenseFilter.ts`:
   ```typescript
   interface ExpenseFilter {
     // ... existing fields
     tags: string[] // New filter field
   }
   ```

2. **Update FilterService** in `src/services/filterService.ts`:
   ```typescript
   filterExpenses(expenses, filter) {
     return expenses.filter(expense => {
       // ... existing filters
       if (filter.tags.length > 0 && !filter.tags.some(tag => expense.tags?.includes(tag))) {
         return false
       }
       return true
     })
   }
   ```

3. **Add UI control** in `src/components/FilterPanel/FilterPanel.tsx`

### Task 4: Write a Unit Test

1. **Create test file** in `tests/unit/services/expenseService.test.ts`:
   ```typescript
   import { describe, it, expect, beforeEach } from 'vitest'
   import { ExpenseServiceImpl } from '@/services/expenseService'
   import { MockStorageService } from '@/tests/mocks/storageService'

   describe('ExpenseService', () => {
     let service: ExpenseServiceImpl

     beforeEach(() => {
       const storage = new MockStorageService()
       service = new ExpenseServiceImpl(storage)
     })

     it('should create expense with generated id', () => {
       const input = {
         amount: 42.50,
         date: new Date().toISOString(),
         category: Category.FOOD_DINING,
         paymentMethod: PaymentMethod.CREDIT_CARD
       }
       const expense = service.createExpense(input)
       expect(expense.id).toBeDefined()
       expect(expense.amount).toBe(42.50)
     })
   })
   ```

2. **Run test**:
   ```bash
   npm test expenseService.test.ts
   ```

---

## Development Workflow

### 1. Feature Development

```bash
# 1. Create feature branch
git checkout -b feature/my-new-feature

# 2. Make changes, commit often
git add .
git commit -m "Add new feature"

# 3. Run tests & linter
npm test
npm run lint

# 4. Push and create PR
git push origin feature/my-new-feature
```

### 2. Code Review Checklist

Before submitting PR, verify:
- [ ] Code follows TypeScript conventions
- [ ] Unit tests written for new logic
- [ ] Components tested with React Testing Library
- [ ] No console errors or warnings
- [ ] Accessibility: keyboard nav works, ARIA labels present
- [ ] Error messages are clear and actionable
- [ ] Code is readable (clear names, focused functions)

### 3. Testing Strategy

- **Unit tests**: Test services in isolation (Vitest)
- **Integration tests**: Test components with services (React Testing Library)
- **E2E tests**: Test user flows (Playwright)

```bash
# Run all tests
npm test

# Run specific test file
npm test expenseService.test.ts

# Run tests in watch mode
npm test -- --watch

# Run E2E tests
npm run test:e2e
```

---

## Debugging Tips

### Problem: Changes not appearing in browser

**Solution**: Check if dev server is running. Vite should auto-reload on file changes.

```bash
npm run dev
```

### Problem: TypeScript errors in editor

**Solution**: Ensure TypeScript extension is installed. Restart VS Code.

```bash
# Check TypeScript version
npx tsc --version
```

### Problem: localStorage quota exceeded

**Solution**: Open DevTools > Application > Storage > Clear site data

### Problem: Tests failing after changes

**Solution**: Check if mocks need updating. Ensure test data is valid.

```bash
# Run tests with verbose output
npm test -- --reporter=verbose
```

---

## Configuration Files

### vite.config.ts
Build tool configuration. Defines path aliases, plugins, dev server settings.

```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

### tsconfig.json
TypeScript compiler settings. Strict mode enabled for type safety.

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext"
  }
}
```

### tailwind.config.js
Tailwind CSS configuration. Custom colors, fonts, breakpoints.

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        // ...
      }
    }
  }
}
```

---

## Useful Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm test                 # Run unit & integration tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Generate coverage report

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking

# Utilities
npm run clean            # Remove build artifacts
npm run analyze          # Bundle size analysis
```

---

## Architecture Principles

### 1. Separation of Concerns
- **UI Components**: Presentation only, no business logic
- **Services**: Business logic, framework-agnostic
- **Models**: Data structures, validation schemas

### 2. Testability
- Pure functions for calculations
- Mockable storage layer
- Isolated services

### 3. Type Safety
- TypeScript strict mode
- Zod runtime validation
- No `any` types

### 4. Accessibility
- Semantic HTML
- Keyboard navigation
- ARIA labels
- Sufficient color contrast

### 5. Performance
- Code splitting (React.lazy)
- Memoization for expensive calculations
- Debounced inputs
- Virtual scrolling (if needed)

---

## Resources

### Documentation
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Recharts Documentation](https://recharts.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### Design Documentation
- [Feature Specification](spec.md)
- [Implementation Plan](plan.md)
- [Data Model](data-model.md)
- [Research & Technical Decisions](research.md)
- [API Contracts](contracts/)

### Project Constitution
- [Constitution](../../.specify/memory/constitution.md) - Core principles and standards

---

## Getting Help

### Questions?
- Check existing documentation in `/specs/main/`
- Review similar components or services for patterns
- Ask in team chat or create a GitHub issue

### Found a Bug?
1. Check if it's a known issue
2. Create minimal reproduction steps
3. File an issue with details

### Have an Idea?
1. Check if it aligns with [spec.md](spec.md)
2. Discuss with team before implementing
3. Update design docs if needed

---

## Next Steps

Now that you're set up:

1. ✅ Run the app locally
2. ✅ Explore the codebase structure
3. ✅ Read the [Feature Specification](spec.md)
4. ✅ Review the [Data Model](data-model.md)
5. ✅ Try adding a new expense
6. ✅ Make a small change (e.g., add a category)
7. ✅ Write a test for your change
8. ✅ Create your first PR!

**Welcome to the team!** 🎉
