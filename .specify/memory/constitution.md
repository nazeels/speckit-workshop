<!--
Sync Impact Report
==================
Version: 0.0.0 → 1.0.0
Rationale: Initial constitution establishment with 10 core principles

Added Sections:
- Core Principles (10 principles focused on clean code & delightful UX)
- Enforcement & Workflow
- Examples - Do and Don't
- Governance

Templates Status:
- ✅ .specify/templates/spec-template.md (aligned with constitution requirements)
- ✅ .specify/templates/plan-template.md (constitution check section present)
- ✅ .specify/templates/tasks-template.md (aligned with testing & workflow principles)

Follow-up TODOs:
- None - all placeholders filled
-->

# Expense Tracker Constitution

## Purpose

This constitution captures the core principles we pledge to follow when designing, specifying, and implementing features in this repository. It is intentionally short, actionable, and meant to guide decisions during specification, implementation, review, and maintenance.

Our goals:
- Ensure code is easy to read, change, and reason about
- Deliver software that feels reliable, intuitive, and delightful to use
- Provide concrete rules reviewers and automated tools can rely on

## Core Principles

### I. Readability First

Code MUST prioritize clarity over cleverness.

- Prefer clear, descriptive names for functions, variables, types, and files. A well-chosen name reduces the need for comments.
- Keep functions and methods short—a single, easily-stated responsibility.
- Structure files and folders so a newcomer can find behavior quickly.

**Rationale**: Code is read far more often than written. Optimizing for readability reduces onboarding time, debugging time, and maintenance costs.

### II. Explicitness and Minimal Surprise

Code MUST favor explicit over implicit behavior.

- Avoid clever hacks that obscure intent.
- Make side effects visible in APIs and function names (e.g., `saveUser()` vs `process()`).
- Document non-obvious decisions inline with clear comments explaining "why" not "what".

**Rationale**: Implicit behavior creates maintenance traps. When developers can predict what code does by reading it, they make fewer mistakes.

### III. Small, Focused Abstractions

Abstractions MUST hide complexity, not add it.

- If you need lengthy prose to explain an abstraction, it's likely too complex.
- Compose small functions instead of long monoliths.
- Each function should be easy to test in isolation.

**Rationale**: Simple abstractions are easier to understand, test, and modify. Complex abstractions create cognitive overhead and maintenance burden.

### IV. Testability and Continuous Verification

Every non-trivial behavior MUST have automated tests.

- Tests are part of the design; they document expected behavior and guard against regressions.
- Use fast, deterministic tests for core logic.
- Reserve slower end-to-end tests for integration boundaries.
- Tests MUST be written before implementation when following TDD (if specified in feature requirements).

**Rationale**: Automated tests are the safety net that enables confident refactoring and rapid iteration. They serve as executable documentation.

### V. Fail Loudly and Helpfully

Systems MUST prefer explicit validation and clear error messages over silent failures.

- Error messages MUST be actionable: explain what happened, why, and how to fix it.
- Validate inputs at system boundaries.
- Use typed errors or error codes for programmatic handling.

**Rationale**: Clear errors reduce debugging time and improve user experience. Silent failures create mysterious bugs that waste hours of investigation.

### VI. Performance with Humility

Code MUST optimize for clarity first; only optimize for speed when necessary and measured.

- Document and test performance boundaries where performance matters.
- Use profiling data to guide optimization decisions, not assumptions.
- When optimizing, preserve readability through clear comments.

**Rationale**: Premature optimization is the root of much evil. Most code doesn't need to be fast—it needs to be correct and maintainable.

### VII. Accessibility and Inclusion

User-facing surfaces MUST be designed for accessibility.

- Support keyboard navigation, screen readers, and sufficient contrast.
- Use localization-ready strings (avoid hardcoded text).
- Consider diverse environments and users when making UX choices.

**Rationale**: Accessible software is better software for everyone. Designing for inclusion from the start is easier than retrofitting.

### VIII. Delight Through Frictionless UX

Features MUST make common tasks simple and fast.

- Provide useful defaults and sensible fallbacks.
- Use progressive disclosure: reveal complexity only when users need it.
- Expose advanced options without cluttering the default experience.
- Provide immediate feedback for user actions.

**Rationale**: Users judge software quality by their experience, not by code elegance. Frictionless UX creates user satisfaction and adoption.

### IX. Consistency and Conventions

Code MUST prefer established patterns and the project's existing idioms.

- Follow language-standard naming conventions (e.g., camelCase for JavaScript, snake_case for Python).
- Enforce consistency via linters, formatters, and shared style rules.
- When introducing new patterns, document the decision and rationale.

**Rationale**: Consistency reduces cognitive load. Developers can focus on solving problems instead of decoding inconsistent styles.

### X. Observe and Iterate

UX-critical flows MUST be instrumented for learning.

- Use telemetry, logs, and user feedback channels to understand real-world behavior.
- Use data to prioritize UX improvements and refactors.
- Monitor error rates and performance metrics in production.

**Rationale**: Assumptions about user behavior are often wrong. Data-driven iteration leads to better product decisions.

## Enforcement & Workflow

### Code Review Process

All pull requests MUST be reviewed for constitutional compliance:

- **Readability check**: Are names clear? Are functions focused?
- **Test coverage**: Do tests cover the new behavior?
- **Error handling**: Are errors clear and actionable?
- **Accessibility**: Are UX changes accessible?
- **Documentation**: Are non-obvious decisions explained?

Reviewers MUST call out violations respectfully and propose concrete alternatives.

### Automated Tooling

Projects MUST configure automated tooling where possible:

- Linters for code style and common mistakes
- Type-checkers for type safety
- Formatters for consistent style
- Tests MUST run in CI and block merges on failure

### Pull Request Template Checklist

PR templates SHOULD include a constitutional compliance checklist:

- [ ] Code is readable and functions have single responsibilities
- [ ] Tests cover new behavior (unit + integration as appropriate)
- [ ] Error messages are clear and actionable
- [ ] UX changes support accessibility (keyboard, screen readers, contrast)
- [ ] Documentation updated for non-obvious decisions

## Examples — Do and Don't

### Readability

**Do**: Write `calculateInvoiceTotal(items)` with small helper functions for tax and discount logic.

**Don't**: Put unrelated responsibilities into a single `processInvoice()` 400-line function.

### Error Handling

**Do**: Surface a clear, user-facing error:
```
"Payment failed: card expired — update card to continue."
[Update Payment Method]
```

**Don't**: Show a generic "Something went wrong" with no next step.

### Abstraction

**Do**: Create a `formatCurrency(amount, locale)` function for money formatting.

**Don't**: Create an `AbstractCurrencyFormatterFactoryProvider` with 5 layers of indirection.

### Testing

**Do**: Write focused unit tests for business logic and integration tests for API contracts.

**Don't**: Only write end-to-end tests that take 10 minutes to run and break randomly.

## Governance

### Constitutional Authority

This constitution supersedes all other practices and guidelines in this repository.

- In case of conflict between this constitution and other documentation, the constitution takes precedence.
- Deviations from constitutional principles MUST be explicitly justified in code review.

### Amendment Process

Amendments to this constitution require:

1. A pull request with proposed changes
2. Clear rationale and examples demonstrating the need
3. Review and approval from project maintainers
4. Migration plan if the change affects existing code
5. Version increment following semantic versioning rules

### Versioning Policy

Constitutional versions follow semantic versioning:

- **MAJOR**: Backward incompatible governance changes or principle removals/redefinitions
- **MINOR**: New principle/section added or materially expanded guidance
- **PATCH**: Clarifications, wording improvements, typo fixes, non-semantic refinements

### Compliance Review

Projects MUST review constitutional compliance:

- During specification phase (verify requirements align with principles)
- During implementation (verify code follows principles)
- During code review (verify PR meets constitutional standards)
- Periodically (audit existing code for constitutional drift)

### Complexity Justification

When constitutional principles must be violated (e.g., performance requires complex optimization):

- Document the violation in code comments
- Explain why the simpler alternative is insufficient
- Add the justification to the "Complexity Tracking" section in [plan.md](plan.md)
- Ensure reviewers explicitly approve the violation

**Version**: 1.0.0 | **Ratified**: 2025-11-12 | **Last Amended**: 2025-11-12
