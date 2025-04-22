// File: src/lib/calculator/projection/utils.ts
import { CalculatorSchemaType } from '@/components/Schema'
import { YearState } from './types'

/**
 * Checks if the projection has reached the target lifespan
 */
export function isProjectionComplete(
  states: YearState[],
  input: CalculatorSchemaType
): boolean {
  const currentState = states[states.length - 1]
  const self = input.persons.find((p) => p.personType === 'self')
  const selfState = currentState.persons.find((p) => p.personType === 'self')

  if (!self || !self.lifeExpectancy) return true

  const targetAge = self.lifeExpectancy
  return selfState?.age! >= targetAge
}

/**
 * Creates a deep clone of an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T
  }

  const clonedObj = {} as T
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone(obj[key])
    }
  }

  return clonedObj
}

/**
 * Adjusts an amount for inflation over a number of years
 */
export function adjustForInflation(
  baseAmount: number,
  startYear: number, 
  currentYear: number,
  inflationRate: number
): number {
  const yearsSinceStart = currentYear - startYear
  return baseAmount * Math.pow(1 + inflationRate, yearsSinceStart)
}

/**
 * Validates inputs required for projection calculations
 */
export function validateInputs(data: CalculatorSchemaType): void {
  // Validate required inputs
  if (!data.persons || data.persons.length === 0) {
    throw new Error("Must have a person of type 'self'")
  }

  const self = data.persons.find((p) => p.personType === 'self')
  if (!self) {
    throw new Error("Must have a person of type 'self'")
  }

  if (self.birthYear === null || self.birthYear === undefined) {
    throw new Error('Birth year is required for projection')
  }

  if (self.lifeExpectancy === null || self.lifeExpectancy === undefined) {
    throw new Error('Life expectancy is required for projection')
  }

  if (
    data.investmentReturnRate === null ||
    data.investmentReturnRate === undefined
  ) {
    throw new Error('Investment return rate is required for projection')
  }
}

// Default return rates (percent) if user does not specify
const DEFAULT_RETURN_RATE = 5
// Mapping of investor profiles to default return rates (percent)
const PROFILE_RETURN_RATES: Record<NonNullable<CalculatorSchemaType['investorProfile']>, number> = {
  risk_averse: 4,
  conservative: 5,
  moderate: 7,
  aggressive: 9,
  speculative: 12,
  custom: DEFAULT_RETURN_RATE,
}

/**
 * Determine the annual return rate (percent) for a given year
 * - If specifyReturn is true, use growthReturnRate before pivotYear and incomeReturnRate after
 * - Else if investmentReturnRate provided, use that
 * - Else if investorProfile provided and not 'custom', use PROFILE_RETURN_RATES
 * - Else fallback to DEFAULT_RETURN_RATE
 */
export function getAnnualReturnRate(
  input: CalculatorSchemaType,
  currentYear: number,
  pivotYear: number
): number {
  // If user specified separate return rates for growth vs income
  if (input.specifyReturn) {
    if (currentYear <= pivotYear && input.growthReturnRate != null) {
      return input.growthReturnRate
    }
    if (currentYear > pivotYear && input.incomeReturnRate != null) {
      return input.incomeReturnRate
    }
    // If one of the rates missing, fall back to single rate below
  }
  // Single specified return rate
  if (input.investmentReturnRate != null) {
    return input.investmentReturnRate
  }
  // Use profile defaults if provided
  if (input.investorProfile != null && input.investorProfile !== 'custom') {
    return PROFILE_RETURN_RATES[input.investorProfile]
  }
  // Fallback
  return DEFAULT_RETURN_RATE
}