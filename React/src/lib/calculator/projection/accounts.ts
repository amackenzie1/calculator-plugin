// File: src/lib/calculator/projection/accounts.ts
import { CalculatorSchemaType } from '@/components/Schema'
import { AccountState, PersonState, SchemaPerson, YearState } from './types'
import { deepClone, getAnnualReturnRate } from './utils'

/**
 * Process a withdrawal from an account, handling market value and book value adjustments
 */
export function withdrawFromAccount(
  account: AccountState,
  amount: number
): { withdrawn: number; remaining: number; realizedGains: number } {
  const available = Math.min(account.marketValue, amount)
  const oldMarketValue = account.marketValue
  account.marketValue -= available

  let realizedGains = 0
  if ('bookValue' in account && oldMarketValue > 0) {
    const proportion = available / oldMarketValue
    const bookValueReduced = account.bookValue * proportion
    account.bookValue *= 1 - proportion
    realizedGains = available - bookValueReduced
  }

  return {
    withdrawn: available,
    remaining: amount - available,
    realizedGains,
  }
}

/**
 * Create an initial account state
 */
export function createAccountState(
  marketValue: number = 0,
  bookValue: number = 0
): AccountState {
  return { marketValue, bookValue }
}

/**
 * Create the registered accounts for a person
 */
export function createRegisteredAccounts(person: SchemaPerson) {
  const accounts = person.registeredInvestments || []
  const registered = {
    tfsa: createAccountState(),
    rrsp: createAccountState(),
    rrif: createAccountState(),
    lira: createAccountState(),
    lif: createAccountState(),
  }

  accounts.forEach((account) => {
    if (account.accountType && account.currentValue) {
      const type = account.accountType.toLowerCase() as keyof typeof registered
      registered[type].marketValue = account.currentValue
      registered[type].bookValue = account.currentValue // For registered accounts, book value equals market value
    }
  })

  return registered
}

/**
 * Apply investment growth to all accounts
 */
export function applyInvestmentReturns(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  const newState = deepClone(currentState)
  // Determine pivot year (last employment year) for growth vs income returns
  const pivotYear = Math.max(
    ...input.persons.map((p) => {
      if (p.incomeYearEnd != null) return p.incomeYearEnd
      if (p.incomeEndAge != null && p.birthYear != null) return p.birthYear + p.incomeEndAge
      return Number.POSITIVE_INFINITY
    })
  )
  // Get annual return rate (percent) and convert to decimal
  const ratePercent = getAnnualReturnRate(input, newState.year, pivotYear)
  const r = ratePercent / 100

  function growAccounts(person: PersonState): PersonState {
    const newAccounts = { ...person.accounts }
    Object.keys(newAccounts).forEach((key) => {
      const account = newAccounts[key as keyof typeof newAccounts]
      account.marketValue *= 1 + r
    })

    return {
      ...person,
      accounts: newAccounts,
    }
  }

  // Process all persons
  newState.persons = newState.persons.map((person) => growAccounts(person))

  return newState
}