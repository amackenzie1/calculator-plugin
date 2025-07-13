// File: src/lib/calculator/projection/tax.ts
import { CalculatorSchemaType } from '@/lib/schema/calculator'
import { calculateTax } from '../tax'
import { GOVERNMENT_BENEFITS, TAX_CONSTANTS } from './constants'
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
    const registeredWithdrawals = person.withdrawals.rrsp + person.withdrawals.rrif
    const capitalGains = person.realizedGains
    const taxableCapitalGains = calculateTaxableCapitalGains(capitalGains, currentYear)

    const totalTaxableIncome =
      baseIncome + registeredWithdrawals + taxableCapitalGains

    // Apply OAS clawback with inflation-adjusted threshold
    if (totalTaxableIncome > clawbackThreshold) {
      const clawback = Math.min(
        income.oas,
        (totalTaxableIncome - clawbackThreshold) *
          GOVERNMENT_BENEFITS.OAS.CLAWBACK_RATE
      )
      person.income.oas -= clawback
    }

    return totalTaxableIncome
  })

  // Calculate tax for each person individually
  let totalTax = 0
  newState.persons.forEach((person, index) => {
    const donations = charitableDonations.filter((donation) => donation.personType === person.personType)
    const personTax = calculateTax(
      taxableIncomes[index], 
      input.province, 
      donations.reduce((sum, donation) => sum + (donation.amount ?? 0), 0),
      person.age
    )
    person.taxPaid = personTax
    totalTax += personTax
  })
  
  return newState
}
