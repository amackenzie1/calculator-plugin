// File: src/lib/calculator/projection/state.ts
import { CalculatorSchemaType } from '@/components/Schema'
import { PersonState, SchemaPerson, YearState } from './types'
import { adjustForInflation, deepClone } from './utils'
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
      taxPaid: 0,
      realizedGains: 0,
      expenses: (person.annualExpenses ?? 0) + (person.healthCareExpenses ?? 0),
      withdrawals: {
        nonRegistered: 0,
        tfsa: 0,
        rrsp: 0,
        rrif: 0,
      },
    }
  }

  // Create the initial year state
  const yearState: YearState = {
    year: currentYear,
    persons: [createPersonState(self), ...(spouse ? [createPersonState(spouse)] : [])],
  }

  return yearState
}

/**
 * Ages all persons by one year
 */
export function ageOneYear(currentState: YearState, input: CalculatorSchemaType): YearState {
  const inflationRate = (input.inflationRate ?? 2.5) / 100
  const newState = deepClone(currentState)
  newState.year = currentState.year + 1

  // Age all persons
  newState.persons.forEach((person) => {
    person.age += 1
  })
  // adjust expenses for inflation
  newState.persons.forEach((person) => {
    person.expenses = adjustForInflation(person.expenses, currentState.year, newState.year, inflationRate)
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
  
  // Distribute house sale proceeds based on home ownership setting
  const houseValue = input.primaryResidenceValue
  const homeOwnership = input.homeOwnership || 'joint'
  
  if (homeOwnership === 'joint') {
    // Split proceeds equally between all persons
    const numPersons = newState.persons.length
    const proceedsPerPerson = houseValue / numPersons
    
    newState.persons.forEach((person) => {
      person.accounts.nonRegistered.marketValue += proceedsPerPerson
      person.accounts.nonRegistered.bookValue += proceedsPerPerson
    })
  } else {
    // Assign proceeds to the specified owner (self or spouse)
    const owner = newState.persons.find(person => person.personType === homeOwnership)
    
    if (owner) {
      owner.accounts.nonRegistered.marketValue += houseValue
      owner.accounts.nonRegistered.bookValue += houseValue
    } else {
      // Fallback to joint ownership if owner not found
      const numPersons = newState.persons.length
      const proceedsPerPerson = houseValue / numPersons
      
      newState.persons.forEach((person) => {
        person.accounts.nonRegistered.marketValue += proceedsPerPerson
        person.accounts.nonRegistered.bookValue += proceedsPerPerson
      })
    }
  }

  return newState
}