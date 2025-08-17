// File: src/lib/calculator/projection/index.ts
import { CalculatorSchemaType } from "@/lib/schema/calculator";
import {
  calculateNetWorth as calculateNetWorthEngine,
  projectRetirementInternal,
} from "./engine";
import { ProjectionDataPoint, YearState } from "./types";
import { validateInputs } from "./utils";
import { getAllExpenses } from "./withdrawals";

/**
 * Projects retirement finances year by year
 * This is the main public API function for detailed projection
 */
export function projectRetirement(input: CalculatorSchemaType): YearState[] {
  validateInputs(input);
  return projectRetirementInternal(input);
}

/**
 * Helper to calculate net worth for a given state, useful externally.
 */
export function calculateNetWorth(
  state: YearState,
  data: CalculatorSchemaType
): number {
  return calculateNetWorthEngine(state, data);
}

/**
 * Projects net worth over time
 * This is the main public API function for simplified projection
 */
export function projectNetWorth(
  data: CalculatorSchemaType
): ProjectionDataPoint[] {
  // Validate inputs
  validateInputs(data);

  // Use our state-based projection system
  const states = projectRetirementInternal(data);

  // Convert YearState[] to ProjectionDataPoint[]
  return states.map((state) => {
    // Calculate net worth for each state
    const netWorth = calculateNetWorthEngine(state, data);

    return {
      year: state.year,
      netWorth: Math.round(netWorth),
    };
  });
}

// Re-export types that should be publicly accessible
export * from "./types";

export { getAllExpenses };

// Export surplus calculation functions
export { calculateSurplusCapital } from './surplus';
export type { SurplusCalculationResult, ProjectionTestResult } from './surplus';
