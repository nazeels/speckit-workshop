# Data Model

**Feature**: Expense Tracker Application
**Date**: 2025-11-12
**Status**: Completed

## Overview

This document defines the core data entities, their fields, relationships, validation rules, and state transitions for the Expense Tracker application.

---

## Entity: Expense

The primary entity representing a single financial transaction.

### Fields

| Field | Type | Required | Validation | Default | Description |
|-------|------|----------|------------|---------|-------------|
| `id` | `string` | Yes | UUID v4 | Auto-generated | Unique identifier for the expense |
| `amount` | `number` | Yes | Positive, max 2 decimals | - | Transaction amount in user's currency |
| `date` | `Date` (ISO 8601 string) | Yes | Valid date, not future | Current date/time | Date of the transaction |
| `category` | `Category` (enum) | Yes | One of predefined categories | - | Expense category |
| `paymentMethod` | `PaymentMethod` (enum) | Yes | One of predefined methods | - | Payment method used |
| `description` | `string` | No | Max 200 characters | Empty string | Optional notes about the expense |
| `merchant` | `string` | No | Max 100 characters | Empty string | Vendor or merchant name |
| `createdAt` | `Date` (ISO 8601 string) | Yes | Valid date | Auto-generated | Timestamp when record was created |
| `updatedAt` | `Date` (ISO 8601 string) | Yes | Valid date | Auto-generated | Timestamp when record was last updated |

### TypeScript Interface

```typescript
interface Expense {
  id: string
  amount: number
  date: string // ISO 8601 format (e.g., "2025-11-12T14:30:00.000Z")
  category: Category
  paymentMethod: PaymentMethod
  description: string
  merchant: string
  createdAt: string // ISO 8601 format
  updatedAt: string // ISO 8601 format
}
```

### Zod Validation Schema

```typescript
import { z } from 'zod'

const ExpenseSchema = z.object({
  id: z.string().uuid(),
  amount: z.number()
    .positive('Amount must be positive')
    .max(999999.99, 'Amount too large')
    .refine(val => Number.isFinite(val), 'Amount must be a valid number')
    .refine(val => (val * 100) % 1 === 0, 'Amount can have at most 2 decimal places'),
  date: z.string()
    .datetime('Invalid date format')
    .refine(
      val => new Date(val) <= new Date(),
      'Date cannot be in the future'
    ),
  category: z.nativeEnum(Category, {
    errorMap: () => ({ message: 'Invalid category' })
  }),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    errorMap: () => ({ message: 'Invalid payment method' })
  }),
  description: z.string()
    .max(200, 'Description must be 200 characters or less')
    .default(''),
  merchant: z.string()
    .max(100, 'Merchant name must be 100 characters or less')
    .default(''),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

// For creating new expenses (without generated fields)
const CreateExpenseSchema = ExpenseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

// For updating expenses (all fields optional except id)
const UpdateExpenseSchema = ExpenseSchema.partial().required({ id: true })
```

### Example

```json
{
  "id": "a1b2c3d4-e5f6-7890-ab12-cd34ef567890",
  "amount": 42.50,
  "date": "2025-11-12T14:30:00.000Z",
  "category": "FOOD_DINING",
  "paymentMethod": "CREDIT_CARD",
  "description": "Lunch at downtown cafe",
  "merchant": "Cafe Mocha",
  "createdAt": "2025-11-12T14:35:12.456Z",
  "updatedAt": "2025-11-12T14:35:12.456Z"
}
```

---

## Enum: Category

Predefined expense categories for classification.

### TypeScript Definition

```typescript
enum Category {
  FOOD_DINING = 'FOOD_DINING',
  TRANSPORTATION = 'TRANSPORTATION',
  ENTERTAINMENT = 'ENTERTAINMENT',
  BILLS_UTILITIES = 'BILLS_UTILITIES',
  SHOPPING = 'SHOPPING',
  HEALTHCARE = 'HEALTHCARE',
  EDUCATION = 'EDUCATION',
  TRAVEL = 'TRAVEL',
  PERSONAL_CARE = 'PERSONAL_CARE',
  OTHER = 'OTHER'
}

// Human-readable labels
const CategoryLabels: Record<Category, string> = {
  [Category.FOOD_DINING]: 'Food & Dining',
  [Category.TRANSPORTATION]: 'Transportation',
  [Category.ENTERTAINMENT]: 'Entertainment',
  [Category.BILLS_UTILITIES]: 'Bills & Utilities',
  [Category.SHOPPING]: 'Shopping',
  [Category.HEALTHCARE]: 'Healthcare',
  [Category.EDUCATION]: 'Education',
  [Category.TRAVEL]: 'Travel',
  [Category.PERSONAL_CARE]: 'Personal Care',
  [Category.OTHER]: 'Other'
}

// Icon associations (for UI)
const CategoryIcons: Record<Category, string> = {
  [Category.FOOD_DINING]: '🍔',
  [Category.TRANSPORTATION]: '🚗',
  [Category.ENTERTAINMENT]: '🎬',
  [Category.BILLS_UTILITIES]: '💡',
  [Category.SHOPPING]: '🛍️',
  [Category.HEALTHCARE]: '🏥',
  [Category.EDUCATION]: '📚',
  [Category.TRAVEL]: '✈️',
  [Category.PERSONAL_CARE]: '💅',
  [Category.OTHER]: '📦'
}

// Color associations (for charts)
const CategoryColors: Record<Category, string> = {
  [Category.FOOD_DINING]: '#FF6384',
  [Category.TRANSPORTATION]: '#36A2EB',
  [Category.ENTERTAINMENT]: '#FFCE56',
  [Category.BILLS_UTILITIES]: '#4BC0C0',
  [Category.SHOPPING]: '#9966FF',
  [Category.HEALTHCARE]: '#FF9F40',
  [Category.EDUCATION]: '#FF6384',
  [Category.TRAVEL]: '#C9CBCF',
  [Category.PERSONAL_CARE]: '#4BC0C0',
  [Category.OTHER]: '#9966FF'
}
```

---

## Enum: PaymentMethod

Payment methods used for transactions.

### TypeScript Definition

```typescript
enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
  BANK_TRANSFER = 'BANK_TRANSFER',
  OTHER = 'OTHER'
}

// Human-readable labels
const PaymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Cash',
  [PaymentMethod.CREDIT_CARD]: 'Credit Card',
  [PaymentMethod.DEBIT_CARD]: 'Debit Card',
  [PaymentMethod.DIGITAL_WALLET]: 'Digital Wallet',
  [PaymentMethod.BANK_TRANSFER]: 'Bank Transfer',
  [PaymentMethod.OTHER]: 'Other'
}

// Icon associations
const PaymentMethodIcons: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: '💵',
  [PaymentMethod.CREDIT_CARD]: '💳',
  [PaymentMethod.DEBIT_CARD]: '💳',
  [PaymentMethod.DIGITAL_WALLET]: '📱',
  [PaymentMethod.BANK_TRANSFER]: '🏦',
  [PaymentMethod.OTHER]: '💰'
}
```

---

## Entity: ExpenseFilter

Represents user-selected filter criteria for viewing expenses.

### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `dateRange` | `DateRange` | No | null | Filter by date range |
| `categories` | `Category[]` | No | [] | Filter by categories (empty = all) |
| `amountRange` | `AmountRange` | No | null | Filter by amount range |
| `paymentMethods` | `PaymentMethod[]` | No | [] | Filter by payment methods (empty = all) |
| `searchQuery` | `string` | No | '' | Filter by text search (description/merchant) |

### TypeScript Interface

```typescript
interface DateRange {
  start: Date | null
  end: Date | null
}

interface AmountRange {
  min: number | null
  max: number | null
}

interface ExpenseFilter {
  dateRange: DateRange
  categories: Category[]
  amountRange: AmountRange
  paymentMethods: PaymentMethod[]
  searchQuery: string
}

// Initial/empty filter state
const initialFilter: ExpenseFilter = {
  dateRange: { start: null, end: null },
  categories: [],
  amountRange: { min: null, max: null },
  paymentMethods: [],
  searchQuery: ''
}
```

### Filter Logic

```typescript
function filterExpenses(expenses: Expense[], filter: ExpenseFilter): Expense[] {
  return expenses.filter(expense => {
    // Date range filter
    if (filter.dateRange.start || filter.dateRange.end) {
      const expenseDate = new Date(expense.date)
      if (filter.dateRange.start && expenseDate < filter.dateRange.start) return false
      if (filter.dateRange.end && expenseDate > filter.dateRange.end) return false
    }

    // Category filter
    if (filter.categories.length > 0 && !filter.categories.includes(expense.category)) {
      return false
    }

    // Amount range filter
    if (filter.amountRange.min !== null && expense.amount < filter.amountRange.min) {
      return false
    }
    if (filter.amountRange.max !== null && expense.amount > filter.amountRange.max) {
      return false
    }

    // Payment method filter
    if (filter.paymentMethods.length > 0 && !filter.paymentMethods.includes(expense.paymentMethod)) {
      return false
    }

    // Search query filter (case-insensitive)
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase()
      const matchesDescription = expense.description.toLowerCase().includes(query)
      const matchesMerchant = expense.merchant.toLowerCase().includes(query)
      if (!matchesDescription && !matchesMerchant) return false
    }

    return true
  })
}
```

---

## Entity: SummaryStats

Aggregated statistics calculated from filtered expenses.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `totalSpending` | `number` | Sum of all expense amounts |
| `averageAmount` | `number` | Mean expense amount |
| `transactionCount` | `number` | Total number of expenses |
| `highestExpense` | `Expense \| null` | Expense with largest amount |
| `mostUsedCategory` | `Category \| null` | Category with most transactions |
| `mostUsedPaymentMethod` | `PaymentMethod \| null` | Payment method with most transactions |
| `spendingByCategory` | `CategoryBreakdown[]` | Per-category totals |
| `spendingByPaymentMethod` | `PaymentMethodBreakdown[]` | Per-payment-method totals |

### TypeScript Interface

```typescript
interface SummaryStats {
  totalSpending: number
  averageAmount: number
  transactionCount: number
  highestExpense: Expense | null
  mostUsedCategory: Category | null
  mostUsedPaymentMethod: PaymentMethod | null
  spendingByCategory: CategoryBreakdown[]
  spendingByPaymentMethod: PaymentMethodBreakdown[]
}

interface CategoryBreakdown {
  category: Category
  total: number
  count: number
  percentage: number // Percentage of total spending
}

interface PaymentMethodBreakdown {
  paymentMethod: PaymentMethod
  total: number
  count: number
  percentage: number
}
```

---

## Entity: ChartData

Data structures for chart visualizations.

### Pie Chart Data (Category Breakdown)

```typescript
interface PieChartDataPoint {
  name: string // Category label
  value: number // Total spending
  color: string // Category color
}
```

### Bar Chart Data (Spending Over Time)

```typescript
interface BarChartDataPoint {
  date: string // Formatted date (e.g., "Nov 12", "Week 45")
  amount: number // Total spending for period
}

enum TimeGranularity {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY'
}
```

### Line Chart Data (Spending Trend)

```typescript
interface LineChartDataPoint {
  date: string // Formatted date
  amount: number // Cumulative spending
}
```

---

## Storage Schema

### localStorage Structure

```typescript
interface AppStorage {
  expenses: Expense[] // Array of expense records
  version: number // Schema version (for future migrations)
  lastUpdated: string // ISO timestamp
}

// localStorage key
const STORAGE_KEY = 'expense-tracker-data'

// Current schema version
const SCHEMA_VERSION = 1
```

### Example localStorage Entry

```json
{
  "expenses": [
    {
      "id": "a1b2c3d4-e5f6-7890-ab12-cd34ef567890",
      "amount": 42.50,
      "date": "2025-11-12T14:30:00.000Z",
      "category": "FOOD_DINING",
      "paymentMethod": "CREDIT_CARD",
      "description": "Lunch at downtown cafe",
      "merchant": "Cafe Mocha",
      "createdAt": "2025-11-12T14:35:12.456Z",
      "updatedAt": "2025-11-12T14:35:12.456Z"
    }
  ],
  "version": 1,
  "lastUpdated": "2025-11-12T14:35:12.456Z"
}
```

---

## State Transitions

### Expense Lifecycle

```
┌─────────────┐
│   CREATED   │  ← User creates new expense
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   STORED    │  ← Saved to localStorage
└──────┬──────┘
       │
       ├─────► UPDATED ─────┐  ← User edits expense
       │                    │
       └─────► DELETED      │  ← User deletes expense
                            │
                            ▼
                      ┌──────────┐
                      │ ARCHIVED │  ← Removed from storage
                      └──────────┘
```

### Filter State Transitions

```
┌─────────────┐
│   EMPTY     │  ← Initial state (no filters)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   ACTIVE    │  ← User applies filters
└──────┬──────┘
       │
       ├─────► MODIFIED ────┐  ← User changes filter criteria
       │                    │
       └─────► CLEARED      │  ← User resets filters
                            │
                            ▼
                      ┌──────────┐
                      │  EMPTY   │  ← Back to initial state
                      └──────────┘
```

---

## Relationships

This is a single-entity application with no complex relationships. The primary entity is `Expense`, which:
- Contains enum references (`Category`, `PaymentMethod`)
- Is aggregated into `SummaryStats` for analytics
- Is filtered by `ExpenseFilter` criteria
- Is transformed into `ChartData` for visualizations

No foreign keys or entity relationships are required.

---

## Data Validation Rules Summary

### Expense Creation
1. All required fields must be present
2. Amount must be positive and have at most 2 decimal places
3. Date must be valid and not in the future
4. Category must be valid enum value
5. PaymentMethod must be valid enum value
6. Description must be ≤200 characters
7. Merchant must be ≤100 characters
8. ID, createdAt, updatedAt are auto-generated

### Expense Update
1. ID must match existing expense
2. All other validations same as creation
3. updatedAt is automatically updated

### Expense Deletion
1. ID must match existing expense
2. Soft delete not required (hard delete from localStorage)

---

## Migration Strategy

For future schema changes:

1. **Version Check**: Check `version` field in localStorage
2. **Migration Function**: Apply transformations based on version
3. **Validation**: Validate migrated data with current schema
4. **Update Version**: Set version to current `SCHEMA_VERSION`

Example migration (v1 → v2):
```typescript
function migrateV1toV2(data: any): AppStorage {
  return {
    ...data,
    expenses: data.expenses.map((expense: any) => ({
      ...expense,
      // Add new field with default value
      tags: []
    })),
    version: 2
  }
}
```

---

## Next Steps

Proceed to:
1. Generate API contracts (service interfaces)
2. Generate quickstart.md (developer guide)
3. Update agent context with technology decisions
