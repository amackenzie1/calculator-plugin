// File: src/lib/calculator/projection/engine.ts
import { CalculatorSchemaType } from "@/lib/schema/calculator";
import { applyInvestmentReturns } from "./accounts";
import { applyYearlyIncomeToAccounts, calculateYearlyIncome } from "./income";
import { ageOneYear, createInitialState, processHouseSale } from "./state";
import { calculateTaxImplications } from "./tax";
import { YearState } from "./types";
import { isProjectionComplete } from "./utils";
import { calculateRequiredWithdrawals } from "./withdrawals";

/**
 * Calculates the next year's state based on the current state
 */
export function calculateNextYear(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  // 1. Handle house sale if applicable (moved to first step)
  const withHouseSale = processHouseSale(currentState, input);

  // 2. Apply investment returns (now includes house sale proceeds if applicable)
  const withReturns = applyInvestmentReturns(withHouseSale, input);

  // 3. Calculate income for the year
  const withIncomeCalculated = calculateYearlyIncome(withReturns, input);

  // 4. Add calculated income to non-registered accounts
  const withIncomeAppliedToAssets =
    applyYearlyIncomeToAccounts(withIncomeCalculated);

  // 5. Estimate tax implications based on current income
  const withInitialTax = calculateTaxImplications(
    withIncomeAppliedToAssets,
    input
  );

  // 6. Calculate required withdrawals for expenses and taxes
  const withWithdrawals = calculateRequiredWithdrawals(withInitialTax, input);

  // 7. Age everyone one year
  return ageOneYear(withWithdrawals, input);
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
    console.log("nextState", nextState);
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
  // Apply the same calculations as calculateNextYear, but for the first year
  // This ensures we show closing balances (Dec 31) instead of opening balances (Jan 1)
  
  // 1. Handle house sale if applicable
  const withHouseSale = processHouseSale(openingState, input);

  // 2. Apply investment returns for the full year
  const withReturns = applyInvestmentReturns(withHouseSale, input);

  // 3. Calculate income for the year
  const withIncomeCalculated = calculateYearlyIncome(withReturns, input);

  // 4. Add calculated income to non-registered accounts
  const withIncomeAppliedToAssets = applyYearlyIncomeToAccounts(withIncomeCalculated);

  // 5. Estimate tax implications based on current income
  const withInitialTax = calculateTaxImplications(withIncomeAppliedToAssets, input);

  // 6. Calculate required withdrawals for expenses and taxes
  const withWithdrawals = calculateRequiredWithdrawals(withInitialTax, input);

  // 7. Don't age for the first year - we want to show the current year's closing state
  // The age shown should still be the current age (as of Dec 31 of current year)
  return withWithdrawals;
}

/**
 * Calculate net worth from a year state and input data
 */
export function calculateNetWorth(
  state: YearState,
  data: CalculatorSchemaType
): number {
  // Sum up all assets across all accounts for both persons
  let netWorth = 0;

  // Add primary residence value if it exists in the state (hasn't been sold yet)
  if (state.primaryResidenceValue) {
    netWorth += state.primaryResidenceValue;
  }

  // Add all account values from the current state
  state.persons.forEach((person) => {
    Object.values(person.accounts).forEach((account) => {
      netWorth += account.marketValue;
    });
  });

  // Add life insurance values if they exist
  data.persons.forEach((person) => {
    if (person.lifeInsuranceDeathBenefit) {
      netWorth += person.lifeInsuranceDeathBenefit;
    }
  });

  return netWorth;
}
