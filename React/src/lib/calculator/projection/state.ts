// File: src/lib/calculator/projection/state.ts
import { CalculatorSchemaType } from '@/components/Schema'
import { PersonState, SchemaPerson, YearState } from './types'
import { deepClone } from './utils'
import { createAccountState, createRegisteredAccounts } from './accounts'

/**
 * Creates the initial projection state from input data
 */
export function createInitialState(input: CalculatorSchemaType): YearState {
  const currentYear = new Date().getFullYear()
  const self = input.persons.find((p) => p.personType === 'self')
  const spouse = input.persons.find((p) => p.personType === 'spouse')

  if (!self) {
    throw new Error("Must have a person of type 'self'")
  }

  // Helper to create person state
  function createPersonState(person: SchemaPerson): PersonState {
    const registeredAccounts = createRegisteredAccounts(person)
    const currentAge = person.birthYear ? currentYear - person.birthYear : 0

    return {
      age: currentAge,
      personType: person.personType,
      accounts: {
        ...registeredAccounts,
        nonRegistered: createAccountState(
          person.nonRegisteredInvestmentValue || 0,
          person.nonRegisteredInvestmentBookValue || 0
        ),
      },
      income: {
        employment: person.primaryYearlyIncome || 0,
        cpp: person.cppAmount || 0,
        oas: person.oasAmount || 0,
        definedBenefit: person.definedBenefitPensionAmount || 0,
        other: (input.otherIncomes ?? [])
          .filter((inc) => inc.personType === person.personType)
          .map((inc) => ({
            amount: inc.amount ?? 0,
            description: inc.description ?? '',
          })),
      },
    }
  }

  // Create the initial year state
  const yearState: YearState = {
    year: currentYear,
    persons: {
      self: createPersonState(self),
      ...(spouse ? { spouse: createPersonState(spouse) } : {}),
    },
    realizedGains: 0,
    taxPaid: 0,
    expenses:
      (self.annualExpenses || 0) +
      (spouse?.annualExpenses || 0) +
      (self.healthCareExpenses || 0) +
      (spouse?.healthCareExpenses || 0),
    withdrawals: {
      nonRegistered: 0,
      tfsa: 0,
      rrsp: 0,
      rrif: 0,
    },
  }

  return yearState
}

/**
 * Ages all persons by one year
 */
export function ageOneYear(currentState: YearState): YearState {
  const newState = deepClone(currentState)
  newState.year = currentState.year + 1

  // Age all persons
  Object.values(newState.persons).forEach((person) => {
    person.age += 1
  })

  return newState
}

/**
 * Processes house sale if applicable in the current year
 */
export function processHouseSale(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  // Check if house sale applies for this year
  if (
    !input.primaryResidenceValue ||
    !input.primaryResidenceSell ||
    input.primaryResidenceSellYear !== currentState.year
  ) {
    return currentState
  }

  const newState = deepClone(currentState)
  
  // Add house sale proceeds to non-registered investments, split between persons if spouse exists
  const numPersons = Object.keys(newState.persons).length
  const proceedsPerPerson = input.primaryResidenceValue / numPersons

  Object.values(newState.persons).forEach((person) => {
    person.accounts.nonRegistered.marketValue += proceedsPerPerson
    person.accounts.nonRegistered.bookValue += proceedsPerPerson
  })

  return newState
}