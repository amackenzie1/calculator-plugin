// File: src/lib/calculator/projection/income.ts
import { CalculatorSchemaType } from "@/lib/schema/calculator";
import { GOVERNMENT_BENEFITS, YearOrAge } from "./constants";
import { PersonState, YearState } from "./types";
import { adjustForInflation, deepClone } from "./utils";

/**
 * Calculates the yearly income for each person and updates the state
 */
export function calculateYearlyIncome(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  const newState = deepClone(currentState);
  const currentYear = newState.year;
  const inflationRate = (input.inflationRate ?? 2.5) / 100;

  // Process each person's income
  function processPersonIncome(person: PersonState) {
    const schemaPerson = input.persons.find(
      (p) => p.personType === person.personType
    );
    if (!schemaPerson) return;

    const simulationEpochYear = new Date().getFullYear();

    // 1. Employment Income
    const employmentStart = deriveYear({
      year: schemaPerson.incomeYearStart,
      age: schemaPerson.incomeStartAge,
      birthYear: schemaPerson.birthYear,
    });
    const employmentEnd = deriveYear({
      year: schemaPerson.incomeYearEnd,
      age: schemaPerson.incomeEndAge,
      birthYear: schemaPerson.birthYear,
    });
    
    person.income.employment = calculateIncomeForYear(
      schemaPerson.primaryYearlyIncome,
      employmentStart,
      employmentEnd,
      currentYear
    );

    // 2. CPP Income
    const cppStart = deriveYear(
      {
        year: schemaPerson.cppStartYear,
        age: schemaPerson.cppStartAge,
        birthYear: schemaPerson.birthYear,
      },
      GOVERNMENT_BENEFITS.CPP.STANDARD_AGE
    );

    person.income.cpp = calculateInflationAdjustedIncome(
      schemaPerson.cppAmount,
      cppStart,
      currentYear,
      inflationRate,
      simulationEpochYear
    );

    // 3. OAS Income
    const oasStart = deriveYear(
      {
        year: schemaPerson.oasStartYear,
        age: schemaPerson.oasStartAge,
        birthYear: schemaPerson.birthYear,
      },
      GOVERNMENT_BENEFITS.OAS.MIN_AGE
    );

    person.income.oas = 
      person.age >= GOVERNMENT_BENEFITS.OAS.MIN_AGE
        ? calculateInflationAdjustedIncome(
            schemaPerson.oasAmount,
            oasStart,
            currentYear,
            inflationRate,
            simulationEpochYear
          )
        : 0;

    // 4. Defined Benefit Pension
    const dbStart = deriveYear(
      {
        year: schemaPerson.definedBenefitPensionStartYear,
        age: schemaPerson.definedBenefitPensionStartAge,
        birthYear: schemaPerson.birthYear,
      },
      schemaPerson.definedBenefitPensionAmount != null ? GOVERNMENT_BENEFITS.OAS.MIN_AGE : undefined
    );

    if (schemaPerson.definedBenefitPensionAmount != null && dbStart != null && currentYear >= dbStart) {
      const baseAmount = schemaPerson.definedBenefitPensionAmount;
      person.income.definedBenefit = schemaPerson.definedBenefitPensionIndexedToInflation
        ? adjustForInflation(baseAmount, dbStart, currentYear, inflationRate)
        : baseAmount;
    } else {
      person.income.definedBenefit = 0;
    }

    // 5. Other Income
    person.income.other = (input.otherIncomes ?? [])
      .filter(
        (inc) =>
          inc.personType === schemaPerson.personType &&
          inc.startYear &&
          inc.endYear &&
          currentYear >= inc.startYear &&
          currentYear <= inc.endYear
      )
      .map((inc) => ({
        amount: inc.amount ?? 0,
        description: inc.description ?? "",
      }));
  }

  // Process all persons
  newState.persons.forEach(processPersonIncome);

  return newState;
}

/**
 * Calculate total income for a person from all sources
 */
export function calculateTotalIncome(person: PersonState): number {
  return (
    person.income.employment +
    person.income.cpp +
    person.income.oas +
    person.income.definedBenefit +
    (person.income.interest || 0) +
    (person.income.eligibleDividends || 0) +
    person.income.other.reduce((sum, inc) => sum + inc.amount, 0)
  );
}

/**
 * Calculate total income excluding investment income (which is already deposited)
 */
function calculateNonInvestmentIncome(person: PersonState): number {
  return (
    person.income.employment +
    person.income.cpp +
    person.income.oas +
    person.income.definedBenefit +
    person.income.other.reduce((sum, inc) => sum + inc.amount, 0)
  );
}

/**
 * Adds the calculated yearly income for each person to their non-registered accounts.
 * Note: Investment income (interest/dividends) is already deposited in applyInvestmentReturns
 */
export function applyYearlyIncomeToAccounts(
  currentState: YearState
): YearState {
  const newState = deepClone(currentState);
  newState.persons.forEach((person) => {
    const totalPersonIncome = calculateNonInvestmentIncome(person);
    if (totalPersonIncome > 0) {
      person.accounts.nonRegistered.marketValue += totalPersonIncome;
      person.accounts.nonRegistered.bookValue += totalPersonIncome;
    }
  });
  return newState;
}

// Helper functions to reduce redundancy

/**
 * Derives a year from either a direct year value or age + birthYear
 * @param yearOrAge Object containing year, age, and birthYear
 * @param defaultAge Optional default age to use if no year or age provided
 */
function deriveYear(yearOrAge: YearOrAge, defaultAge?: number): number | null {
  if (yearOrAge.year != null) {
    return yearOrAge.year;
  }
  
  if (yearOrAge.age != null && yearOrAge.birthYear != null) {
    return yearOrAge.birthYear + yearOrAge.age;
  }
  
  if (defaultAge != null && yearOrAge.birthYear != null) {
    return yearOrAge.birthYear + defaultAge;
  }
  
  return null;
}

/**
 * Calculates income for a given year based on start/end constraints
 */
function calculateIncomeForYear(
  baseAmount: number | null | undefined,
  startYear: number | null,
  endYear: number | null,
  currentYear: number
): number {
  if (baseAmount == null) return 0;
  
  let include = true;
  if (startYear != null && currentYear < startYear) include = false;
  if (endYear != null && currentYear > endYear) include = false;
  
  return include ? baseAmount : 0;
}

/**
 * Calculates inflation-adjusted income for government benefits
 */
function calculateInflationAdjustedIncome(
  baseAmount: number | null | undefined,
  startYear: number | null,
  currentYear: number,
  inflationRate: number,
  simulationEpochYear: number
): number {
  if (baseAmount == null || startYear == null || currentYear < startYear) {
    return 0;
  }
  
  const yearToInflateFrom = startYear <= simulationEpochYear ? simulationEpochYear : startYear;
  
  return adjustForInflation(
    baseAmount,
    yearToInflateFrom,
    currentYear,
    inflationRate
  );
}
