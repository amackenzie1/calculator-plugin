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
  contributionRoom: {
    rrsp: number
    tfsa: number
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

const BASE_YEAR = 2024 // Update this each year
const BASE_OAS_CLAWBACK_THRESHOLD = 86912 // 2024 value
const BASE_OAS_MAXIMUM_BENEFIT = 8000 // 2024 value - quarterly amount * 4
const CPP_NORMAL_RETIREMENT_AGE = 65
const CPP_EARLY_REDUCTION_RATE = 0.006 // 0.6% per month
const CPP_LATE_INCREASE_RATE = 0.007 // 0.7% per month
const BASE_CPP_MAXIMUM_BENEFIT = 15043 // 2024 value

// Add these constants for RRSP withholding
const RRSP_WITHHOLDING_RATES = {
  UNDER_5000: 0.1, // 10% on first $5,000
  UNDER_15000: 0.2, // 20% on $5,000-$15,000
  OVER_15000: 0.3, // 30% on amounts over $15,000
}

// Add these constants for pension splitting
// const PENSION_INCOME_SPLITTING_MAX = 0.5 // Can split up to 50% of eligible pension income
const PENSION_INCOME_ELIGIBLE_AGE = 65 // Age at which RRIF/LIF income becomes eligible

// Add these constants for contribution limits
const BASE_TFSA_CONTRIBUTION_LIMIT = 7000 // 2024 value
const RRSP_CONTRIBUTION_LIMIT_PERCENT = 0.18
const BASE_RRSP_CONTRIBUTION_LIMIT = 31560 // 2024 value

// Add these constants for LIRA/LIF
const LIRA_TO_LIF_CONVERSION_AGE = 55 // Minimum age to convert LIRA to LIF
const LIF_MIN_WITHDRAWAL_RATES: { [age: number]: number } = {
  55: 0.0285,
  56: 0.0288,
  57: 0.0291,
  58: 0.0295,
  59: 0.0299,
  60: 0.0304,
  61: 0.0309,
  62: 0.0314,
  63: 0.032,
  64: 0.0326,
  65: 0.0333,
  // ... rates continue similar to RRIF rates
  90: 0.0615,
  91: 0.0666,
  92: 0.0726,
  93: 0.0798,
  94: 0.0885,
  95: 0.0992,
}

const LIF_MAX_WITHDRAWAL_PERCENT = 0.2 // Maximum withdrawal of 20% per year

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
  amount: number,
  accountType?: 'rrsp' | 'rrif' | 'tfsa' | 'nonRegistered'
): {
  withdrawn: number
  remaining: number
  realizedGains: number
  withholdingTax: number
} {
  const available = Math.min(account.marketValue, amount)
  const oldMarketValue = account.marketValue
  account.marketValue -= available

  let realizedGains = 0
  let withholdingTax = 0

  // Calculate withholding tax for RRSP/RRIF withdrawals
  if (accountType === 'rrsp' || accountType === 'rrif') {
    if (available <= 5000) {
      withholdingTax = available * RRSP_WITHHOLDING_RATES.UNDER_5000
    } else if (available <= 15000) {
      withholdingTax = available * RRSP_WITHHOLDING_RATES.UNDER_15000
    } else {
      withholdingTax = available * RRSP_WITHHOLDING_RATES.OVER_15000
    }
  }

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
    withholdingTax,
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

    // 2. CPP with early/late retirement adjustments
    if (
      schemaPerson.cppAmount &&
      schemaPerson.cppStartYear &&
      currentYear >= schemaPerson.cppStartYear
    ) {
      // Calculate age when CPP started
      const cppStartAge =
        schemaPerson.cppStartYear - (schemaPerson.birthYear || 0)

      // Calculate adjustment factor
      let adjustmentFactor = 1.0
      const monthsFromNormal = (cppStartAge - CPP_NORMAL_RETIREMENT_AGE) * 12

      if (monthsFromNormal < 0) {
        // Early retirement reduction
        adjustmentFactor = 1.0 + monthsFromNormal * CPP_EARLY_REDUCTION_RATE
      } else if (monthsFromNormal > 0) {
        // Late retirement increase
        adjustmentFactor = 1.0 + monthsFromNormal * CPP_LATE_INCREASE_RATE
      }

      // Calculate inflation adjusted maximum
      const inflationAdjustedMax = adjustForInflation(
        BASE_CPP_MAXIMUM_BENEFIT,
        BASE_YEAR
      )

      // Apply adjustments and cap at maximum
      const baseAmount = schemaPerson.cppAmount
      const adjustedAmount = baseAmount * adjustmentFactor
      const finalAmount = Math.min(
        adjustedAmount,
        inflationAdjustedMax * adjustmentFactor
      )

      person.income.cpp = adjustForInflation(
        finalAmount,
        schemaPerson.cppStartYear
      )
    }

    // 3. OAS with maximum benefit cap
    if (
      schemaPerson.oasAmount &&
      schemaPerson.oasStartYear &&
      currentYear >= schemaPerson.oasStartYear
    ) {
      // Calculate inflation adjusted maximum
      const inflationAdjustedMax = adjustForInflation(
        BASE_OAS_MAXIMUM_BENEFIT,
        BASE_YEAR
      )

      const baseAmount = Math.min(
        schemaPerson.oasAmount,
        BASE_OAS_MAXIMUM_BENEFIT
      )
      person.income.oas = Math.min(
        adjustForInflation(baseAmount, schemaPerson.oasStartYear),
        inflationAdjustedMax
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

  // Apply pension income splitting if there's a spouse
  if (Object.keys(newState.persons).length === 2) {
    const self = newState.persons.self
    const spouse = newState.persons.spouse

    // Function to get eligible pension income
    function getEligiblePensionIncome(person: PersonState): number {
      let eligible = person.income.definedBenefit

      // RRIF/LIF income is eligible if 65 or older
      if (person.age >= PENSION_INCOME_ELIGIBLE_AGE) {
        eligible += newState.withdrawals.rrif / 2 // Divide by 2 since withdrawals are currently split equally
      }

      return eligible
    }

    // Calculate eligible pension income for both
    const selfEligible = getEligiblePensionIncome(self)
    const spouseEligible = getEligiblePensionIncome(spouse)

    // Optimize splitting to minimize total tax
    let bestTotalTax = Infinity
    let bestSplitPercent = 0

    const splitPercentages = [0, 0.25, 0.5]
    splitPercentages.forEach((splitPercent) => {
      // Create temporary state to test this split
      const testState = deepClone(newState)
      const testSelf = testState.persons.self
      const testSpouse = testState.persons.spouse

      // Apply split
      const selfSplitAmount = selfEligible * splitPercent
      testSelf.income.definedBenefit -= selfSplitAmount
      testSpouse.income.definedBenefit += selfSplitAmount

      const spouseSplitAmount = spouseEligible * splitPercent
      testSpouse.income.definedBenefit -= spouseSplitAmount
      testSelf.income.definedBenefit += spouseSplitAmount

      // Calculate total tax with this split
      const totalTax = calculateTotalTax(testState, input)

      if (totalTax < bestTotalTax) {
        bestTotalTax = totalTax
        bestSplitPercent = splitPercent
      }
    })

    // Apply the best split
    const selfSplitAmount = selfEligible * bestSplitPercent
    self.income.definedBenefit -= selfSplitAmount
    spouse.income.definedBenefit += selfSplitAmount

    const spouseSplitAmount = spouseEligible * bestSplitPercent
    spouse.income.definedBenefit -= spouseSplitAmount
    self.income.definedBenefit += spouseSplitAmount
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

  // Process RRSP to RRIF conversions, LIRA to LIF conversions, and mandatory withdrawals
  Object.values(newState.persons).forEach((person) => {
    // Convert RRSP to RRIF at age 71
    if (person.age === 71 && person.accounts.rrsp.marketValue > 0) {
      person.accounts.rrif.marketValue = person.accounts.rrsp.marketValue
      person.accounts.rrif.bookValue = person.accounts.rrsp.bookValue
      person.accounts.rrsp.marketValue = 0
      person.accounts.rrsp.bookValue = 0
    }

    // Convert LIRA to LIF at minimum age if requested
    if (
      person.age >= LIRA_TO_LIF_CONVERSION_AGE &&
      person.accounts.lira.marketValue > 0
    ) {
      person.accounts.lif.marketValue = person.accounts.lira.marketValue
      person.accounts.lif.bookValue = person.accounts.lira.bookValue
      person.accounts.lira.marketValue = 0
      person.accounts.lira.bookValue = 0
    }

    // Calculate and apply mandatory RRIF withdrawal
    if (person.age >= 71 && person.accounts.rrif.marketValue > 0) {
      const rate = RRIF_MIN_WITHDRAWAL_RATES[Math.min(person.age, 95)] || 0.2
      const mandatoryWithdrawal = person.accounts.rrif.marketValue * rate
      person.accounts.rrif.marketValue -= mandatoryWithdrawal
      newState.withdrawals.rrif += mandatoryWithdrawal
    }

    // Calculate and apply mandatory LIF withdrawal
    if (
      person.age >= LIRA_TO_LIF_CONVERSION_AGE &&
      person.accounts.lif.marketValue > 0
    ) {
      const minRate =
        LIF_MIN_WITHDRAWAL_RATES[Math.min(person.age, 95)] || 0.0992
      const maxRate = LIF_MAX_WITHDRAWAL_PERCENT

      // Take minimum required withdrawal, but cap at maximum allowed
      const lifWithdrawal = Math.min(
        person.accounts.lif.marketValue * minRate,
        person.accounts.lif.marketValue * maxRate
      )

      person.accounts.lif.marketValue -= lifWithdrawal
      // Add to RRIF withdrawals since they're treated similarly for tax purposes
      newState.withdrawals.rrif += lifWithdrawal
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
        remainingNeeded,
        'tfsa'
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
          remainingNeeded,
          'nonRegistered'
        )
        newState.withdrawals.nonRegistered += withdrawn
        newState.realizedGains += realizedGains
        remainingNeeded = remaining
        if (remainingNeeded === 0) break
      }
    }

    // 3. RRSP/RRIF Withdrawals (now with withholding tax)
    if (remainingNeeded > 0) {
      for (const person of Object.values(newState.persons)) {
        // Try RRSP first if under 71
        if (person.age < 71) {
          const { withdrawn, remaining, withholdingTax } = withdrawFromAccount(
            person.accounts.rrsp,
            remainingNeeded,
            'rrsp'
          )
          newState.withdrawals.rrsp += withdrawn
          newState.taxPaid += withholdingTax // Add withholding tax
          remainingNeeded = remaining
        }

        // Then RRIF if needed
        if (remainingNeeded > 0) {
          const { withdrawn, remaining, withholdingTax } = withdrawFromAccount(
            person.accounts.rrif,
            remainingNeeded,
            'rrif'
          )
          newState.withdrawals.rrif += withdrawn
          newState.taxPaid += withholdingTax // Add withholding tax
          remainingNeeded = remaining
        }

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
  const inflationRate = (input.inflationRate || 2.5) / 100

  // Calculate inflation adjusted clawback threshold
  const yearsSinceBase = currentState.year - BASE_YEAR
  const clawbackThreshold =
    BASE_OAS_CLAWBACK_THRESHOLD * Math.pow(1 + inflationRate, yearsSinceBase)
  const CLAWBACK_RATE = 0.15

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

    // Apply OAS clawback with inflation-adjusted threshold
    if (totalTaxableIncome > clawbackThreshold) {
      const clawback = Math.min(
        income.oas,
        (totalTaxableIncome - clawbackThreshold) * CLAWBACK_RATE
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
      contributionRoom: {
        rrsp: 0, // Will be updated in first year
        tfsa: 0, // Will be updated in first year
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
  // 1. Handle house sale if applicable (moved to first step)
  let withHouseSale = currentState
  if (
    input.primaryResidenceValue &&
    input.primaryResidenceSell &&
    input.primaryResidenceSellYear === currentState.year
  ) {
    withHouseSale = deepClone(currentState)
    // Add house sale proceeds to non-registered investments, split between persons if spouse exists
    const numPersons = Object.keys(withHouseSale.persons).length
    const proceedsPerPerson = input.primaryResidenceValue / numPersons

    Object.values(withHouseSale.persons).forEach((person) => {
      person.accounts.nonRegistered.marketValue += proceedsPerPerson
      person.accounts.nonRegistered.bookValue += proceedsPerPerson
    })
  }

  // 2. Apply investment returns (now includes house sale proceeds if applicable)
  const withReturns = applyInvestmentReturns(withHouseSale, input)

  // 3. Calculate income for the year
  const withIncome = calculateYearlyIncome(withReturns, input)

  // 4. Update contribution room before withdrawals
  const withUpdatedRoom = updateContributionRoom(withIncome, input)

  // 5. Calculate required withdrawals for expenses
  const withWithdrawals = calculateRequiredWithdrawals(withUpdatedRoom, input)

  // 6. Apply tax implications
  const withTax = calculateTaxImplications(withWithdrawals, input)

  // 7. Age everyone one year
  return ageOneYear(withTax)
}

function updateContributionRoom(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  const newState = deepClone(currentState)
  const inflationRate = (input.inflationRate || 2.5) / 100
  const yearsSinceBase = currentState.year - BASE_YEAR

  // Calculate inflation adjusted limits
  const tfsaLimit =
    BASE_TFSA_CONTRIBUTION_LIMIT * Math.pow(1 + inflationRate, yearsSinceBase)
  const rrspMaxLimit =
    BASE_RRSP_CONTRIBUTION_LIMIT * Math.pow(1 + inflationRate, yearsSinceBase)

  Object.values(newState.persons).forEach((person) => {
    // Update TFSA room
    // Add annual limit and any withdrawals from previous year
    person.contributionRoom.tfsa +=
      tfsaLimit +
      currentState.withdrawals.tfsa / Object.keys(currentState.persons).length

    // Update RRSP room based on previous year's earned income
    const earnedIncome = person.income.employment
    const newRrspRoom = Math.min(
      earnedIncome * RRSP_CONTRIBUTION_LIMIT_PERCENT,
      rrspMaxLimit
    )

    // Add new room and any withdrawals (which can be recontributed next year)
    person.contributionRoom.rrsp +=
      newRrspRoom +
      currentState.withdrawals.rrsp / Object.keys(currentState.persons).length
  })

  return newState
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

    // Add primary residence value if it exists and hasn't been sold yet
    if (data.primaryResidenceValue) {
      if (
        !data.primaryResidenceSell ||
        !data.primaryResidenceSellYear ||
        state.year <= data.primaryResidenceSellYear
      ) {
        // Include house value up to and including the sale year
        // The sale proceeds will already be in the investment accounts
        netWorth += data.primaryResidenceValue
      }
    }

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

// Helper function to calculate total income for a person
function calculateTotalIncome(person: PersonState): number {
  return (
    person.income.employment +
    person.income.cpp +
    person.income.oas +
    person.income.definedBenefit +
    person.income.other.reduce((sum, inc) => sum + inc.amount, 0)
  )
}

// Helper function to calculate total tax for a state
function calculateTotalTax(
  state: YearState,
  input: CalculatorSchemaType
): number {
  const taxableIncomes = Object.values(state.persons).map((person) => {
    const income = calculateTotalIncome(person)
    const withdrawals =
      (state.withdrawals.rrsp + state.withdrawals.rrif) /
      Object.keys(state.persons).length
    return income + withdrawals
  })

  return taxableIncomes.reduce(
    (total, income) => total + calculateTax(income, input.province),
    0
  )
}
