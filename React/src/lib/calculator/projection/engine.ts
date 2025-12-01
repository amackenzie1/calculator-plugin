// File: src/lib/calculator/projection/engine.ts
import { CalculatorSchemaType } from "@/lib/schema/calculator";
import { applyInvestmentReturns } from "./accounts";
import { calculateNetWorthValue } from "./balanceSheet";
import { applyYearlyIncomeToAccounts, calculateYearlyIncome } from "./income";
import { ageOneYear, createInitialState, processHouseSale } from "./state";
import { calculateTaxImplications } from "./tax";
import { YearState } from "./types";
import { deepClone, getBorrowingRate, isProjectionComplete } from "./utils";
import { calculateRequiredWithdrawals, withdrawAdditionalAmount } from "./withdrawals";

/**
 * Calculates the next year's state based on the current state
 */
export function calculateNextYear(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  const yearEndState = runAnnualCalculations(currentState, input);
  return ageOneYear(yearEndState, input);
}

/**
 * Projects retirement finances year by year
 * This is the internal implementation used by the public API
 */
export function projectRetirementInternal(
  input: CalculatorSchemaType
): YearState[] {
  const states: YearState[] = [];

  // 1. Create initial state from input (this represents Jan 1, 2025 opening balances)
  const initialState = createInitialState(input);

  // 2. Calculate the first year's closing balances (Dec 31, 2025)
  // This applies investment returns, income, expenses, and taxes for the full year
  const firstYearClosing = calculateFirstYear(initialState, input);
  states.push(firstYearClosing);

  // 3. Project forward year by year
  while (!isProjectionComplete(states, input)) {
    const nextState = calculateNextYear(states[states.length - 1], input);
    states.push(nextState);
  }

  return states;
}

/**
 * Calculates the first year's closing state (Dec 31) from opening balances (Jan 1)
 * This ensures the first year shows end-of-year balances after applying growth and income
 */
function calculateFirstYear(
  openingState: YearState,
  input: CalculatorSchemaType
): YearState {
  // Apply the annual pipeline once without aging to show the current year's closing state
  return runAnnualCalculations(openingState, input);
}

/**
 * Calculate net worth from a year state and input data
 */
export function calculateNetWorth(
  state: YearState,
  data: CalculatorSchemaType
): number {
  return calculateNetWorthValue(state, data);
}

/**
 * Run the annual pipeline (house sale -> returns -> income -> tax -> withdrawals).
 * This does NOT age the individuals; callers decide whether to age after processing.
 */
function runAnnualCalculations(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  // 1. Handle house sale if applicable (moved to first step)
  const withHouseSale = processHouseSale(currentState, input);

  // 2. Apply liability growth (interest on debt)
  const withLiabilityGrowth = applyLiabilityGrowth(withHouseSale, input);

  // 3. Apply investment returns (now includes house sale proceeds if applicable)
  const withReturns = applyInvestmentReturns(withLiabilityGrowth, input);

  // 4. Calculate income for the year
  const withIncomeCalculated = calculateYearlyIncome(withReturns, input);

  // 5. Add calculated income to non-registered accounts
  const withIncomeAppliedToAssets = applyYearlyIncomeToAccounts(withIncomeCalculated);

  // 6. Estimate tax implications based on current income
  const withInitialTax = calculateTaxImplications(withIncomeAppliedToAssets, input);

  // 7. Calculate required withdrawals for expenses and taxes
  const withWithdrawals = calculateRequiredWithdrawals(withInitialTax, input);

  // 8. Recalculate tax with actual withdrawals/realized gains and top up if needed
  return reconcileTaxAfterWithdrawals(withWithdrawals, input);
}

function applyLiabilityGrowth(currentState: YearState, input: CalculatorSchemaType): YearState {
  const rate = getBorrowingRate(input) / 100
  const newState = deepClone(currentState)
  newState.liabilities.debtBalance *= 1 + rate
  return newState
}

function reconcileTaxAfterWithdrawals(state: YearState, input: CalculatorSchemaType): YearState {
  let workingState = state

  for (let i = 0; i < 2; i++) {
    const withUpdatedTax = calculateTaxImplications(workingState, input)
    const previousTaxTotal = workingState.persons.reduce((sum, p) => sum + p.taxPaid, 0)
    const updatedTaxTotal = withUpdatedTax.persons.reduce((sum, p) => sum + p.taxPaid, 0)

    // If tax did not increase, or no difference, we're done
    if (updatedTaxTotal <= previousTaxTotal + 1e-2) {
      return withUpdatedTax
    }

    const delta = updatedTaxTotal - previousTaxTotal
    const withTopUp = withdrawAdditionalAmount(withUpdatedTax, delta)
    workingState = withTopUp
  }

  // Final recompute to ensure taxPaid reflects last withdrawals
  return calculateTaxImplications(workingState, input)
}
