// File: src/lib/calculator/projection.ts

import { CalculatorSchemaType } from '@/components/Schema'
import { calculateTax } from './tax'

export interface ProjectionDataPoint {
  year: number
  netWorth: number
}

// Types for our state-based approach
interface AccountState {
  marketValue: number
  bookValue: number // For non-registered accounts
}

interface PersonState {
  age: number
  personType: 'self' | 'spouse' // Add this field
  accounts: {
    nonRegistered: AccountState
    tfsa: AccountState
    rrsp: AccountState
    rrif: AccountState
    lira: AccountState
    lif: AccountState
  }
  income: {
    employment: number
    cpp: number
    oas: number
    definedBenefit: number
    other: Array<{
      amount: number
      description: string
    }>
  }
}

interface YearState {
  year: number
  persons: {
    [key: string]: PersonState // Change to allow any number of people
  }
  realizedGains: number
  taxPaid: number
  expenses: number
  withdrawals: {
    nonRegistered: number
    tfsa: number
    rrsp: number
    rrif: number
  }
}

// Helper type for a person from the schema
type SchemaPerson = NonNullable<CalculatorSchemaType['persons'][number]>

// Add these constants at the top with other interfaces
const RRIF_MIN_WITHDRAWAL_RATES: { [age: number]: number } = {
  71: 0.0528,
  72: 0.054,
  73: 0.0553,
  74: 0.0567,
  75: 0.0582,
  76: 0.0598,
  77: 0.0617,
  78: 0.0636,
  79: 0.0658,
  80: 0.0682,
  81: 0.0708,
  82: 0.0738,
  83: 0.0771,
  84: 0.0808,
  85: 0.0851,
  86: 0.0899,
  87: 0.0955,
  88: 0.1021,
  89: 0.1099,
  90: 0.1192,
  91: 0.1306,
  92: 0.1449,
  93: 0.1634,
  94: 0.1879,
  95: 0.2,
}

function isProjectionComplete(
  states: YearState[],
  input: CalculatorSchemaType
): boolean {
  const currentState = states[states.length - 1]
  const self = input.persons.find((p) => p.personType === 'self')

  if (!self || !self.lifeExpectancy) return true

  const targetAge = self.lifeExpectancy
  return currentState.persons.self.age >= targetAge
}

// Helper function to process withdrawals from an account
function withdrawFromAccount(
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

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

function applyInvestmentReturns(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  const newState = deepClone(currentState)
  const r = (input.investmentReturnRate || 0) / 100

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
  Object.keys(newState.persons).forEach((personType) => {
    newState.persons[personType] = growAccounts(newState.persons[personType])
  })

  return newState
}

function calculateYearlyIncome(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  const newState = deepClone(currentState)
  const currentYear = newState.year
  const inflationRate = (input.inflationRate || 2.5) / 100

  // Helper to calculate inflation adjusted amount
  function adjustForInflation(baseAmount: number, startYear: number): number {
    const yearsSinceStart = currentYear - startYear
    return baseAmount * Math.pow(1 + inflationRate, yearsSinceStart)
  }

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
      person.income.employment = schemaPerson.primaryYearlyIncome || 0
    } else {
      person.income.employment = 0
    }

    // 2. CPP
    if (
      schemaPerson.cppAmount &&
      schemaPerson.cppStartYear &&
      currentYear >= schemaPerson.cppStartYear
    ) {
      person.income.cpp = adjustForInflation(
        schemaPerson.cppAmount,
        schemaPerson.cppStartYear
      )
    }

    // 3. OAS
    if (
      schemaPerson.oasAmount &&
      schemaPerson.oasStartYear &&
      currentYear >= schemaPerson.oasStartYear
    ) {
      person.income.oas = adjustForInflation(
        schemaPerson.oasAmount,
        schemaPerson.oasStartYear
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
              schemaPerson.definedBenefitPensionStartYear
            )
          : baseAmount
    }

    // 5. Other Income
    person.income.other = (input.otherIncomes || [])
      .filter(
        (inc) =>
          inc.personType === schemaPerson.personType &&
          inc.startYear &&
          inc.endYear &&
          currentYear >= inc.startYear &&
          currentYear <= inc.endYear
      )
      .map((inc) => ({
        amount: inc.amount || 0,
        description: inc.description || '',
      }))
  }

  // Process all persons
  Object.values(newState.persons).forEach(processPersonIncome)

  // Calculate total income for each person
  function calculateTotalIncome(person: PersonState): number {
    return (
      person.income.employment +
      person.income.cpp +
      person.income.oas +
      person.income.definedBenefit +
      person.income.other.reduce((sum, inc) => sum + inc.amount, 0)
    )
  }

  // Calculate total income and expenses
  const totalIncome = Object.values(newState.persons).reduce(
    (sum, person) => sum + calculateTotalIncome(person),
    0
  )

  // Calculate inflation adjusted expenses
  const inflationAdjustedExpenses = adjustForInflation(
    newState.expenses,
    currentYear
  )

  // Calculate surplus income after expenses
  const surplusIncome = Math.max(0, totalIncome - inflationAdjustedExpenses)

  // Add surplus to non-registered accounts proportionally based on income contribution
  if (surplusIncome > 0) {
    const totalContribution = Object.values(newState.persons).reduce(
      (sum, person) => sum + calculateTotalIncome(person),
      0
    )
    Object.values(newState.persons).forEach((person) => {
      const proportion = calculateTotalIncome(person) / totalContribution
      const surplus = surplusIncome * proportion
      person.accounts.nonRegistered.marketValue += surplus
      person.accounts.nonRegistered.bookValue += surplus
    })
  }

  return newState
}

function calculateRequiredWithdrawals(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  const newState = deepClone(currentState)
  const inflationRate = (input.inflationRate || 2.5) / 100
  const currentYear = newState.year
  const startYear = new Date().getFullYear()

  // Helper to calculate inflation adjusted expenses
  function adjustForInflation(baseAmount: number): number {
    const yearsSinceStart = currentYear - startYear
    return baseAmount * Math.pow(1 + inflationRate, yearsSinceStart)
  }

  // Calculate regular expenses (inflation adjusted)
  const inflationAdjustedExpenses = adjustForInflation(newState.expenses)

  // Add one-off expenses for the current year
  const oneOffExpensesForYear = (input.oneOffExpenses || [])
    .filter((expense) => expense.year === currentYear && expense.amount)
    .reduce((total, expense) => total + expense.amount!, 0)

  // Total expenses needed this year
  const totalExpensesNeeded = inflationAdjustedExpenses + oneOffExpensesForYear

  // Process RRSP to RRIF conversions and mandatory withdrawals
  Object.values(newState.persons).forEach((person) => {
    // Convert RRSP to RRIF at age 71
    if (person.age === 71 && person.accounts.rrsp.marketValue > 0) {
      person.accounts.rrif.marketValue = person.accounts.rrsp.marketValue
      person.accounts.rrif.bookValue = person.accounts.rrsp.bookValue
      person.accounts.rrsp.marketValue = 0
      person.accounts.rrsp.bookValue = 0
    }

    // Calculate and apply mandatory RRIF withdrawal
    if (person.age >= 71 && person.accounts.rrif.marketValue > 0) {
      const rate = RRIF_MIN_WITHDRAWAL_RATES[Math.min(person.age, 95)] || 0.2
      const mandatoryWithdrawal = person.accounts.rrif.marketValue * rate
      person.accounts.rrif.marketValue -= mandatoryWithdrawal
      newState.withdrawals.rrif += mandatoryWithdrawal
    }
  })

  // Calculate total available income
  const totalIncome =
    Object.values(newState.persons).reduce(
      (sum, person) =>
        sum +
        person.income.employment +
        person.income.cpp +
        person.income.oas +
        person.income.definedBenefit +
        person.income.other.reduce((sum, inc) => sum + inc.amount, 0),
      0
    ) + newState.withdrawals.rrif

  // Calculate required additional withdrawals
  let remainingNeeded = Math.max(0, totalExpensesNeeded - totalIncome)

  // Withdrawal strategy (in order of tax efficiency)
  if (remainingNeeded > 0) {
    // 1. TFSA Withdrawals
    for (const person of Object.values(newState.persons)) {
      const { withdrawn, remaining } = withdrawFromAccount(
        person.accounts.tfsa,
        remainingNeeded
      )
      newState.withdrawals.tfsa += withdrawn
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
        newState.withdrawals.nonRegistered += withdrawn
        newState.realizedGains += realizedGains
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
        newState.withdrawals.rrsp += withdrawn
        remainingNeeded = remaining
        if (remainingNeeded === 0) break
      }
    }
  }

  return newState
}

function calculateTaxImplications(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  const newState = deepClone(currentState)
  const numPersons = Object.keys(newState.persons).length

  // Calculate taxable income and apply OAS clawback for each person
  const taxableIncomes = Object.values(newState.persons).map((person) => {
    const income = person.income
    const baseIncome =
      income.employment +
      income.cpp +
      income.oas +
      income.definedBenefit +
      income.other.reduce((sum, inc) => sum + inc.amount, 0)

    // Split registered withdrawals and capital gains equally
    const registeredWithdrawals =
      (newState.withdrawals.rrsp + newState.withdrawals.rrif) / numPersons
    const capitalGains = newState.realizedGains / numPersons
    const taxableCapitalGains = capitalGains * 0.5

    const totalTaxableIncome =
      baseIncome + registeredWithdrawals + taxableCapitalGains

    // Apply OAS clawback
    const CLAWBACK_THRESHOLD = 86912
    const CLAWBACK_RATE = 0.15
    if (totalTaxableIncome > CLAWBACK_THRESHOLD) {
      const clawback = Math.min(
        income.oas,
        (totalTaxableIncome - CLAWBACK_THRESHOLD) * CLAWBACK_RATE
      )
      person.income.oas -= clawback
    }

    return totalTaxableIncome
  })

  // Calculate total tax
  newState.taxPaid = taxableIncomes.reduce(
    (total, income) => total + calculateTax(income, input.province),
    0
  )

  return newState
}

function ageOneYear(currentState: YearState): YearState {
  const newState = deepClone(currentState)
  newState.year = currentState.year + 1

  // Age all persons
  Object.values(newState.persons).forEach((person) => {
    person.age += 1
  })

  return newState
}

function createInitialState(input: CalculatorSchemaType): YearState {
  const currentYear = new Date().getFullYear()
  const self = input.persons.find((p) => p.personType === 'self')
  const spouse = input.persons.find((p) => p.personType === 'spouse')

  if (!self) {
    throw new Error("Must have a person of type 'self'")
  }

  // Helper to create initial account state
  function createAccountState(
    marketValue: number = 0,
    bookValue: number = 0
  ): AccountState {
    return { marketValue, bookValue }
  }

  // Helper to create registered accounts map
  function createRegisteredAccounts(person: SchemaPerson) {
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
        const type =
          account.accountType.toLowerCase() as keyof typeof registered
        registered[type].marketValue = account.currentValue
        registered[type].bookValue = account.currentValue // For registered accounts, book value equals market value
      }
    })

    return registered
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
        other: (input.otherIncomes || [])
          .filter((inc) => inc.personType === person.personType)
          .map((inc) => ({
            amount: inc.amount || 0,
            description: inc.description || '',
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

export function projectRetirement(input: CalculatorSchemaType): YearState[] {
  const states: YearState[] = []

  // 1. Create initial state from input
  const initialState = createInitialState(input)
  states.push(initialState)

  // 2. Project forward year by year
  while (!isProjectionComplete(states, input)) {
    const nextState = calculateNextYear(states[states.length - 1], input)
    states.push(nextState)
  }

  return states
}

function calculateNextYear(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  // 1. Apply investment returns
  const withReturns = applyInvestmentReturns(currentState, input)

  // 2. Calculate income for the year
  const withIncome = calculateYearlyIncome(withReturns, input)

  // 3. Calculate required withdrawals for expenses
  const withWithdrawals = calculateRequiredWithdrawals(withIncome, input)

  // 4. Apply tax implications
  const withTax = calculateTaxImplications(withWithdrawals, input)

  // 5. Age everyone one year
  return ageOneYear(withTax)
}

export function projectNetWorth(
  data: CalculatorSchemaType
): ProjectionDataPoint[] {
  // Use our new state-based projection system
  const states = projectRetirement(data)

  // Convert YearState[] to ProjectionDataPoint[]
  return states.map((state) => {
    // Sum up all assets across all accounts for both persons
    let netWorth = 0

    // Add primary residence if it exists (assuming no appreciation/depreciation for now)
    netWorth += data.primaryResidenceValue || 0

    // Add all account values from the current state
    Object.values(state.persons).forEach((person) => {
      Object.values(person.accounts).forEach((account) => {
        netWorth += account.marketValue
      })
    })

    // Add life insurance values if they exist
    data.persons.forEach((person) => {
      if (person.lifeInsuranceDeathBenefit) {
        netWorth += person.lifeInsuranceDeathBenefit
      }
    })

    return {
      year: state.year,
      netWorth: Math.round(netWorth),
    }
  })
}
