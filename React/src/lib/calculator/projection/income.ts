// File: src/lib/calculator/projection/income.ts
import { CalculatorSchemaType } from '@/components/Schema'
import { PersonState, YearState } from './types'
import { deepClone, adjustForInflation } from './utils'
import { GOVERNMENT_BENEFITS } from './constants'

/**
 * Calculates the yearly income for each person and updates the state
 */
export function calculateYearlyIncome(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  const newState = deepClone(currentState)
  const currentYear = newState.year
  const inflationRate = (input.inflationRate ?? 2.5) / 100

  // Process each person's income
  function processPersonIncome(person: PersonState) {
    const schemaPerson = input.persons.find(
      (p) => p.personType === person.personType
    )
    if (!schemaPerson) return

    // 1. Employment Income
    if (
      schemaPerson.incomeYearStart &&
      schemaPerson.incomeYearEnd &&
      currentYear >= schemaPerson.incomeYearStart &&
      currentYear <= schemaPerson.incomeYearEnd
    ) {
      person.income.employment = schemaPerson.primaryYearlyIncome ?? 0
    } else {
      person.income.employment = 0
    }

    // 2. CPP with age adjustments
    if (
      schemaPerson.cppAmount &&
      schemaPerson.cppStartYear &&
      currentYear >= schemaPerson.cppStartYear
    ) {
      let cppAmount = schemaPerson.cppAmount
      const startAge = schemaPerson.cppStartYear - (schemaPerson.birthYear ?? 0)

      // Apply early/late CPP adjustments
      if (startAge < GOVERNMENT_BENEFITS.CPP.STANDARD_AGE) {
        const monthsEarly =
          (GOVERNMENT_BENEFITS.CPP.STANDARD_AGE - startAge) * 12
        cppAmount *=
          1 - monthsEarly * GOVERNMENT_BENEFITS.CPP.REDUCTION_RATE_BEFORE_65
      } else if (startAge > GOVERNMENT_BENEFITS.CPP.STANDARD_AGE) {
        const monthsLate =
          (startAge - GOVERNMENT_BENEFITS.CPP.STANDARD_AGE) * 12
        cppAmount *=
          1 + monthsLate * GOVERNMENT_BENEFITS.CPP.INCREASE_RATE_AFTER_65
      }

      // Apply inflation adjustment to CPP
      person.income.cpp = adjustForInflation(
        cppAmount,
        schemaPerson.cppStartYear,
        currentYear,
        inflationRate
      )
    }

    // 3. OAS with inflation adjustment
    if (
      schemaPerson.oasAmount &&
      schemaPerson.oasStartYear &&
      currentYear >= schemaPerson.oasStartYear &&
      person.age >= GOVERNMENT_BENEFITS.OAS.MIN_AGE
    ) {
      // Apply inflation adjustment to OAS
      person.income.oas = adjustForInflation(
        schemaPerson.oasAmount,
        schemaPerson.oasStartYear,
        currentYear,
        inflationRate
      )
    }

    // 4. Defined Benefit Pension
    if (
      schemaPerson.definedBenefitPensionAmount &&
      schemaPerson.definedBenefitPensionStartYear &&
      currentYear >= schemaPerson.definedBenefitPensionStartYear
    ) {
      const baseAmount = schemaPerson.definedBenefitPensionAmount
      person.income.definedBenefit =
        schemaPerson.definedBenefitPensionIndexedToInflation
          ? adjustForInflation(
              baseAmount,
              schemaPerson.definedBenefitPensionStartYear,
              currentYear,
              inflationRate
            )
          : baseAmount
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
        description: inc.description ?? '',
      }))
  }

  // Process all persons
  newState.persons.forEach(processPersonIncome)

  // Calculate total income and expenses
  const totalIncome = newState.persons.reduce(
    (sum, person) => sum + calculateTotalIncome(person),
    0
  )

  // Add surplus to non-registered accounts proportionally based on income contribution
  if (totalIncome > 0) {
    newState.persons.forEach((person) => {
      person.accounts.nonRegistered.marketValue += totalIncome
      person.accounts.nonRegistered.bookValue += totalIncome
    })
  }

  return newState
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
  )
}