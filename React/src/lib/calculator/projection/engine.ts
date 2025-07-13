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

  // 1. Create initial state from input
  let initialState = createInitialState(input);

  // Apply tax calculations to the initial year as well
  initialState = calculateTaxImplications(initialState, input);

  states.push(initialState);

  // 2. Project forward year by year
  while (!isProjectionComplete(states, input)) {
    const nextState = calculateNextYear(states[states.length - 1], input);
    console.log("nextState", nextState);
    states.push(nextState);
  }

  return states;
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

  // Add primary residence value if it exists and hasn't been sold yet
  if (data.primaryResidenceValue) {
    if (
      !data.primaryResidenceSell ||
      !data.primaryResidenceSellYear ||
      state.year <= data.primaryResidenceSellYear
    ) {
      // Include house value up to and including the sale year
      // The sale proceeds will already be in the investment accounts
      netWorth += data.primaryResidenceValue;
    }
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
