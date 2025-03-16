# Calculator Project Guidelines

## Build & Test Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (typescript check + vite build)
- `npm run lint` - Run ESLint on the codebase
- `npm test` - Run all tests
- `npx jest src/__tests__/tax.test.ts` - Run a specific test file
- `npx jest -t "test name"` - Run a specific test by name

## Code Style Guidelines
- **Imports**: Use absolute paths with @/ prefix (e.g., `import { X } from "@/components/Y"`)
- **TypeScript**: Use strict typing. Mark optional fields with `?` operator
- **Components**: Use functional components with TypeScript interfaces for props
- **Error Handling**: Validate inputs at boundaries, use descriptive error messages
- **Comments**: Add JSDoc comments for complex functions (`/** Description */`)
- **Naming**: 
  - Use PascalCase for components/types
  - Use camelCase for variables/functions
  - Use descriptive names that convey purpose
- **State Management**: Use React hooks (useState, useContext) for state
- **Testing**: Write tests for critical logic, especially calculation functions
- **Formatting**: Follow ESLint rules, maintain consistent indentation

## Project Structure
- `/src/components` - React components
- `/src/lib` - Core business logic
- `/src/__tests__` - Test files

## Project Overview

This is a retirement calculator plugin that helps users project their financial future by calculating income, expenses, taxes, and investment growth over time.

### Key Features
- Financial projections based on user inputs
- Tax calculations for different provinces
- Multiple account types (TFSA, RRSP, RRIF, LIRA, LIF)
- CSV export of projection data
- Visualization of financial projections

### Project Details

The calculator allows users to:
- Input personal information (birth year, life expectancy)
- Enter income details (employment, CPP, OAS, pensions, other income)
- Specify various assets (registered investments, non-registered investments, primary residence)
- Set expenses and charitable donations
- Generate projections and export data to CSV

### Current Development Focus
- Adding home ownership attribution field (who owns the home - husband, wife, or jointly owned)
- Adding separate income totals for husband and wife in CSV export for tax purposes
- Improving UI and user flow