// File: src/lib/calculator/projection/withdrawals.ts
import { CalculatorSchemaType } from "@/lib/schema/calculator";
import { withdrawFromAccount } from "./accounts";
import { RRIF_MIN_WITHDRAWAL_RATES, AGE_CONSTANTS, ACCOUNT_TYPES, WithdrawalAccountType } from "./constants";
import { getCharitableDonationsForYear } from "./tax";
import { PersonState, YearState } from "./types";
import { deepClone } from "./utils";

/**
 * Gets the appropriate RRIF minimum withdrawal rate based on age
 */
export function getRRIFMinimumRate(age: number, spouseAge?: number): number {
  // Always use the younger age if spouse exists
  const effectiveAge = spouseAge ? Math.min(age, spouseAge) : age;

  // No withdrawals required before age 55
  if (effectiveAge < 55) return 0;

  // Maximum rate for ages above our table
  if (effectiveAge > AGE_CONSTANTS.MAX_WITHDRAWAL_RATE_AGE) return AGE_CONSTANTS.MAX_WITHDRAWAL_RATE;

  // Return the rate from our table, or default to max rate if not found
  return RRIF_MIN_WITHDRAWAL_RATES[effectiveAge] || AGE_CONSTANTS.MAX_WITHDRAWAL_RATE;
}

export function getAllExpenses(
  currentState: YearState,
  input: CalculatorSchemaType
): number {
  const inflationAdjustedExpenses = currentState.persons.reduce(
    (sum, person) => sum + person.expenses,
    0
  );
  const oneOffExpensesForYear = (input.oneOffExpenses ?? [])
    .filter((expense) => expense.year === currentState.year && expense.amount)
    .reduce((total, expense) => total + expense.amount!, 0);
  return inflationAdjustedExpenses + oneOffExpensesForYear;
}

/**
 * Calculates required withdrawals based on expenses and rules
 */
export function calculateRequiredWithdrawals(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  const newState = deepClone(currentState);
  const currentYear = newState.year;

  // Reset withdrawals and gains for the current year's calculation
  newState.persons.forEach((person) => {
    person.withdrawals = {
      nonRegistered: 0,
      tfsa: 0,
      rrsp: 0,
      rrif: 0,
    };
    person.realizedGains = 0;
    // console.log(
    //   `WITHDRAWALS RESET for ${person.personType}, year ${currentYear}:`,
    //   JSON.parse(JSON.stringify(person.withdrawals))
    // );
  });

  // Calculate regular expenses (inflation adjusted)
  const inflationAdjustedExpenses = newState.persons.reduce(
    (sum, person) => sum + person.expenses,
    0
  );

  // Add one-off expenses for the current year
  const oneOffExpensesForYear = (input.oneOffExpenses ?? [])
    .filter((expense) => expense.year === currentYear && expense.amount)
    .reduce((total, expense) => total + expense.amount!, 0);
  // console.log("oneOffExpensesForYear", oneOffExpensesForYear);
  const charitableDonations = getCharitableDonationsForYear(
    input.charitableDonations ?? [],
    currentYear
  ).reduce((sum, donation) => sum + (donation.amount ?? 0), 0);

  // Total expenses needed this year
  const totalExpensesNeeded =
    inflationAdjustedExpenses + oneOffExpensesForYear + charitableDonations;

  // Get spouse's age if exists for RRIF calculations
  const spouseAge = newState.persons.find(
    (person) => person.personType === "spouse"
  )?.age;

  // Process RRSP to RRIF conversions and mandatory withdrawals
  newState.persons.forEach((person) => {
    processRRSPToRRIFConversion(person);
    processMandatoryRRIFWithdrawal(person, spouseAge);
  });

  // Add estimated tax to expenses (using the tax amount calculated in the initial tax estimation step)
  const totalTaxPaid = newState.persons.reduce(
    (sum, person) => sum + person.taxPaid,
    0
  );
  const totalNeeded = totalExpensesNeeded + totalTaxPaid;
  // console.log("totalTaxPaid", totalTaxPaid, "totalNeeded", totalNeeded);

  // Calculate required additional withdrawals
  let remainingNeeded = Math.max(0, totalNeeded);

  // Withdrawal strategy (in order of tax efficiency)
  if (remainingNeeded > 0) {
    const withdrawalOrder: WithdrawalAccountType[] = [
      ACCOUNT_TYPES.TFSA,
      ACCOUNT_TYPES.NON_REGISTERED,
      ACCOUNT_TYPES.RRSP,
      ACCOUNT_TYPES.RRIF,
    ];

    for (const accountType of withdrawalOrder) {
      if (remainingNeeded === 0) break;
      remainingNeeded = processWithdrawalsFromAccountType(
        newState.persons,
        accountType,
        remainingNeeded
      );
    }

    // Special handling for LIF withdrawals if still needed
    if (remainingNeeded > 0) {
      remainingNeeded = processLIFWithdrawals(newState.persons, remainingNeeded, currentYear);
    }
  }

  return newState;
}

// Helper functions to reduce repetition

function processRRSPToRRIFConversion(person: PersonState): void {
  // Convert RRSP to RRIF at age 71
  if (person.age === AGE_CONSTANTS.RRSP_TO_RRIF_AGE && person.accounts.rrsp.marketValue > 0) {
    person.accounts.rrif.marketValue = person.accounts.rrsp.marketValue;
    person.accounts.rrif.bookValue = person.accounts.rrsp.bookValue;
    person.accounts.rrsp.marketValue = 0;
    person.accounts.rrsp.bookValue = 0;
  }
}

function processMandatoryRRIFWithdrawal(person: PersonState, spouseAge?: number): void {
  // Calculate and apply mandatory RRIF withdrawal
  if (person.age >= 55 && person.accounts.rrif.marketValue > 0) {
    // Automatically use spouse's age if younger
    const rate = getRRIFMinimumRate(person.age, spouseAge);

    // Calculate minimum withdrawal based on January 1st value
    const mandatoryWithdrawal = person.accounts.rrif.marketValue * rate;

    // Apply the withdrawal
    person.accounts.rrif.marketValue -= mandatoryWithdrawal;
    person.withdrawals.rrif += mandatoryWithdrawal;
  }
}

function processWithdrawalsFromAccountType(
  persons: PersonState[],
  accountType: WithdrawalAccountType,
  remainingNeeded: number
): number {
  for (const person of persons) {
    if (remainingNeeded === 0) break;
    
    const account = person.accounts[accountType];
    const { withdrawn, remaining, realizedGains } = withdrawFromAccount(
      account,
      remainingNeeded
    );
    
    // Update withdrawal tracking
    person.withdrawals[accountType] += withdrawn;
    
    // Track realized gains for non-registered accounts
    if (accountType === ACCOUNT_TYPES.NON_REGISTERED && realizedGains) {
      person.realizedGains += realizedGains;
    }
    
    remainingNeeded = remaining;
  }
  
  return remainingNeeded;
}

function processLIFWithdrawals(
  persons: PersonState[],
  remainingNeeded: number,
  currentYear: number
): number {
  let lifWithdrawals = 0;

  for (const person of persons) {
    if (person.accounts.lif.marketValue > 0) {
      const { withdrawn, remaining } = withdrawFromAccount(
        person.accounts.lif,
        remainingNeeded
      );
      lifWithdrawals += withdrawn;
      remainingNeeded = remaining;
      if (remainingNeeded === 0) break;
    }
  }

  // Log LIF withdrawals for debugging/reporting
  if (lifWithdrawals > 0) {
    // console.log(
    //   `Year ${currentYear}: LIF withdrawals: $${lifWithdrawals.toFixed(2)}`
    // );
  }

  return remainingNeeded;
}
