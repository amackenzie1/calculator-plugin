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
  - `/lib/calculator/projection` - Financial projection engine
  - `/lib/schema` - Data models and validation schemas
  - `/lib/constants` - Shared constants (provinces, etc.)
- `/src/__tests__` - Test files
- `/cdk` - AWS CDK infrastructure (intentionally kept in this repo)

## Project Overview

This is a retirement calculator plugin that helps users project their financial future by calculating income, expenses, taxes, and investment growth over time.

### Key Features
- Financial projections based on user inputs
- Tax calculations for different provinces
- Multiple account types (TFSA, RRSP, RRIF, LIRA, LIF)
- Excel (XLSX) export of detailed projection data
- Visualization of financial projections

### Project Details

The calculator allows users to:
- Input personal information (birth year, life expectancy)
- Enter income details (employment, CPP, OAS, pensions, other income)
- Specify various assets (registered investments, non-registered investments, primary residence)
- Set expenses and charitable donations
- Generate projections and export data to Excel

### Current Development Focus
- Home ownership attribution field has been implemented (joint/self/spouse)
- Improving UI and user flow
- Enhancing projection accuracy and tax calculations

## Code Architecture Notes

### Core Calculation Engine
The financial projection engine (`/src/lib/calculator/projection/`) uses a state-based approach:
- Each year's state is calculated from the previous year
- Deep cloning is used intentionally for safety (don't optimize this away)
- Withdrawal order is tax-optimized: TFSA → Non-Registered → RRSP → RRIF → LIF

### Important Constants
- All magic numbers are defined in `/src/lib/calculator/projection/constants.ts`
- Account types use const objects for type safety (not string literals)
- Tax rates and thresholds are centralized for easy updates

### Common Patterns
- **Year/Age Conversion**: Use the `deriveYear()` helper to handle year vs age inputs
- **Income Calculations**: Use helper functions to avoid repetition
- **Account Operations**: Use the type-safe account collections and constants
- **State Mutations**: Always use `deepClone()` before modifying state

### Testing Notes
- Run `npm test` before committing calculation changes
- Console.log statements are commented out but can be uncommented for debugging
- Test data uses 2025 as the base year

## Form Components Architecture

### Reusable Form Components
The form system has been refactored to use a set of reusable components that eliminate ~60-70% of repetitive code:

#### Core Components (`/src/components/form/`)
- **`NumberInput`** - Handles all numeric inputs with automatic parseInt/parseFloat conversion based on type
- **`TextInput`** - Standard text input with consistent styling and validation
- **`SelectField`** - Dropdown/select fields with type-safe options
- **`SwitchField`** - Toggle switches with built-in label and description support
- **`FormSection`** - Standardized section headers with optional tooltips and descriptions
- **`SelfSpouseFields`** - Automatically handles the self/spouse grid layout (shows spouse fields conditionally)
- **`FormFieldWithTooltip`** - Adds info icons with tooltips to any form label

#### Helper Utilities
- **`useFormList`** (`/src/hooks/useFormList.ts`) - Custom hook for managing dynamic lists (add/remove items)
- **`fieldPath`** (`/src/lib/form-helpers.ts`) - Type-safe helper for dynamic field paths in forms

### Form Development Guidelines
- Use the reusable components instead of raw form fields
- For dynamic field paths (e.g., array indices), use the `fieldPath` helper: 
  ```typescript
  name={fieldPath<z.infer<typeof CalculatorSchema>>(`persons.${index}.amount`)}
  ```
- When adding new form sections, follow the established pattern:
  ```typescript
  <FormSection title="Section Title" description="Brief description" tooltip="Detailed help">
    <SelfSpouseFields
      calculateForSpouse={calculateForSpouse}
      selfContent={<NumberInput ... />}
      spouseContent={<NumberInput ... />}
    />
  </FormSection>
  ```
- For lists with add/remove functionality, use the `useFormList` hook
- All form components automatically handle null/undefined values and type conversion

### Benefits of the Form Architecture
- **Consistent UI/UX** - All forms behave identically across the application
- **Type Safety** - Full TypeScript support with proper inference
- **Easy Maintenance** - Fix bugs or add features in one place
- **Reduced Code** - ~60-70% less code in form components
- **Standardized Validation** - Validation logic is centralized in the reusable components