// File: src/lib/calculator/projection/accounts.ts
import { CalculatorSchemaType } from '@/lib/schema/calculator'
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
 * Deposit cash to a person's non-registered account, keeping book and market in sync.
 * This intentionally ignores negative amounts to avoid accidental reversals.
 */
export function depositToNonRegistered(person: PersonState, amount: number): void {
  if (amount <= 0) return
  person.accounts.nonRegistered.marketValue += amount
  person.accounts.nonRegistered.bookValue += amount
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
    const newPerson: PersonState = { ...person, accounts: { ...person.accounts } }

    // Get breakdown for non-registered returns (has default in schema)
    const breakdown = input.nonRegisteredReturnBreakdown
    const interestPct: number = breakdown.interest
    const eligibleDivPct: number = breakdown.eligibleDividends
    const capitalGainsPct: number = breakdown.capitalGains

    // Grow registered accounts with full return
    const registeredKeys = ['tfsa', 'rrsp', 'rrif', 'lira', 'lif'] as const
    registeredKeys.forEach((key) => {
      newPerson.accounts[key].marketValue *= 1 + r
    })

    // Handle non-registered separately: split between income and unrealized capital gains
    const nr = newPerson.accounts.nonRegistered
    const startMV = nr.marketValue
    if (startMV > 0 && r > -1) {
      const totalReturnAmt = startMV * r
      const cgAmt = totalReturnAmt * capitalGainsPct
      const interestAmt = totalReturnAmt * interestPct
      const eligibleDivAmt = totalReturnAmt * eligibleDivPct

      // Unrealized capital gains increase market value only
      nr.marketValue += cgAmt

      // Interest and dividends: add as income and deposit cash immediately to non-registered
      newPerson.income.interest = Math.max(0, interestAmt)
      newPerson.income.eligibleDividends = Math.max(0, eligibleDivAmt)
      const cashIncome = newPerson.income.interest + newPerson.income.eligibleDividends
      depositToNonRegistered(newPerson, cashIncome)
    }

    return newPerson
  }

  // Process all persons
  newState.persons = newState.persons.map((person) => growAccounts(person))

  // Apply growth to home value if it exists and hasn't been sold
  if (newState.primaryResidenceValue) {
    // Check if home hasn't been sold yet
    if (!input.primaryResidenceSell || 
        !input.primaryResidenceSellYear || 
        newState.year < input.primaryResidenceSellYear) {
      newState.primaryResidenceValue *= 1 + r
    }
  }

  return newState
}
