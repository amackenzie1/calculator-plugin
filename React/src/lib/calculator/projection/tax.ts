// File: src/lib/calculator/projection/tax.ts
import { CalculatorSchemaType } from '@/components/Schema'
import { calculateTax } from '../tax'
import { GOVERNMENT_BENEFITS } from './constants'
import { YearState } from './types'
import { deepClone } from './utils'

/**
 * Calculates tax implications and applies them to the state
 */
export function calculateTaxImplications(
  currentState: YearState,
  input: CalculatorSchemaType
): YearState {
  const newState = deepClone(currentState)
  const numPersons = Object.keys(newState.persons).length
  const inflationRate = (input.inflationRate ?? 2.5) / 100
  const yearsSinceStart = currentState.year - new Date().getFullYear()
  const currentYear = currentState.year

  // Calculate inflation adjusted OAS clawback threshold
  const clawbackThreshold =
    GOVERNMENT_BENEFITS.OAS.CLAWBACK_THRESHOLD_2024 *
    Math.pow(1 + inflationRate, yearsSinceStart)

  // Calculate charitable donations for the current year
  const charitableDonations = (input.charitableDonations ?? [])
    .filter(
      (donation) =>
        donation.startYear &&
        donation.endYear &&
        currentYear >= donation.startYear &&
        currentYear <= donation.endYear
    )
    .reduce((total, donation) => total + (donation.amount ?? 0), 0)

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
    const taxableCapitalGains = capitalGains * 0.5

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

  // Calculate tax for each person, distributing charitable donations equally among persons
  const donationsPerPerson = charitableDonations / numPersons
  
  // Calculate tax for each person individually
  let totalTax = 0
  newState.persons.forEach((person, index) => {
    const personTax = calculateTax(
      taxableIncomes[index], 
      input.province, 
      donationsPerPerson
    )
    person.taxPaid = personTax
    totalTax += personTax
  })
  
  return newState
}
