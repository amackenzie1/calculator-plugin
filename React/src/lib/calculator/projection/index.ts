// File: src/lib/calculator/projection/index.ts
import { CalculatorSchemaType } from '@/components/Schema'
import { YearState, ProjectionDataPoint } from './types'
import { projectRetirementInternal, calculateNetWorth } from './engine'
import { validateInputs } from './utils'

/**
 * Projects retirement finances year by year
 * This is the main public API function for detailed projection
 */
export function projectRetirement(input: CalculatorSchemaType): YearState[] {
  validateInputs(input)
  return projectRetirementInternal(input)
}

/**
 * Projects net worth over time
 * This is the main public API function for simplified projection
 */
export function projectNetWorth(
  data: CalculatorSchemaType
): ProjectionDataPoint[] {
  // Validate inputs
  validateInputs(data)
  
  // Use our state-based projection system
  const states = projectRetirementInternal(data)

  // Convert YearState[] to ProjectionDataPoint[]
  return states.map((state) => {
    const netWorth = calculateNetWorth(state, data)
    
    return {
      year: state.year,
      netWorth: Math.round(netWorth),
    }
  })
}

// Re-export types that should be publicly accessible
export * from './types'