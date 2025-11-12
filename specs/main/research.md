# Research & Technical Decisions

**Feature**: Expense Tracker Application
**Date**: 2025-11-12
**Status**: Completed

## Overview

This document consolidates research findings and technical decisions made during the planning phase. Each decision addresses a "NEEDS CLARIFICATION" item from the Technical Context or evaluates technology choices for the expense tracker application.

---

## 1. Language Choice: JavaScript vs TypeScript

### Decision
**TypeScript** with strict mode enabled

### Rationale
- **Type Safety**: Prevents common errors with expense amounts, dates, and category/payment method enums
- **Better IDE Support**: IntelliSense autocomplete for models and service methods improves developer experience
- **Maintainability**: Self-documenting interfaces for Expense, Filter, and ChartData models
- **Refactoring Safety**: Renaming or restructuring is safer with compile-time checks
- **Constitutional Alignment**: Supports "Explicitness" principle (II) - types make contracts explicit

### Alternatives Considered
- **JavaScript (ES6+)**: Simpler setup, faster for prototyping, but loses type safety benefits. For a data-heavy application with financial calculations, type safety is critical.
- **JavaScript + JSDoc**: Middle ground, but tooling support is weaker than TypeScript

### Implementation Notes
- Use `strict: true` in tsconfig.json
- Define interfaces for: Expense, ExpenseFilter, ChartDataPoint, SummaryStats
- Use enums for Category and PaymentMethod to prevent invalid values

---

## 2. UI Framework: React vs Vue vs Vanilla JS

### Decision
**React 18+** with functional components and hooks

### Rationale
- **Ecosystem**: Largest component library ecosystem (Material-UI, Ant Design, Chakra UI)
- **Charting Libraries**: Excellent integration with Recharts, Victory, or Chart.js via react-chartjs-2
- **Testing**: Mature testing ecosystem (React Testing Library, Jest)
- **State Management**: Built-in hooks (useState, useReducer, useContext) sufficient for this scope
- **Developer Experience**: Hooks enable clean, testable logic separation
- **Constitutional Alignment**: Component model supports "Readability" (I) and "Small Abstractions" (III)

### Alternatives Considered
- **Vue 3**: Excellent DX, but smaller ecosystem. React's larger community means more charting examples.
- **Vanilla JS**: Maximum control, minimal dependencies, but requires more boilerplate for state management and component composition. Not aligned with "Delight Through Frictionless UX" (VIII) for developers.
- **Svelte**: Excellent performance, but smaller ecosystem and less mature testing tools.

### Implementation Notes
- Use Vite for fast dev server and build
- Create custom hooks: `useExpenses`, `useFilters`, `useLocalStorage`
- Use Context API for global state (expenses, filters) to avoid prop drilling

---

## 3. Charting Library

### Decision
**Recharts** (React-specific charting library)

### Rationale
- **React Integration**: Built specifically for React, uses components (declarative)
- **Responsiveness**: Built-in responsive container, adapts to screen sizes
- **Customization**: Easy to customize colors, tooltips, labels
- **Bundle Size**: Reasonable (~90KB gzipped) - smaller than D3.js
- **Accessibility**: Better default accessibility than Chart.js
- **Constitutional Alignment**: Declarative API supports "Readability" (I), responsive by default supports "Accessibility" (VII)

### Alternatives Considered
- **Chart.js + react-chartjs-2**: More mature, but imperative API feels less React-like. Good fallback option.
- **D3.js**: Maximum flexibility, but steep learning curve and larger bundle. Overkill for standard charts.
- **Victory**: Similar to Recharts, but Recharts has better documentation and examples.

### Implementation Notes
- Use ResponsiveContainer for all charts
- Implement custom tooltips with formatted currency and dates
- Use consistent color palette defined in theme.js
- Ensure charts have ARIA labels for screen readers

---

## 4. Testing Framework

### Decision
**Vitest** for unit/integration tests, **Playwright** for E2E tests

### Rationale

#### Vitest
- **Vite Integration**: Native Vite integration, reuses same config
- **Jest Compatible**: Drop-in Jest replacement, same API (describe, it, expect)
- **Fast**: Faster than Jest due to Vite's native ESM support
- **Modern**: TypeScript support out of the box
- **Constitutional Alignment**: Fast tests support "Testability" (IV) principle

#### Playwright
- **Cross-Browser**: Tests on Chromium, Firefox, WebKit (Safari)
- **Modern API**: Async/await, auto-waiting for elements
- **Debugging**: Excellent debugging tools (trace viewer, inspector)
- **Speed**: Parallel test execution by default

### Alternatives Considered
- **Jest**: Industry standard, but slower than Vitest for Vite projects
- **Cypress**: Popular E2E tool, but Playwright has better cross-browser support and is faster
- **Testing Library**: Will still use React Testing Library within Vitest for component tests

### Implementation Notes
- **Unit tests**: Test services (expenseService, filterService, analyticsService) with Vitest
- **Integration tests**: Test components with React Testing Library + Vitest
- **E2E tests**: Test critical flows (add expense, filter, view charts) with Playwright
- Aim for 80%+ code coverage on services and utils

---

## 5. localStorage Best Practices

### Decision
Implement **localStorage wrapper service** with quota monitoring and error handling

### Rationale
- **Reliability**: localStorage can fail (quota exceeded, private browsing, disabled)
- **Performance**: Avoid repeated JSON.parse/stringify in components
- **Testability**: Mock storage layer in tests
- **Constitutional Alignment**: "Fail Loudly and Helpfully" (V) - detect quota issues early

### Key Features
1. **Quota Monitoring**: Calculate storage usage, warn at 80% capacity (typically ~5MB limit)
2. **Error Handling**: Graceful fallback if localStorage unavailable, clear error messages
3. **Data Migration**: Version storage schema for future changes
4. **Compression**: Consider LZ-string compression for large datasets (optional optimization)
5. **Backup/Export**: Allow users to export data as JSON for backup

### Implementation Pattern
```typescript
interface StorageService {
  getItem<T>(key: string): T | null
  setItem<T>(key: string, value: T): boolean
  removeItem(key: string): void
  getStorageUsage(): { used: number; available: number; percentage: number }
  isAvailable(): boolean
}
```

### Alternatives Considered
- **IndexedDB**: More capacity (50MB+), but overkill for this use case and requires async API
- **Direct localStorage use**: Simpler, but fails to handle edge cases gracefully

---

## 6. Styling Approach

### Decision
**CSS Modules + Tailwind CSS** (or **CSS-in-JS with Styled Components** as alternative)

### Rationale
- **Scoped Styles**: CSS Modules prevent style collisions, supports "Consistency" (IX)
- **Utility-First**: Tailwind speeds up UI development with consistent spacing/colors
- **Performance**: CSS Modules are zero-runtime (unlike styled-components)
- **Accessibility**: Tailwind has good accessibility defaults (focus rings, color contrast)
- **Constitutional Alignment**: Consistent design system supports "Consistency" (IX)

### Alternatives Considered
- **Plain CSS**: Simple, but risk of class name collisions
- **Styled Components**: Popular CSS-in-JS, but adds runtime cost. Good alternative if team prefers co-location.
- **Sass/SCSS**: Powerful, but CSS Modules + Tailwind cover most needs

### Implementation Notes
- Define color palette in tailwind.config.js (ensure WCAG AA contrast)
- Use CSS Modules for complex component styles
- Use Tailwind utilities for spacing, typography, responsive design
- Create reusable theme tokens (colors, spacing, typography) in theme.js

---

## 7. Date Handling

### Decision
**date-fns** library for date manipulation and formatting

### Rationale
- **Lightweight**: Tree-shakeable, only import what you need (~5-10KB per function)
- **Immutable**: Pure functions, no mutating dates (unlike moment.js)
- **TypeScript**: First-class TypeScript support
- **i18n Ready**: Supports localization out of the box
- **Constitutional Alignment**: Simple, focused functions support "Small Abstractions" (III)

### Alternatives Considered
- **Day.js**: Similar to moment.js API, lightweight (~2KB). Good alternative.
- **Luxon**: More features (timezone support), but larger. Overkill for this app.
- **Native Date API**: Free, but clunky API and lacks formatting/parsing utilities

### Implementation Notes
- Use `format()` for display formatting (e.g., "MMM dd, yyyy")
- Use `parseISO()` for parsing stored ISO strings
- Use `startOfDay()`, `endOfDay()` for date range filtering
- Use `isWithinInterval()` for date range checks

---

## 8. Form Handling & Validation

### Decision
**React Hook Form** for form state, **Zod** for validation schema

### Rationale
- **Performance**: React Hook Form minimizes re-renders, uses uncontrolled components
- **DX**: Simple API, minimal boilerplate
- **Validation**: Zod provides TypeScript-first schema validation
- **Type Safety**: Zod schemas generate TypeScript types automatically
- **Error Messages**: Easy to customize error messages per field
- **Constitutional Alignment**: Clear validation errors support "Fail Loudly and Helpfully" (V)

### Alternatives Considered
- **Formik**: Popular but slower (more re-renders) than React Hook Form
- **Manual state**: Simple for small forms, but reinventing the wheel for validation/errors
- **Yup**: Alternative to Zod, but Zod has better TypeScript integration

### Implementation Notes
- Define Zod schema for Expense model with custom error messages:
  - Amount: positive number, required
  - Date: valid date, not future, required
  - Category: enum validation, required
  - Payment method: enum validation, required
  - Description: optional string, max 200 chars
- Use `zodResolver` to integrate Zod with React Hook Form
- Display inline validation errors below each field

---

## 9. Responsive Design Strategy

### Decision
**Mobile-first responsive design** with breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)

### Rationale
- **Mobile Usage**: Many users track expenses on mobile devices
- **Progressive Enhancement**: Start simple, add complexity for larger screens
- **Constitutional Alignment**: "Accessibility" (VII) - works on all devices

### Key Responsive Patterns
1. **ExpenseForm**: Single column on mobile, two-column on tablet+
2. **ExpenseList**: Cards on mobile, table on desktop
3. **Charts**: Stack vertically on mobile, grid layout on desktop
4. **FilterPanel**: Collapsible drawer on mobile, persistent sidebar on desktop
5. **Navigation**: Bottom tab bar on mobile, top nav on desktop

### Implementation Notes
- Use Tailwind responsive prefixes (sm:, md:, lg:)
- Test on real devices, not just browser DevTools
- Use viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`

---

## 10. Performance Optimization Strategy

### Decision
**Measure first, optimize only if needed** - follow Constitutional principle VI

### Baseline Performance Targets (from spec)
- Expense list load: <2s for 1000 records
- Chart render: <1s
- Filter operations: <500ms

### Optimization Techniques (apply only if measurements show issues)
1. **Virtual Scrolling**: Use react-virtual for 1000+ expense list (only if measured slow)
2. **Memoization**: Use `useMemo` for expensive calculations (chart data transformations)
3. **Debouncing**: Debounce filter inputs (300ms delay) to reduce re-renders
4. **Lazy Loading**: Code-split chart components with React.lazy()
5. **Web Workers**: Move analytics calculations to worker (only if main thread blocked)

### Measurement Tools
- Chrome DevTools Performance tab
- React DevTools Profiler
- Lighthouse performance audit

### Implementation Notes
- Add performance markers for critical operations:
  ```typescript
  performance.mark('filter-start')
  // ... filter logic
  performance.mark('filter-end')
  performance.measure('filter', 'filter-start', 'filter-end')
  ```
- Log performance measures in development mode
- **Do not** implement virtual scrolling or Web Workers until measurements show need

---

## 11. Accessibility (A11y) Implementation

### Decision
Follow **WCAG 2.1 Level AA** standards

### Key Requirements
1. **Keyboard Navigation**: All interactive elements accessible via Tab, Enter, Space, Escape
2. **Screen Readers**: Semantic HTML, ARIA labels on custom components
3. **Color Contrast**: 4.5:1 for normal text, 3:1 for large text/UI components
4. **Focus Indicators**: Visible focus rings (use Tailwind's default or customize)
5. **Error Announcements**: Use ARIA live regions for validation errors

### Implementation Checklist
- [ ] ExpenseForm: Label all inputs, associate errors with fields via aria-describedby
- [ ] ExpenseList: Use semantic table or list markup, announce row count
- [ ] FilterPanel: Label all filter inputs, announce filter results count
- [ ] Charts: Provide text alternatives (data tables), use ARIA labels
- [ ] Buttons: Clear labels, use aria-label for icon-only buttons
- [ ] Modals/Dialogs: Trap focus, close on Escape, focus management

### Testing Tools
- Chrome DevTools Lighthouse (Accessibility audit)
- axe DevTools extension
- Screen reader testing (NVDA on Windows, VoiceOver on Mac)
- Keyboard-only navigation testing

---

## 12. Error Handling Strategy

### Decision
**Layered error handling** with user-friendly messages at UI level

### Error Categories
1. **Validation Errors**: Form inputs (handled by Zod + React Hook Form)
2. **Storage Errors**: localStorage quota exceeded, not available
3. **Runtime Errors**: JavaScript errors, unexpected failures

### Implementation Strategy

#### 1. Validation Errors
- Display inline below form fields
- Example: "Amount must be a positive number"

#### 2. Storage Errors
- Detect quota exceeded: Try-catch around setItem
- User message: "Storage limit reached (5MB). Delete old expenses or export data to free up space."
- Provide export button in error message

#### 3. Runtime Errors
- React Error Boundary for unexpected crashes
- User message: "Something went wrong. Try refreshing the page."
- Log error details to console (or error tracking service in future)

### Constitutional Alignment
Follows principle V: "Fail Loudly and Helpfully" - clear, actionable error messages

---

## 13. State Management

### Decision
**React Context API + useReducer** for global state (no external library needed)

### Rationale
- **Simplicity**: App state is simple (expenses list, filters), no need for Redux/Zustand
- **Built-in**: No extra dependencies, well-supported
- **Testability**: Easy to test reducers in isolation
- **Constitutional Alignment**: "Small Abstractions" (III) - avoid over-engineering

### State Structure
```typescript
interface AppState {
  expenses: Expense[]
  filters: ExpenseFilter
  storageUsage: StorageUsage
}

interface ExpenseFilter {
  dateRange: { start: Date | null; end: Date | null }
  categories: Category[]
  amountRange: { min: number | null; max: number | null }
  paymentMethods: PaymentMethod[]
  searchQuery: string
}
```

### Context Split
- **ExpenseContext**: Manages expenses CRUD operations
- **FilterContext**: Manages filter state and filtered results
- Alternative: Single AppContext with combined state (simpler, fine for this scope)

### Alternatives Considered
- **Redux**: Over-engineered for this app, too much boilerplate
- **Zustand**: Lightweight, but Context API is sufficient here
- **Jotai/Recoil**: Atomic state, but unnecessary complexity

---

## 14. Data Export/Import

### Decision
**Implement JSON export/import** for user data backup

### Rationale
- **User Control**: Users own their data, can back up and restore
- **Migration**: Enables switching browsers or devices
- **Storage Limit**: Allows clearing old data while preserving backup
- **Constitutional Alignment**: "UX Delight" (VIII) - frictionless data portability

### Implementation
1. **Export**: Download expenses array as JSON file (`expenses-backup-YYYY-MM-DD.json`)
2. **Import**: File input → parse JSON → validate schema → merge or replace expenses
3. **Validation**: Use Zod to validate imported data structure

### UI Placement
- Settings/More menu
- Storage warning message (when quota near limit)

---

## 15. Sample Data for First-Time Users

### Decision
**Provide optional sample data** with clear opt-in

### Rationale
- **Onboarding**: Empty state can be intimidating, sample data shows features
- **Testing**: Users can explore charts and filters immediately
- **Constitutional Alignment**: "UX Delight" (VIII) - progressive disclosure

### Implementation
1. Detect first visit (no expenses in localStorage)
2. Show welcome screen with two buttons:
   - "Start Fresh" → empty state
   - "Load Sample Data" → insert ~20 sample expenses across categories
3. Sample data: Realistic expenses from past 3 months, diverse categories/amounts

---

## Summary of Technical Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Language** | TypeScript | Type safety, maintainability |
| **Framework** | React 18+ | Ecosystem, component model |
| **Build Tool** | Vite | Fast dev server, modern tooling |
| **Charting** | Recharts | React-native, responsive, accessible |
| **Styling** | Tailwind CSS + CSS Modules | Utility-first, scoped styles |
| **Forms** | React Hook Form + Zod | Performance, validation |
| **State** | Context API + useReducer | Simple, sufficient for scope |
| **Storage** | localStorage wrapper | Quota monitoring, error handling |
| **Testing** | Vitest + Playwright | Fast, modern, cross-browser |
| **Dates** | date-fns | Lightweight, immutable |

---

## Open Questions Resolved

1. ~~Should we support data export/import?~~ → **YES** (see Decision 14)
2. ~~Should we provide sample data?~~ → **YES, opt-in** (see Decision 15)
3. ~~Maximum number of expense records?~~ → **~1000-5000 records** (localStorage limits ~5MB, average expense ~1KB JSON = ~5000 records feasible)

---

## Next Steps

Proceed to **Phase 1: Design & Contracts**
- Generate data-model.md (Expense entity definition)
- Generate API contracts (frontend service interfaces)
- Generate quickstart.md (developer onboarding guide)
- Update agent context with chosen technologies
