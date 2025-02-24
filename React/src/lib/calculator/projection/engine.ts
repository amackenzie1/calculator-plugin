// File: src/lib/calculator/projection/engine.ts
import { CalculatorSchemaType } from '@/components/Schema'
import { YearState } from './types'
import { isProjectionComplete } from './utils'
import { createInitialState, ageOneYear, processHouseSale } from './state'
import { applyInvestmentReturns } from './accounts'
import { calculateYearlyIncome } from './income'
import { calculateRequiredWithdrawals } from './withdrawals'
import { calculateTaxImplications } from './tax'

/**
 * Calculates the next year's state based on the current state
 */
export function calculateNextYear(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  // 1. Handle house sale if applicable (moved to first step)
  const withHouseSale = processHouseSale(currentState, input)

  // 2. Apply investment returns (now includes house sale proceeds if applicable)
  const withReturns = applyInvestmentReturns(withHouseSale, input)

  // 3. Calculate income for the year
  const withIncome = calculateYearlyIncome(withReturns, input)

  // 4. Calculate required withdrawals for expenses
  const withWithdrawals = calculateRequiredWithdrawals(withIncome, input)

  // 5. Apply tax implications
  const withTax = calculateTaxImplications(withWithdrawals, input)

  // 6. Age everyone one year
  return ageOneYear(withTax)
}

/**
 * Projects retirement finances year by year
 * This is the internal implementation used by the public API
 */
export function projectRetirementInternal(input: CalculatorSchemaType): YearState[] {
  const states: YearState[] = []

  // 1. Create initial state from input
  const initialState = createInitialState(input)
  states.push(initialState)

  // 2. Project forward year by year
  while (!isProjectionComplete(states, input)) {
    const nextState = calculateNextYear(states[states.length - 1], input)
    states.push(nextState)
  }

  return states
}

/**
 * Calculate net worth from a year state and input data
 */
export function calculateNetWorth(
  state: YearState,
  data: CalculatorSchemaType
): number {
  // Sum up all assets across all accounts for both persons
  let netWorth = 0

  // Add primary residence value if it exists and hasn't been sold yet
  if (data.primaryResidenceValue) {
    if (
      !data.primaryResidenceSell ||
      !data.primaryResidenceSellYear ||
      state.year <= data.primaryResidenceSellYear
    ) {
      // Include house value up to and including the sale year
      // The sale proceeds will already be in the investment accounts
      netWorth += data.primaryResidenceValue
    }
  }

  // Add all account values from the current state
  Object.values(state.persons).forEach((person) => {
    Object.values(person.accounts).forEach((account) => {
      netWorth += account.marketValue
    })
  })

  // Add life insurance values if they exist
  data.persons.forEach((person) => {
    if (person.lifeInsuranceDeathBenefit) {
      netWorth += person.lifeInsuranceDeathBenefit
    }
  })

  return netWorth
}