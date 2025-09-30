// File: src/lib/calculator/projection/tax.ts
import { CalculatorSchemaType } from '@/lib/schema/calculator'
import { calculateTax } from '../tax'
import { GOVERNMENT_BENEFITS, TAX_CONSTANTS, DIVIDEND_RULES } from './constants'
import { YearState } from './types'
import { deepClone } from './utils'

/**
 * Calculate taxable capital gains based on the year and amount
 * Implements the new rules effective January 1, 2026:
 * - 50% inclusion rate for first $250,000
 * - 66.67% (2/3) inclusion rate for amounts over $250,000
 */
function calculateTaxableCapitalGains(capitalGains: number, year: number): number {
  if (year < 2026 || capitalGains <= 0) {
    return capitalGains * TAX_CONSTANTS.PRE_2026_INCLUSION_RATE
  }

  if (capitalGains <= TAX_CONSTANTS.CAPITAL_GAINS_THRESHOLD_2026) {
    return capitalGains * TAX_CONSTANTS.POST_2026_BASE_INCLUSION_RATE
  }

  // For gains over $250,000, split the calculation:
  // First $250,000 at 50%
  // Remainder at 66.67%
  const basePortionTaxable = TAX_CONSTANTS.CAPITAL_GAINS_THRESHOLD_2026 * TAX_CONSTANTS.POST_2026_BASE_INCLUSION_RATE
  const excessAmount = capitalGains - TAX_CONSTANTS.CAPITAL_GAINS_THRESHOLD_2026
  const excessPortionTaxable = excessAmount * TAX_CONSTANTS.POST_2026_HIGH_INCLUSION_RATE

  return basePortionTaxable + excessPortionTaxable
}

export function getCharitableDonationsForYear(
  charitableDonations: CalculatorSchemaType['charitableDonations'],
  year: number
): CalculatorSchemaType['charitableDonations'] {
  return charitableDonations.filter((donation) => donation.startYear && donation.endYear && year >= donation.startYear && year <= donation.endYear)
}

/**
 * Calculates tax implications and applies them to the state
 */
export function calculateTaxImplications(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  const newState = deepClone(currentState)
  const inflationRate = (input.inflationRate ?? 2.5) / 100
  const yearsSinceStart = currentState.year - new Date().getFullYear()
  const currentYear = currentState.year

  // Calculate inflation adjusted OAS clawback threshold
  const clawbackThreshold =
    GOVERNMENT_BENEFITS.OAS.CLAWBACK_THRESHOLD_2024 *
    Math.pow(1 + inflationRate, yearsSinceStart)

  // Calculate charitable donations for the current year
  const charitableDonations = getCharitableDonationsForYear(input.charitableDonations ?? [], currentYear)

  // Helper to compute taxable income and dividend credit for a person
  function computeTaxableIncomeAndDividendCredit(personIndex: number): { taxableIncome: number; fedDividendCredit: number } {
    const person = newState.persons[personIndex]
    const income = person.income
    const eligibleDividends = income.eligibleDividends || 0
    const eligibleDividendsGrossed = eligibleDividends * DIVIDEND_RULES.FED_ELIGIBLE_DIV_GROSS_UP
    const baseIncome =
      income.employment +
      income.cpp +
      income.oas +
      income.definedBenefit +
      (income.interest || 0) +
      eligibleDividendsGrossed +
      income.other.reduce((sum, inc) => sum + inc.amount, 0)

    const registeredWithdrawals = person.withdrawals.rrsp + person.withdrawals.rrif
    const taxableCapitalGains = calculateTaxableCapitalGains(person.realizedGains, currentYear)
    let totalTaxableIncome = baseIncome + registeredWithdrawals + taxableCapitalGains

    // OAS clawback modeled as income reduction (for simplicity)
    if (totalTaxableIncome > clawbackThreshold) {
      const clawback = Math.min(
        income.oas,
        (totalTaxableIncome - clawbackThreshold) * GOVERNMENT_BENEFITS.OAS.CLAWBACK_RATE
      )
      person.income.oas -= clawback
      totalTaxableIncome -= clawback
    }

    const fedDividendCredit = eligibleDividendsGrossed * DIVIDEND_RULES.FED_ELIGIBLE_DIV_CREDIT_RATE
    return { taxableIncome: totalTaxableIncome, fedDividendCredit }
  }

  // Calculate taxable income and credits per person
  const taxablePerPerson = newState.persons.map((_, idx) => computeTaxableIncomeAndDividendCredit(idx))

  // Calculate tax for each person individually
  let totalTax = 0
  newState.persons.forEach((person, index) => {
    const donations = charitableDonations.filter((donation) => donation.personType === person.personType)
    const personTax = calculateTax(
      taxablePerPerson[index].taxableIncome, 
      input.province, 
      donations.reduce((sum, donation) => sum + (donation.amount ?? 0), 0),
      person.age
    )
    // Apply simplified federal eligible dividend tax credit
    const fedDividendCredit = taxablePerPerson[index].fedDividendCredit
    person.taxPaid = Math.max(0, personTax - fedDividendCredit)
    totalTax += person.taxPaid
  })
  
  return newState
}
