// File: src/lib/calculator/projection/withdrawals.ts
import { CalculatorSchemaType } from '@/components/Schema'
import { YearState } from './types'
import { deepClone } from './utils'
import { RRIF_MIN_WITHDRAWAL_RATES } from './constants'
import { withdrawFromAccount } from './accounts'
import { calculateTotalIncome } from './income'

/**
 * Gets the appropriate RRIF minimum withdrawal rate based on age
 */
export function getRRIFMinimumRate(age: number, spouseAge?: number): number {
  // Always use the younger age if spouse exists
  const effectiveAge = spouseAge ? Math.min(age, spouseAge) : age

  // No withdrawals required before age 55
  if (effectiveAge < 55) return 0

  // Maximum rate for ages above our table
  if (effectiveAge > 100) return 0.2

  // Return the rate from our table, or default to 0.2 if not found
  return RRIF_MIN_WITHDRAWAL_RATES[effectiveAge] || 0.2
}

export function getAllExpenses(currentState: YearState, input: CalculatorSchemaType): number {
  const inflationAdjustedExpenses = currentState.persons.reduce((sum, person) => sum + person.expenses, 0)
  const oneOffExpensesForYear = (input.oneOffExpenses ?? [])
    .filter((expense) => expense.year === currentState.year && expense.amount)
    .reduce((total, expense) => total + expense.amount!, 0)
  return inflationAdjustedExpenses + oneOffExpensesForYear
}

/**
 * Calculates required withdrawals based on expenses and rules
 */
export function calculateRequiredWithdrawals(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  const newState = deepClone(currentState)
  const currentYear = newState.year

  // Calculate regular expenses (inflation adjusted)
  const inflationAdjustedExpenses = newState.persons.reduce((sum, person) => sum + person.expenses, 0)

  // Add one-off expenses for the current year
  const oneOffExpensesForYear = (input.oneOffExpenses ?? [])
    .filter((expense) => expense.year === currentYear && expense.amount)
    .reduce((total, expense) => total + expense.amount!, 0)
  console.log('oneOffExpensesForYear', oneOffExpensesForYear)

  // Total expenses needed this year
  const totalExpensesNeeded = inflationAdjustedExpenses + oneOffExpensesForYear

  // Get spouse's age if exists for RRIF calculations
  const spouseAge = newState.persons.find((person) => person.personType === 'spouse')?.age

  // Process RRSP to RRIF conversions and mandatory withdrawals
  newState.persons.forEach((person) => {
    // Convert RRSP to RRIF at age 71
    if (person.age === 71 && person.accounts.rrsp.marketValue > 0) {
      person.accounts.rrif.marketValue = person.accounts.rrsp.marketValue
      person.accounts.rrif.bookValue = person.accounts.rrsp.bookValue
      person.accounts.rrsp.marketValue = 0
      person.accounts.rrsp.bookValue = 0
    }

    // Calculate and apply mandatory RRIF withdrawal
    if (person.age >= 55 && person.accounts.rrif.marketValue > 0) {
      // Automatically use spouse's age if younger
      const rate = getRRIFMinimumRate(person.age, spouseAge)

      // Calculate minimum withdrawal based on January 1st value
      const mandatoryWithdrawal = person.accounts.rrif.marketValue * rate

      // Apply the withdrawal
      person.accounts.rrif.marketValue -= mandatoryWithdrawal
      person.withdrawals.rrif += mandatoryWithdrawal
    }
  })

  // Add estimated tax to expenses (using the tax amount calculated in the initial tax estimation step)
  const totalTaxPaid = newState.persons.reduce((sum, person) => sum + person.taxPaid, 0)
  const totalNeeded = totalExpensesNeeded + totalTaxPaid
  console.log('totalTaxPaid', totalTaxPaid, 'totalNeeded', totalNeeded)

  // Calculate required additional withdrawals
  let remainingNeeded = Math.max(0, totalNeeded)

  // Withdrawal strategy (in order of tax efficiency)
  if (remainingNeeded > 0) {
    // 1. TFSA Withdrawals
    for (const person of Object.values(newState.persons)) {
      const { withdrawn, remaining } = withdrawFromAccount(
        person.accounts.tfsa,
        remainingNeeded
      )
      person.withdrawals.tfsa += withdrawn
      remainingNeeded = remaining
      if (remainingNeeded === 0) break
    }

    // 2. Non-registered Withdrawals
    if (remainingNeeded > 0) {
      for (const person of Object.values(newState.persons)) {
        const { withdrawn, remaining, realizedGains } = withdrawFromAccount(
          person.accounts.nonRegistered,
          remainingNeeded
        )
        person.withdrawals.nonRegistered += withdrawn
        person.realizedGains += realizedGains
        remainingNeeded = remaining
        if (remainingNeeded === 0) break
      }
    }

    // 3. RRSP Withdrawals
    if (remainingNeeded > 0) {
      for (const person of Object.values(newState.persons)) {
        const { withdrawn, remaining } = withdrawFromAccount(
          person.accounts.rrsp,
          remainingNeeded
        )
        person.withdrawals.rrsp += withdrawn
        remainingNeeded = remaining
        if (remainingNeeded === 0) break
      }
    }

    // 4. LIF/LIRA Withdrawals (if needed and available)
    if (remainingNeeded > 0) {
      let lifWithdrawals = 0

      for (const person of Object.values(newState.persons)) {
        // Try LIF first
        if (person.accounts.lif.marketValue > 0) {
          const { withdrawn, remaining } = withdrawFromAccount(
            person.accounts.lif,
            remainingNeeded
          )
          // Track LIF withdrawals for reporting purposes
          lifWithdrawals += withdrawn
          remainingNeeded = remaining
          if (remainingNeeded === 0) break
        }
      }

      // Log LIF withdrawals for debugging/reporting
      if (lifWithdrawals > 0) {
        console.log(
          `Year ${currentYear}: LIF withdrawals: $${lifWithdrawals.toFixed(2)}`
        )
      }
    }
  }

  return newState
}