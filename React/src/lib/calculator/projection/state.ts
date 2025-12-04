// File: src/lib/calculator/projection/state.ts
import { CalculatorSchemaType } from '@/lib/schema/calculator'
import { PersonState, SchemaPerson, YearState } from './types'
import { adjustForInflation, deepClone } from './utils'
import { createAccountState, createRegisteredAccounts, depositToNonRegistered } from './accounts'

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
        interest: 0,
        eligibleDividends: 0,
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
    primaryResidenceValue: input.primaryResidenceValue || undefined,
    liabilities: { debtBalance: input.startingDebt || 0, interestExpense: 0 },
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
  
  // Carry forward the home value (it will be grown in applyInvestmentReturns)
  newState.primaryResidenceValue = currentState.primaryResidenceValue

  // Note: interestExpense is preserved - it was calculated in applyLiabilityGrowth during runAnnualCalculations
  // and represents the interest incurred during the year that produced this state

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
  
  // Use the grown home value from state, not the original input value
  const houseValue = newState.primaryResidenceValue || input.primaryResidenceValue
  const homeOwnership = input.homeOwnership || 'joint'
  const debt = newState.liabilities?.debtBalance || 0
  const debtRepaid = Math.min(debt, houseValue)
  const netProceeds = Math.max(0, houseValue - debt)

  // Reduce debt first
  if (newState.liabilities) {
    newState.liabilities.debtBalance = debt - debtRepaid
  }

  distributeProceedsToOwners(newState.persons, netProceeds, homeOwnership)
  
  // Clear the home value after sale
  newState.primaryResidenceValue = undefined

  return newState
}

// Helper function to reduce duplication in house sale proceeds distribution
function distributeProceedsToOwners(
  persons: PersonState[],
  amount: number,
  ownership: 'joint' | 'self' | 'spouse'
): void {
  if (ownership === 'joint') {
    // Split proceeds equally between all persons
    const proceedsPerPerson = amount / persons.length
    persons.forEach((person) => {
      depositToNonRegistered(person, proceedsPerPerson)
    })
  } else {
    // Assign proceeds to the specified owner
    const owner = persons.find(person => person.personType === ownership)
    
    if (owner) {
      depositToNonRegistered(owner, amount)
    } else {
      // Fallback to joint ownership if owner not found
      const proceedsPerPerson = amount / persons.length
      persons.forEach((person) => {
        depositToNonRegistered(person, proceedsPerPerson)
      })
    }
  }
}
