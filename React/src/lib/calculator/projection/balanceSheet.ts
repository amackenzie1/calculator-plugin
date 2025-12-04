// File: src/lib/calculator/projection/balanceSheet.ts
import { CalculatorSchemaType } from '@/lib/schema/calculator'
import { YearState } from './types'

/**
 * Sum all investable account market values across all persons.
 */
export function sumAccountMarketValues(state: YearState): number {
  return state.persons.reduce((total, person) => {
    return (
      total +
      Object.values(person.accounts).reduce((accTotal, account) => accTotal + account.marketValue, 0)
    )
  }, 0)
}

/**
 * Determine whether to include the primary residence in net worth.
 * Only count the home when the plan says it will be sold.
 */
export function shouldIncludeHomeInNetWorth(state: YearState, input: CalculatorSchemaType): boolean {
  return Boolean(state.primaryResidenceValue && input.primaryResidenceSell)
}

/**
 * Calculate net worth for a given year state using consistent rules.
 */
export function calculateNetWorthValue(state: YearState, input: CalculatorSchemaType): number {
  let total = sumAccountMarketValues(state)

  if (shouldIncludeHomeInNetWorth(state, input)) {
    total += state.primaryResidenceValue || 0
  }

  // Subtract liabilities (currently just debt balance)
  total -= state.liabilities?.debtBalance ?? 0

  return total
}

/**
 * Calculate liquid assets from raw input (non-registered + registered values only).
 * NOTE: House is never included - it's not liquid even if you can borrow against it.
 * Home equity borrowing is handled separately in the withdrawal/deficit logic.
 */
export function calculateLiquidAssetsFromInput(input: CalculatorSchemaType): number {
  let liquidAssets = 0

  for (const person of input.persons) {
    liquidAssets += person.nonRegisteredInvestmentValue || 0

    if (person.registeredInvestments) {
      for (const account of person.registeredInvestments) {
        liquidAssets += account.currentValue || 0
      }
    }
  }

  return liquidAssets
}

/**
 * Calculate total net worth from input only (used for initial surplus bounds).
 */
export function calculateTotalNetWorthFromInput(input: CalculatorSchemaType): number {
  let totalNetWorth = calculateLiquidAssetsFromInput(input)

  if (input.primaryResidenceValue && (input.primaryResidenceSell || input.allowHomeBorrowing)) {
    totalNetWorth += input.primaryResidenceValue
  }

  totalNetWorth -= input.startingDebt || 0

  return totalNetWorth
}
