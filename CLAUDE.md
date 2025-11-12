# expense-tracker-4 Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-12

## Active Technologies

- **Language**: TypeScript (strict mode)
- **Framework**: React 18+ with functional components and hooks
- **Build Tool**: Vite
- **Charting**: Recharts
- **Styling**: Tailwind CSS + CSS Modules
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context API + useReducer
- **Storage**: Browser localStorage (offline-first)
- **Testing**: Vitest (unit/integration) + Playwright (E2E)
- **Date Utilities**: date-fns

## Project Structure

```text
src/
├── components/      # UI components (ExpenseForm, ExpenseList, Charts, etc.)
├── services/        # Business logic (expenseService, filterService, etc.)
├── models/          # Data models & types (Expense, Category, PaymentMethod)
├── utils/           # Utility functions (dateUtils, validators, etc.)
├── hooks/           # Custom React hooks (useExpenses, useFilters, etc.)
├── pages/           # Main views (Dashboard, ExpenseListPage, etc.)
└── styles/          # Styling (theme, global CSS)

tests/
├── unit/            # Service & util tests
├── integration/     # Component tests
└── e2e/             # End-to-end tests

specs/main/          # Design documentation
├── spec.md          # Feature specification
├── plan.md          # Implementation plan
├── data-model.md    # Data structures
├── research.md      # Technical decisions
└── contracts/       # Service interfaces
```

## Commands

```bash
npm run dev          # Start dev server
npm test             # Run unit & integration tests
npm run test:e2e     # Run E2E tests
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking
npm run build        # Production build
```

## Code Style

**TypeScript**:
- Use strict mode
- Prefer interfaces over types for object shapes
- Use enums for fixed sets of values (Category, PaymentMethod)
- Avoid `any` type - use generics or specific types
- Define validation schemas with Zod

**React**:
- Functional components only (no class components)
- Custom hooks for reusable logic
- Keep components focused on presentation
- Business logic belongs in services, not components

**Services**:
- Pure functions where possible
- No framework dependencies
- Throw custom error classes (ValidationError, NotFoundError, StorageError)
- Return types must be explicitly defined

**Testing**:
- Unit tests for services and utils
- Integration tests for components
- E2E tests for critical user flows
- Aim for 80%+ coverage on services

## Architecture Principles

1. **Separation of Concerns**: UI components, services, models are clearly separated
2. **Type Safety**: TypeScript strict mode, Zod runtime validation
3. **Testability**: Pure functions, mockable storage, isolated services
4. **Accessibility**: Semantic HTML, keyboard nav, ARIA labels, WCAG AA contrast
5. **Performance**: Measure first, optimize only when needed

## Recent Changes

- main: Initialized expense tracker with TypeScript + React + Vite stack
- Added comprehensive design documentation (spec, plan, data-model, research, contracts)
- Defined service contracts for storage, expense CRUD, filtering, analytics, and charts

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
