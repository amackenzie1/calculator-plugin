import { CalculatorSchemaType } from '@/lib/schema/calculator'
import { projectRetirement } from '../lib/calculator/projection'
import { getCharitableDonationsForYear } from '../lib/calculator/projection/tax'
import { initializePerson } from '../lib/utils'

describe('Charitable Donations', () => {
  const currentYear = new Date().getFullYear()

  test('getCharitableDonationsForYear filters correctly by year range', () => {
    const donations: CalculatorSchemaType['charitableDonations'] = [
      {
        id: 1,
        personType: 'self',
        amount: 5000,
        startYear: 2025,
        endYear: 2030,
      },
      {
        id: 2,
        personType: 'self',
        amount: 10000,
        startYear: 2031,
        endYear: 2035,
      },
    ]

    // Should return first donation in range
    const donations2027 = getCharitableDonationsForYear(donations, 2027)
    expect(donations2027).toHaveLength(1)
    expect(donations2027[0].amount).toBe(5000)

    // Should return second donation in range
    const donations2033 = getCharitableDonationsForYear(donations, 2033)
    expect(donations2033).toHaveLength(1)
    expect(donations2033[0].amount).toBe(10000)

    // Should return no donations outside range
    const donations2040 = getCharitableDonationsForYear(donations, 2040)
    expect(donations2040).toHaveLength(0)
  })

  test('charitable donations reduce account balances correctly', () => {
    // Test scenario: High income person with charitable donations
    const inputWithDonations: CalculatorSchemaType = {
      persons: [
        {
          ...initializePerson('self'),
          birthYear: currentYear - 50,
          lifeExpectancy: 90,
          annualExpenses: 100000,
          primaryYearlyIncome: 1200000, // $1.2M indexed pension
          incomeYearStart: currentYear,
          incomeYearEnd: currentYear + 40,
          cppAmount: 16000,
          cppStartYear: currentYear,
          nonRegisteredInvestmentValue: 1000000,
          nonRegisteredInvestmentBookValue: 1000000,
          registeredInvestments: [
            {
              id: 1,
              accountType: 'RRIF',
              currentValue: 20000000,
            },
          ],
        },
      ],
      calculateForSpouse: false,
      investmentReturnRate: 5,
      inflationRate: 2,
      province: 'ON',
      otherIncomes: [],
      charitableDonations: [
        {
          id: 1,
          personType: 'self',
          amount: 100000, // $100k charity per year
          startYear: currentYear,
          endYear: currentYear + 40,
        },
      ],
      oneOffExpenses: [],
      investorProfile: null,
      specifyReturn: null,
      primaryResidenceValue: 1500000,
      primaryResidenceSell: false,
      primaryResidenceSellYear: null,
      homeOwnership: 'joint',
      desiredEstateValue: 20000000,
      incomeReturnRate: null,
      growthReturnRate: null,
      borrowingRate: null,
      startingDebt: 0,
      allowHomeBorrowing: false,
      withdrawOnlyNeededFromInvestments: true,
      nonRegisteredReturnBreakdown: {
        interest: 0.2,
        eligibleDividends: 0.3,
        capitalGains: 0.5,
      },
      expensesChangeForEachStage: null,
      expensesChangeForEachStageSpouse: null,
    }

    const states = projectRetirement(inputWithDonations)
    expect(states.length).toBeGreaterThan(0)

    const firstYear = states[0]
    const secondYear = states[1]

    // Verify that:
    // 1. Person has very high income ($1.2M pension + $16k CPP + investment income)
    const totalIncome =
      firstYear.persons[0].income.employment +
      firstYear.persons[0].income.cpp +
      firstYear.persons[0].income.oas +
      firstYear.persons[0].income.definedBenefit +
      firstYear.persons[0].income.interest +
      firstYear.persons[0].income.eligibleDividends

    expect(totalIncome).toBeGreaterThan(1200000)

    // 2. Tax is paid (high income should trigger significant tax)
    expect(firstYear.persons[0].taxPaid).toBeGreaterThan(0)

    // 3. Despite charitable donations, net worth should be increasing
    // (because income >> expenses + donations + taxes)
    const firstYearNetWorth =
      firstYear.persons[0].accounts.nonRegistered.marketValue +
      firstYear.persons[0].accounts.tfsa.marketValue +
      firstYear.persons[0].accounts.rrsp.marketValue +
      firstYear.persons[0].accounts.rrif.marketValue

    const secondYearNetWorth =
      secondYear.persons[0].accounts.nonRegistered.marketValue +
      secondYear.persons[0].accounts.tfsa.marketValue +
      secondYear.persons[0].accounts.rrsp.marketValue +
      secondYear.persons[0].accounts.rrif.marketValue

    // Net worth should increase (income is much higher than expenses + charity + taxes)
    expect(secondYearNetWorth).toBeGreaterThan(firstYearNetWorth)

    console.log('First year net worth:', firstYearNetWorth)
    console.log('Second year net worth:', secondYearNetWorth)
    console.log('Net worth increase:', secondYearNetWorth - firstYearNetWorth)
    console.log('First year tax paid:', firstYear.persons[0].taxPaid)
    console.log('First year total income:', totalIncome)
  })

  test('charitable donations are included in total expenses calculation', () => {
    const inputWithDonations: CalculatorSchemaType = {
      persons: [
        {
          ...initializePerson('self'),
          birthYear: currentYear - 40,
          lifeExpectancy: 90,
          annualExpenses: 50000,
          nonRegisteredInvestmentValue: 500000,
          nonRegisteredInvestmentBookValue: 500000,
        },
      ],
      calculateForSpouse: false,
      investmentReturnRate: 4,
      inflationRate: 2,
      province: 'ON',
      otherIncomes: [],
      charitableDonations: [
        {
          id: 1,
          personType: 'self',
          amount: 10000,
          startYear: currentYear,
          endYear: currentYear + 10,
        },
      ],
      oneOffExpenses: [],
      investorProfile: null,
      specifyReturn: null,
      primaryResidenceValue: null,
      primaryResidenceSell: null,
      primaryResidenceSellYear: null,
      homeOwnership: 'joint',
      desiredEstateValue: null,
      incomeReturnRate: null,
      growthReturnRate: null,
      borrowingRate: null,
      startingDebt: 0,
      allowHomeBorrowing: false,
      withdrawOnlyNeededFromInvestments: true,
      nonRegisteredReturnBreakdown: {
        interest: 0.2,
        eligibleDividends: 0.3,
        capitalGains: 0.5,
      },
      expensesChangeForEachStage: null,
      expensesChangeForEachStageSpouse: null,
    }

    const statesWithDonations = projectRetirement(inputWithDonations)

    // Compare with scenario without donations
    const inputWithoutDonations: CalculatorSchemaType = {
      ...inputWithDonations,
      charitableDonations: [],
    }

    const statesWithoutDonations = projectRetirement(inputWithoutDonations)

    // The withdrawals should be higher when charitable donations are included
    const totalWithdrawalsWithDonations =
      statesWithDonations[1].persons[0].withdrawals.nonRegistered +
      statesWithDonations[1].persons[0].withdrawals.tfsa +
      statesWithDonations[1].persons[0].withdrawals.rrsp +
      statesWithDonations[1].persons[0].withdrawals.rrif

    const totalWithdrawalsWithoutDonations =
      statesWithoutDonations[1].persons[0].withdrawals.nonRegistered +
      statesWithoutDonations[1].persons[0].withdrawals.tfsa +
      statesWithoutDonations[1].persons[0].withdrawals.rrsp +
      statesWithoutDonations[1].persons[0].withdrawals.rrif

    // With donations, we should withdraw approximately $10k more
    // (approximately because tax treatment differs slightly)
    const difference = totalWithdrawalsWithDonations - totalWithdrawalsWithoutDonations

    expect(difference).toBeGreaterThan(8000) // At least $8k more (accounting for tax credits)
    expect(difference).toBeLessThan(12000) // But not more than $12k

    console.log('Withdrawals with donations:', totalWithdrawalsWithDonations)
    console.log('Withdrawals without donations:', totalWithdrawalsWithoutDonations)
    console.log('Difference:', difference)
  })
})
