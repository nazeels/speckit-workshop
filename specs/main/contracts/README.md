# API Contracts

This directory contains TypeScript interface definitions for all service layers in the Expense Tracker application.

## Overview

These contracts define the public APIs for each service, ensuring type safety and clear boundaries between layers. All implementations MUST adhere to these interfaces.

## Service Contracts

### 1. [storage-service.ts](./storage-service.ts)
**Purpose**: localStorage abstraction layer

**Key Methods**:
- `getItem<T>()` - Retrieve typed data
- `setItem<T>()` - Store data with quota checking
- `getStorageUsage()` - Monitor storage capacity
- `isAvailable()` - Check localStorage availability

**Error Handling**: Throws `StorageError` for unavailable storage, quota exceeded, or parse errors

---

### 2. [expense-service.ts](./expense-service.ts)
**Purpose**: CRUD operations for expenses

**Key Methods**:
- `createExpense()` - Create new expense with validation
- `updateExpense()` - Update existing expense
- `deleteExpense()` - Delete single expense
- `getAllExpenses()` - Retrieve all expenses
- `exportExpenses()` / `importExpenses()` - Data portability

**Error Handling**: Throws `ValidationError` for invalid input, `NotFoundError` for missing expenses

---

### 3. [filter-service.ts](./filter-service.ts)
**Purpose**: Filtering and searching expenses

**Key Methods**:
- `filterExpenses()` - Apply multiple filter criteria
- `filterByDateRange()` - Date range filtering
- `filterByCategories()` - Category filtering
- `filterByAmountRange()` - Amount range filtering
- `searchExpenses()` - Text search
- `sortExpenses()` - Sort by various fields

**Error Handling**: Pure functions, no exceptions thrown

---

### 4. [analytics-service.ts](./analytics-service.ts)
**Purpose**: Statistical analysis and aggregations

**Key Methods**:
- `calculateSummaryStats()` - Comprehensive statistics
- `calculateSpendingByCategory()` - Category breakdown
- `calculateSpendingTrend()` - Time-based trends
- `compareSpendingPeriods()` - Period-to-period comparison
- `getTopMerchants()` - Merchant spending analysis

**Error Handling**: Pure functions, returns null/empty arrays for edge cases

---

### 5. [chart-data-service.ts](./chart-data-service.ts)
**Purpose**: Transform data for chart libraries (Recharts)

**Key Methods**:
- `toPieChartData()` - Category pie chart data
- `toBarChartData()` - Time-series bar chart data
- `toLineChartData()` - Trend line chart data
- `toCategoryComparisonData()` - Comparison charts
- `groupExpensesByPeriod()` - Time-based grouping

**Error Handling**: Pure functions, returns empty arrays for no data

---

## Architecture Layers

```
┌─────────────────────────────────────────┐
│         UI Components (React)           │
│  ExpenseForm, ExpenseList, Charts, etc. │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│          Service Layer                  │
│  ┌─────────────────────────────────┐   │
│  │ ExpenseService (CRUD)           │   │
│  ├─────────────────────────────────┤   │
│  │ FilterService (Filtering)       │   │
│  ├─────────────────────────────────┤   │
│  │ AnalyticsService (Stats)        │   │
│  ├─────────────────────────────────┤   │
│  │ ChartDataService (Transforms)   │   │
│  └─────────────────────────────────┘   │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│       StorageService                    │
│       (localStorage wrapper)            │
└─────────────────────────────────────────┘
```

## Dependency Flow

```
UI Components
    ↓
ExpenseService ───→ StorageService
    ↓
FilterService
    ↓
AnalyticsService
    ↓
ChartDataService
```

**Key Principle**: Services do not depend on each other (except ExpenseService → StorageService). UI components orchestrate service calls.

---

## Testing Strategy

### Unit Tests
- Test each service in isolation
- Mock StorageService for ExpenseService tests
- Test edge cases (empty arrays, null values, invalid inputs)

### Example Test Structure

```typescript
describe('ExpenseService', () => {
  let storageService: MockStorageService
  let expenseService: ExpenseService

  beforeEach(() => {
    storageService = new MockStorageService()
    expenseService = new ExpenseServiceImpl(storageService)
  })

  it('should create expense with generated id', () => {
    const input = {
      amount: 42.50,
      date: new Date().toISOString(),
      category: Category.FOOD_DINING,
      paymentMethod: PaymentMethod.CREDIT_CARD
    }
    const expense = expenseService.createExpense(input)
    expect(expense.id).toBeDefined()
    expect(expense.amount).toBe(42.50)
  })

  it('should throw ValidationError for negative amount', () => {
    const input = { ...validInput, amount: -10 }
    expect(() => expenseService.createExpense(input)).toThrow(ValidationError)
  })
})
```

---

## Implementation Guidelines

### 1. Pure Functions
- Services SHOULD use pure functions where possible (FilterService, AnalyticsService, ChartDataService)
- Pure functions are easier to test and reason about

### 2. Error Handling
- Validation errors MUST be caught at service boundaries
- Use custom error classes for specific error types
- Services MUST NOT throw generic Error objects

### 3. Type Safety
- All service methods MUST use TypeScript types
- Avoid `any` type - use generics or specific types
- Input/output types MUST be defined in contracts

### 4. Immutability
- Services MUST NOT mutate input parameters
- Array operations MUST return new arrays
- Use spread operator or Array.map/filter/reduce

### 5. Performance
- Avoid unnecessary loops or computations
- Use memoization for expensive calculations (via React useMemo in components)
- Filter/sort operations should be O(n) or O(n log n)

---

## Example Service Implementation

```typescript
import { StorageService, StorageError } from '../contracts/storage-service'

export class LocalStorageService implements StorageService {
  private readonly STORAGE_KEY = 'expense-tracker-data'
  private readonly QUOTA_ESTIMATE = 5 * 1024 * 1024 // 5MB

  isAvailable(): boolean {
    try {
      const test = '__test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      throw new StorageError('Failed to parse stored data', 'PARSE_ERROR')
    }
  }

  setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      throw new StorageError('localStorage is not available', 'UNAVAILABLE')
    }

    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
      return true
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        return false // Quota exceeded
      }
      throw error
    }
  }

  getStorageUsage(): StorageUsage {
    let used = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length
      }
    }

    return {
      used,
      available: this.QUOTA_ESTIMATE,
      percentage: (used / this.QUOTA_ESTIMATE) * 100
    }
  }

  isNearQuota(threshold: number = 80): boolean {
    const usage = this.getStorageUsage()
    return usage.percentage >= threshold
  }

  removeItem(key: string): void {
    localStorage.removeItem(key)
  }

  clear(): void {
    localStorage.clear()
  }
}
```

---

## Contract Versioning

These contracts are versioned along with the data model. Breaking changes require:
1. Version bump in [data-model.md](../data-model.md)
2. Migration strategy documentation
3. Backward compatibility layer (if needed)

**Current Version**: 1.0.0

---

## Next Steps

After contract definition:
1. Implement services following these contracts
2. Write unit tests for each service
3. Create mock implementations for testing UI components
4. Document any deviations or extensions in implementation
