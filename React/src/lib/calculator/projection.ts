// File: src/lib/calculator/projection.ts
// This file is now a re-export from the modular projection system

// Re-export the public API
export { 
  projectRetirement, 
  projectNetWorth 
} from './projection/index'

// Re-export public types
export type {
  ProjectionDataPoint,
  YearState
} from './projection/types'