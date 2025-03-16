// File: src/lib/calculator/projection/engine.ts
import { CalculatorSchemaType } from '@/components/Schema'
import { YearState } from './types'
import { isProjectionComplete } from './utils'
import { createInitialState, ageOneYear, processHouseSale } from './state'
import { applyInvestmentReturns, withdrawFromAccount } from './accounts'
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

  // 4. Estimate tax implications based on current income
  const withInitialTax = calculateTaxImplications(withIncome, input)
  
  // 5. Calculate required withdrawals for expenses and taxes
  const withWithdrawals = calculateRequiredWithdrawals(withInitialTax, input)

  // 6. Recalculate final tax implications after withdrawals
  const withTax = calculateTaxImplications(withWithdrawals, input)

  // 7. Subtract taxes from available funds
  const finalState = subtractTaxesFromInvestments(withTax)

  // 8. Age everyone one year
  return ageOneYear(finalState)
}

/**
 * Projects retirement finances year by year
 * This is the internal implementation used by the public API
 */
export function projectRetirementInternal(input: CalculatorSchemaType): YearState[] {
  const states: YearState[] = []

  // 1. Create initial state from input
  let initialState = createInitialState(input)
  
  // Apply tax calculations to the initial year as well
  initialState = calculateTaxImplications(initialState, input)
  
  // Apply tax to investments in initial year
  initialState = subtractTaxesFromInvestments(initialState)
  
  states.push(initialState)

  // 2. Project forward year by year
  while (!isProjectionComplete(states, input)) {
    const nextState = calculateNextYear(states[states.length - 1], input)
    states.push(nextState)
  }

  return states
}

/**
 * Subtracts taxes from investments
 * This ensures that taxes are actually paid from the available funds
 */
function subtractTaxesFromInvestments(state: YearState): YearState {
  const newState = JSON.parse(JSON.stringify(state)); // Deep clone
  const taxAmount = state.taxPaid;
  
  if (taxAmount <= 0) return newState;
  
  let remainingTax = taxAmount;
  
  // Withdrawal strategy for taxes (same order as for expenses)
  
  // 1. Non-registered Withdrawals (most tax efficient)
  if (remainingTax > 0) {
    for (const person of Object.values(newState.persons)) {
      const { withdrawn, remaining, realizedGains } = withdrawFromAccount(
        person.accounts.nonRegistered,
        remainingTax
      );
      remainingTax = remaining;
      // Add to realized gains (might trigger more tax next year, but that's realistic)
      newState.realizedGains += realizedGains;
      if (remainingTax === 0) break;
    }
  }
  
  // 2. TFSA Withdrawals 
  if (remainingTax > 0) {
    for (const person of Object.values(newState.persons)) {
      const { withdrawn, remaining } = withdrawFromAccount(
        person.accounts.tfsa,
        remainingTax
      );
      remainingTax = remaining;
      if (remainingTax === 0) break;
    }
  }
  
  // 3. RRSP/RRIF Withdrawals (least tax efficient, but might be necessary)
  if (remainingTax > 0) {
    for (const person of Object.values(newState.persons)) {
      // Try RRSP first
      if (person.accounts.rrsp.marketValue > 0) {
        const { withdrawn, remaining } = withdrawFromAccount(
          person.accounts.rrsp,
          remainingTax
        );
        remainingTax = remaining;
        if (remainingTax === 0) break;
      }
      
      // Then try RRIF if needed
      if (remainingTax > 0 && person.accounts.rrif.marketValue > 0) {
        const { withdrawn, remaining } = withdrawFromAccount(
          person.accounts.rrif,
          remainingTax
        );
        remainingTax = remaining;
        if (remainingTax === 0) break;
      }
    }
  }
  
  return newState;
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