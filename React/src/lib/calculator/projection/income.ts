// File: src/lib/calculator/projection/income.ts
import { CalculatorSchemaType } from "@/components/Schema";
import { GOVERNMENT_BENEFITS } from "./constants";
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

    // Derive employment start and end years (fallback to ages if provided)
    let startYr = schemaPerson.incomeYearStart;
    if (
      startYr == null &&
      schemaPerson.incomeStartAge != null &&
      schemaPerson.birthYear != null
    ) {
      startYr = schemaPerson.birthYear + schemaPerson.incomeStartAge;
    }
    let endYr = schemaPerson.incomeYearEnd;
    if (
      endYr == null &&
      schemaPerson.incomeEndAge != null &&
      schemaPerson.birthYear != null
    ) {
      endYr = schemaPerson.birthYear + schemaPerson.incomeEndAge;
    }
    // 1. Employment Income
    if (schemaPerson.primaryYearlyIncome != null) {
      let include = true;
      if (startYr != null && currentYear < startYr) include = false;
      if (endYr != null && currentYear > endYr) include = false;
      person.income.employment = include ? schemaPerson.primaryYearlyIncome : 0;
    } else {
      person.income.employment = 0;
    }

    // 2. CPP with age or year start
    let cppStart = schemaPerson.cppStartYear;
    if (
      cppStart == null &&
      schemaPerson.cppStartAge != null &&
      schemaPerson.birthYear != null
    ) {
      cppStart = schemaPerson.birthYear + schemaPerson.cppStartAge;
    }
    if (cppStart == null && schemaPerson.birthYear != null) {
      cppStart = schemaPerson.birthYear + GOVERNMENT_BENEFITS.CPP.STANDARD_AGE;
    }

    if (
      schemaPerson.cppAmount != null &&
      cppStart != null &&
      currentYear >= cppStart
    ) {
      const baseCppAmountForStartYear = schemaPerson.cppAmount;

      person.income.cpp = adjustForInflation(
        baseCppAmountForStartYear,
        cppStart,
        currentYear,
        inflationRate
      );
    } else {
      person.income.cpp = 0;
    }

    // 3. OAS with age or year start and minimum age
    let oasStart = schemaPerson.oasStartYear;
    if (
      oasStart == null &&
      schemaPerson.oasStartAge != null &&
      schemaPerson.birthYear != null
    ) {
      oasStart = schemaPerson.birthYear + schemaPerson.oasStartAge;
    }
    if (oasStart == null && schemaPerson.birthYear != null) {
      oasStart = schemaPerson.birthYear + GOVERNMENT_BENEFITS.OAS.MIN_AGE;
    }
    if (
      schemaPerson.oasAmount != null &&
      oasStart != null &&
      currentYear >= oasStart &&
      person.age >= GOVERNMENT_BENEFITS.OAS.MIN_AGE
    ) {
      person.income.oas = adjustForInflation(
        schemaPerson.oasAmount,
        oasStart,
        currentYear,
        inflationRate
      );
    } else {
      person.income.oas = 0;
    }

    // 4. Defined Benefit Pension with age or year start
    let dbStart = schemaPerson.definedBenefitPensionStartYear;
    if (
      dbStart == null &&
      schemaPerson.definedBenefitPensionStartAge != null &&
      schemaPerson.birthYear != null
    ) {
      dbStart =
        schemaPerson.birthYear + schemaPerson.definedBenefitPensionStartAge;
    }
    if (
      dbStart == null &&
      schemaPerson.definedBenefitPensionAmount != null &&
      schemaPerson.birthYear != null
    ) {
      // Default pension start aligns with OAS
      dbStart = schemaPerson.birthYear + GOVERNMENT_BENEFITS.OAS.MIN_AGE;
    }
    if (
      schemaPerson.definedBenefitPensionAmount != null &&
      dbStart != null &&
      currentYear >= dbStart
    ) {
      const baseAmount = schemaPerson.definedBenefitPensionAmount;
      person.income.definedBenefit =
        schemaPerson.definedBenefitPensionIndexedToInflation
          ? adjustForInflation(baseAmount, dbStart, currentYear, inflationRate)
          : baseAmount;
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
    person.income.other.reduce((sum, inc) => sum + inc.amount, 0)
  );
}

/**
 * Adds the calculated yearly income for each person to their non-registered accounts.
 */
export function applyYearlyIncomeToAccounts(
  currentState: YearState
): YearState {
  const newState = deepClone(currentState);
  newState.persons.forEach((person) => {
    const totalPersonIncome = calculateTotalIncome(person); // Uses existing helper
    if (totalPersonIncome > 0) {
      // Ensure account exists, though it should from createInitialState
      if (!person.accounts.nonRegistered) {
        person.accounts.nonRegistered = { marketValue: 0, bookValue: 0 };
      }
      person.accounts.nonRegistered.marketValue += totalPersonIncome;
      person.accounts.nonRegistered.bookValue += totalPersonIncome; // Income received increases book value
    }
  });
  return newState;
}
