# Expense Tracker Application

A personal expense tracking application built with React, TypeScript, and Vite. Track, categorize, and analyze your financial transactions with visual summaries and powerful filtering.

## Features

- 📝 **Record Expenses**: Track expenses with amount, date, category, payment method, and notes
- 🏷️ **Categorize**: Organize spending across 10 predefined categories
- 📊 **Visual Analytics**: Interactive charts showing spending patterns and trends
- 🔍 **Advanced Filtering**: Filter by date range, category, amount, and payment method
- 💾 **Offline-First**: All data stored locally in your browser
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- ♿ **Accessible**: WCAG AA compliant with keyboard navigation and screen reader support

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

### Build

```bash
npm run build
```

### Testing

```bash
npm test              # Run tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Generate coverage report
```

### Code Quality

```bash
npm run lint          # Run ESLint
npm run lint:fix      # Fix linting issues
npm run format        # Format with Prettier
npm run type-check    # TypeScript type checking
```

## Project Structure

```
src/
├── components/       # UI components
│   ├── common/       # Reusable components (Button, Input, etc.)
│   ├── ExpenseForm/  # Expense creation/editing
│   ├── ExpenseList/  # List view
│   ├── Charts/       # Data visualizations
│   └── ...
├── services/         # Business logic
├── models/           # Data models & types
├── utils/            # Utility functions
├── hooks/            # Custom React hooks
├── pages/            # Main views
├── context/          # React Context providers
└── styles/           # Global styles & theme
```

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Storage**: localStorage (offline-first)
- **Testing**: Vitest + React Testing Library

## Documentation

- [Feature Specification](./specs/main/spec.md) - User stories and requirements
- [Implementation Plan](./specs/main/plan.md) - Technical architecture
- [Data Model](./specs/main/data-model.md) - Entity definitions
- [API Contracts](./specs/main/contracts/) - Service interfaces

## Development Commands

```bash
npm run dev          # Start dev server
npm test             # Run unit & integration tests
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking
npm run build        # Production build
```

## License

ISC

## Contributing

This is a workshop project. Feel free to fork and experiment!
