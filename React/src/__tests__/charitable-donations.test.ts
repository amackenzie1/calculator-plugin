import { CalculatorSchemaType } from '@/lib/schema/calculator'
import { projectRetirement } from '../lib/calculator/projection'
import { getCharitableDonationsForYear } from '../lib/calculator/projection/tax'
import { createTestScenario, currentYear } from '../lib/test-utils'

describe('Charitable Donations', () => {
  test('getCharitableDonationsForYear filters correctly by year range', () => {
    const donations: CalculatorSchemaType['charitableDonations'] = [
      { id: 1, personType: 'self', amount: 5000, startYear: 2025, endYear: 2030 },
      { id: 2, personType: 'self', amount: 10000, startYear: 2031, endYear: 2035 },
    ]

    expect(getCharitableDonationsForYear(donations, 2027)).toHaveLength(1)
    expect(getCharitableDonationsForYear(donations, 2027)[0].amount).toBe(5000)
    expect(getCharitableDonationsForYear(donations, 2033)).toHaveLength(1)
    expect(getCharitableDonationsForYear(donations, 2033)[0].amount).toBe(10000)
    expect(getCharitableDonationsForYear(donations, 2040)).toHaveLength(0)
  })

  test('charitable donations reduce account balances correctly', () => {
    const inputWithDonations = createTestScenario({
      persons: [{
        birthYear: currentYear - 50,
        annualExpenses: 100000,
        primaryYearlyIncome: 1200000,
        incomeYearStart: currentYear,
        incomeYearEnd: currentYear + 40,
        cppAmount: 16000,
        cppStartYear: currentYear,
        nonRegisteredInvestmentValue: 1000000,
        nonRegisteredInvestmentBookValue: 1000000,
        registeredInvestments: [{ id: 1, accountType: 'RRIF', currentValue: 20000000 }],
      }],
      investmentReturnRate: 5,
      charitableDonations: [{ id: 1, personType: 'self', amount: 100000, startYear: currentYear, endYear: currentYear + 40 }],
      primaryResidenceValue: 1500000,
      primaryResidenceSell: false,
      desiredEstateValue: 20000000,
    })

    const states = projectRetirement(inputWithDonations)
    expect(states.length).toBeGreaterThan(0)

    const firstYear = states[0]
    const secondYear = states[1]

    const totalIncome =
      firstYear.persons[0].income.employment +
      firstYear.persons[0].income.cpp +
      firstYear.persons[0].income.oas +
      firstYear.persons[0].income.definedBenefit +
      firstYear.persons[0].income.interest +
      firstYear.persons[0].income.eligibleDividends

    expect(totalIncome).toBeGreaterThan(1200000)
    expect(firstYear.persons[0].taxPaid).toBeGreaterThan(0)

    const getNetWorth = (state: typeof firstYear) =>
      state.persons[0].accounts.nonRegistered.marketValue +
      state.persons[0].accounts.tfsa.marketValue +
      state.persons[0].accounts.rrsp.marketValue +
      state.persons[0].accounts.rrif.marketValue

    const firstYearNetWorth = getNetWorth(firstYear)
    const secondYearNetWorth = getNetWorth(secondYear)

    expect(secondYearNetWorth).toBeGreaterThan(firstYearNetWorth)

    console.log('First year net worth:', firstYearNetWorth)
    console.log('Second year net worth:', secondYearNetWorth)
    console.log('Net worth increase:', secondYearNetWorth - firstYearNetWorth)
    console.log('First year tax paid:', firstYear.persons[0].taxPaid)
    console.log('First year total income:', totalIncome)
  })

  test('charitable donations are included in total expenses calculation', () => {
    const inputWithDonations = createTestScenario({
      persons: [{ annualExpenses: 50000, nonRegisteredInvestmentValue: 500000, nonRegisteredInvestmentBookValue: 500000 }],
      charitableDonations: [{ id: 1, personType: 'self', amount: 10000, startYear: currentYear, endYear: currentYear + 10 }],
    })

    const statesWithDonations = projectRetirement(inputWithDonations)
    const statesWithoutDonations = projectRetirement({ ...inputWithDonations, charitableDonations: [] })

    const getTotalWithdrawals = (state: typeof statesWithDonations[0]) =>
      state.persons[0].withdrawals.nonRegistered +
      state.persons[0].withdrawals.tfsa +
      state.persons[0].withdrawals.rrsp +
      state.persons[0].withdrawals.rrif

    const totalWithdrawalsWithDonations = getTotalWithdrawals(statesWithDonations[1])
    const totalWithdrawalsWithoutDonations = getTotalWithdrawals(statesWithoutDonations[1])
    const difference = totalWithdrawalsWithDonations - totalWithdrawalsWithoutDonations

    expect(difference).toBeGreaterThan(8000)
    expect(difference).toBeLessThan(12000)

    console.log('Withdrawals with donations:', totalWithdrawalsWithDonations)
    console.log('Withdrawals without donations:', totalWithdrawalsWithoutDonations)
    console.log('Difference:', difference)
  })
})
