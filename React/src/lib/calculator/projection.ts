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
    self: PersonState
    spouse?: PersonState
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

function applyInvestmentReturns(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  const newState = structuredClone(currentState)
  const r = input.investmentReturnRate || 0

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

  newState.persons.self = growAccounts(newState.persons.self)
  if ('spouse' in newState.persons && newState.persons.spouse) {
    newState.persons.spouse = growAccounts(newState.persons.spouse)
  }

  return newState
}

function calculateYearlyIncome(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  const newState = structuredClone(currentState)
  const currentYear = newState.year
  const inflationRate = input.inflationRate || 0.025

  // Helper to calculate inflation adjusted amount
  function adjustForInflation(baseAmount: number, startYear: number): number {
    const yearsSinceStart = currentYear - startYear
    return baseAmount * Math.pow(1 + inflationRate, yearsSinceStart)
  }

  // Process each person's income
  function processPersonIncome(
    person: PersonState,
    schemaPerson: SchemaPerson
  ) {
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
    person.income.other = input.otherIncomes
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

  // Process self
  const self = input.persons.find((p) => p.personType === 'self')
  if (self) {
    processPersonIncome(newState.persons.self, self)
  }

  // Process spouse if exists
  const spouse = input.persons.find((p) => p.personType === 'spouse')
  if (spouse && newState.persons.spouse) {
    processPersonIncome(newState.persons.spouse, spouse)
  }

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
  const selfIncome = calculateTotalIncome(newState.persons.self)
  const spouseIncome = newState.persons.spouse
    ? calculateTotalIncome(newState.persons.spouse)
    : 0
  const totalIncome = selfIncome + spouseIncome

  // Calculate inflation adjusted expenses
  const inflationAdjustedExpenses = adjustForInflation(
    newState.expenses,
    currentYear
  )

  // Calculate surplus income after expenses
  const surplusIncome = Math.max(0, totalIncome - inflationAdjustedExpenses)

  // Add surplus to non-registered accounts proportionally based on income contribution
  if (surplusIncome > 0) {
    const selfProportion = selfIncome / totalIncome
    const spouseProportion = spouseIncome / totalIncome

    // Add to self's non-registered account
    const selfSurplus = surplusIncome * selfProportion
    newState.persons.self.accounts.nonRegistered.marketValue += selfSurplus
    newState.persons.self.accounts.nonRegistered.bookValue += selfSurplus

    // Add to spouse's non-registered account if exists
    if (newState.persons.spouse) {
      const spouseSurplus = surplusIncome * spouseProportion
      newState.persons.spouse.accounts.nonRegistered.marketValue +=
        spouseSurplus
      newState.persons.spouse.accounts.nonRegistered.bookValue += spouseSurplus
    }
  }

  return newState
}

function calculateRequiredWithdrawals(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  const newState = structuredClone(currentState)
  const inflationRate = input.inflationRate || 0.025
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

  // Helper to convert RRSP to RRIF at age 71
  function convertRRSPtoRRIF(person: PersonState) {
    if (person.age === 71 && person.accounts.rrsp.marketValue > 0) {
      person.accounts.rrif.marketValue = person.accounts.rrsp.marketValue
      person.accounts.rrif.bookValue = person.accounts.rrsp.bookValue
      person.accounts.rrsp.marketValue = 0
      person.accounts.rrsp.bookValue = 0
    }
  }

  // Helper to calculate mandatory RRIF withdrawal
  function calculateMandatoryRRIFWithdrawal(person: PersonState): number {
    if (person.age < 71 || person.accounts.rrif.marketValue === 0) return 0

    const rate = RRIF_MIN_WITHDRAWAL_RATES[Math.min(person.age, 95)] || 0.2 // 20% for age > 95
    return person.accounts.rrif.marketValue * rate
  }

  // Convert RRSP to RRIF at age 71
  convertRRSPtoRRIF(newState.persons.self)
  if (newState.persons.spouse) {
    convertRRSPtoRRIF(newState.persons.spouse)
  }

  // Calculate mandatory RRIF withdrawals
  const selfMandatoryRRIF = calculateMandatoryRRIFWithdrawal(
    newState.persons.self
  )
  const spouseMandatoryRRIF = newState.persons.spouse
    ? calculateMandatoryRRIFWithdrawal(newState.persons.spouse)
    : 0

  // Track RRIF withdrawals
  newState.withdrawals.rrif = selfMandatoryRRIF + spouseMandatoryRRIF

  // Reduce RRIF account values
  if (selfMandatoryRRIF > 0) {
    newState.persons.self.accounts.rrif.marketValue -= selfMandatoryRRIF
  }
  if (spouseMandatoryRRIF > 0 && newState.persons.spouse) {
    newState.persons.spouse.accounts.rrif.marketValue -= spouseMandatoryRRIF
  }

  // Calculate total income available (including mandatory RRIF withdrawals)
  function calculateTotalIncome(person: PersonState): number {
    return (
      person.income.employment +
      person.income.cpp +
      person.income.oas +
      person.income.definedBenefit +
      person.income.other.reduce((sum, inc) => sum + inc.amount, 0)
    )
  }

  // Calculate total income available
  const selfIncome = calculateTotalIncome(newState.persons.self)
  const spouseIncome = newState.persons.spouse
    ? calculateTotalIncome(newState.persons.spouse)
    : 0
  const totalIncome = selfIncome + spouseIncome + newState.withdrawals.rrif

  // Calculate required additional withdrawals
  let remainingNeeded = Math.max(0, totalExpensesNeeded - totalIncome)

  // Withdrawal strategy (in order of tax efficiency):
  // 1. TFSA (tax-free)
  // 2. Non-registered (only gains are taxed)
  // 3. RRSP/RRIF (fully taxable)

  function withdrawFromAccount(
    account: AccountState,
    amount: number
  ): { withdrawn: number; remaining: number } {
    const available = Math.min(account.marketValue, amount)
    account.marketValue -= available
    if ('bookValue' in account) {
      // For non-registered accounts, adjust book value proportionally
      const proportion = available / account.marketValue
      account.bookValue *= 1 - proportion
    }
    return {
      withdrawn: available,
      remaining: amount - available,
    }
  }

  // 1. TFSA Withdrawals
  if (remainingNeeded > 0) {
    const tfsaWithdrawal = withdrawFromAccount(
      newState.persons.self.accounts.tfsa,
      remainingNeeded
    )
    newState.withdrawals.tfsa = tfsaWithdrawal.withdrawn
    remainingNeeded = tfsaWithdrawal.remaining

    if (remainingNeeded > 0 && newState.persons.spouse) {
      const spouseTfsaWithdrawal = withdrawFromAccount(
        newState.persons.spouse.accounts.tfsa,
        remainingNeeded
      )
      newState.withdrawals.tfsa += spouseTfsaWithdrawal.withdrawn
      remainingNeeded = spouseTfsaWithdrawal.remaining
    }
  }

  // 2. Non-registered Withdrawals
  if (remainingNeeded > 0) {
    const nonRegWithdrawal = withdrawFromAccount(
      newState.persons.self.accounts.nonRegistered,
      remainingNeeded
    )
    newState.withdrawals.nonRegistered = nonRegWithdrawal.withdrawn
    // Track realized gains for tax purposes
    const proportion =
      nonRegWithdrawal.withdrawn /
      newState.persons.self.accounts.nonRegistered.marketValue
    newState.realizedGains +=
      nonRegWithdrawal.withdrawn -
      newState.persons.self.accounts.nonRegistered.bookValue * proportion
    remainingNeeded = nonRegWithdrawal.remaining

    if (remainingNeeded > 0 && newState.persons.spouse) {
      const spouseNonRegWithdrawal = withdrawFromAccount(
        newState.persons.spouse.accounts.nonRegistered,
        remainingNeeded
      )
      newState.withdrawals.nonRegistered += spouseNonRegWithdrawal.withdrawn
      const spouseProportion =
        spouseNonRegWithdrawal.withdrawn /
        newState.persons.spouse.accounts.nonRegistered.marketValue
      newState.realizedGains +=
        spouseNonRegWithdrawal.withdrawn -
        newState.persons.spouse.accounts.nonRegistered.bookValue *
          spouseProportion
      remainingNeeded = spouseNonRegWithdrawal.remaining
    }
  }

  // 3. RRSP/RRIF Withdrawals
  if (remainingNeeded > 0) {
    const rrspWithdrawal = withdrawFromAccount(
      newState.persons.self.accounts.rrsp,
      remainingNeeded
    )
    newState.withdrawals.rrsp = rrspWithdrawal.withdrawn
    remainingNeeded = rrspWithdrawal.remaining

    if (remainingNeeded > 0 && newState.persons.spouse) {
      const spouseRrspWithdrawal = withdrawFromAccount(
        newState.persons.spouse.accounts.rrsp,
        remainingNeeded
      )
      newState.withdrawals.rrsp += spouseRrspWithdrawal.withdrawn
      remainingNeeded = spouseRrspWithdrawal.remaining
    }
  }

  return newState
}

function calculateTaxImplications(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  const newState = structuredClone(currentState)

  // Helper to calculate total taxable income for a person
  function calculateTaxableIncome(
    person: PersonState,
    isSpouse: boolean,
    newState: YearState
  ): number {
    // Sum up all fully taxable income
    const employmentIncome = person.income.employment
    const cppIncome = person.income.cpp
    const oasIncome = person.income.oas
    const dbIncome = person.income.definedBenefit
    const otherIncome = person.income.other.reduce(
      (sum, inc) => sum + inc.amount,
      0
    )

    // Include both RRSP and RRIF withdrawals
    const registeredWithdrawals = isSpouse
      ? (newState.withdrawals.rrsp + newState.withdrawals.rrif) * 0.5 // Assume 50/50 split
      : (newState.withdrawals.rrsp + newState.withdrawals.rrif) * 0.5

    // Capital gains (only 50% taxable)
    const capitalGains = isSpouse
      ? newState.realizedGains * 0.5 // Assume 50/50 split
      : newState.realizedGains * 0.5
    const taxableCapitalGains = capitalGains * 0.5 // Only 50% of gains are taxable

    return (
      employmentIncome +
      cppIncome +
      oasIncome +
      dbIncome +
      otherIncome +
      registeredWithdrawals +
      taxableCapitalGains
    )
  }

  // Calculate OAS clawback
  function calculateOASClawback(netIncome: number, oasAmount: number): number {
    const CLAWBACK_THRESHOLD = 86912 // 2024 threshold
    const CLAWBACK_RATE = 0.15

    if (netIncome <= CLAWBACK_THRESHOLD) return 0

    const excessIncome = netIncome - CLAWBACK_THRESHOLD
    return Math.min(oasAmount, excessIncome * CLAWBACK_RATE)
  }

  // Calculate tax for self
  const selfTaxableIncome = calculateTaxableIncome(
    newState.persons.self,
    false,
    newState
  )
  const selfOASClawback = calculateOASClawback(
    selfTaxableIncome,
    newState.persons.self.income.oas
  )
  newState.persons.self.income.oas -= selfOASClawback

  // Calculate tax for spouse if exists
  let spouseTaxableIncome = 0
  if (newState.persons.spouse) {
    spouseTaxableIncome = calculateTaxableIncome(
      newState.persons.spouse,
      true,
      newState
    )
    const spouseOASClawback = calculateOASClawback(
      spouseTaxableIncome,
      newState.persons.spouse.income.oas
    )
    newState.persons.spouse.income.oas -= spouseOASClawback
  }

  // Calculate total tax using the tax calculator
  const totalTax =
    calculateTax(selfTaxableIncome, input.province) +
    (newState.persons.spouse
      ? calculateTax(spouseTaxableIncome, input.province)
      : 0)

  newState.taxPaid = totalTax

  return newState
}

function ageOneYear(currentState: YearState): YearState {
  const newState = structuredClone(currentState)
  newState.year = currentState.year + 1
  newState.persons.self.age = currentState.persons.self.age + 1
  if ('spouse' in newState.persons && newState.persons.spouse) {
    newState.persons.spouse.age = newState.persons.spouse.age + 1
  }
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
        other: input.otherIncomes
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
      (self.annualRetirementExpenses || 0) +
      (spouse?.annualRetirementExpenses || 0) +
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
  console.log(states)

  // Convert YearState[] to ProjectionDataPoint[]
  return states.map((state) => {
    // Sum up all assets across all accounts for both persons
    let netWorth = 0

    // Add primary residence if it exists
    netWorth += data.primaryResidenceValue || 0

    // Add self's accounts and life insurance
    Object.values(state.persons.self.accounts).forEach((account) => {
      netWorth += account.marketValue
    })
    const self = data.persons.find((p) => p.personType === 'self')
    if (self?.lifeInsuranceDeathBenefit) {
      netWorth += self.lifeInsuranceDeathBenefit
    }

    // Add spouse's accounts and life insurance if they exist
    if (state.persons.spouse) {
      Object.values(state.persons.spouse.accounts).forEach((account) => {
        netWorth += account.marketValue
      })
      const spouse = data.persons.find((p) => p.personType === 'spouse')
      if (spouse?.lifeInsuranceDeathBenefit) {
        netWorth += spouse.lifeInsuranceDeathBenefit
      }
    }
    console.log(netWorth)

    return {
      year: state.year,
      netWorth: Math.round(netWorth),
    }
  })
}
