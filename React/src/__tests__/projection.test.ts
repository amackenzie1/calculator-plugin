import { CalculatorSchemaType } from '../components/Schema'
import {
  projectNetWorth,
  projectRetirement,
} from '../lib/calculator/projection'

describe('Retirement Projection', () => {
  const currentYear = new Date().getFullYear()

  // Basic test input with minimum required fields
  const basicInput: CalculatorSchemaType = {
    persons: [
      {
        personType: 'self',
        birthYear: currentYear - 30,
        lifeExpectancy: 90,
        annualExpenses: 50000,
      },
    ],
    calculateForSpouse: false,
    investmentReturnRate: 4,
    inflationRate: 2,
    province: 'ON',
  }

  describe('Input Validation', () => {
    test('throws error if no self person provided', () => {
      const invalidInput: CalculatorSchemaType = {
        ...basicInput,
        persons: [],
      }
      expect(() => projectRetirement(invalidInput)).toThrow(
        "Must have a person of type 'self'"
      )
    })
  })

  describe('Initial State', () => {
    test('creates correct initial state with basic input', () => {
      const states = projectRetirement(basicInput)
      expect(states.length).toBeGreaterThan(0)

      const initialState = states[0]
      expect(initialState.year).toBe(currentYear)
      expect(initialState.persons.self.age).toBe(30)
      expect(initialState.expenses).toBe(50000)
      expect(initialState.realizedGains).toBe(0)
      expect(initialState.taxPaid).toBe(0)
    })
  })

  describe('Single Year Projection', () => {
    test('correctly projects one year forward', () => {
      const states = projectRetirement(basicInput)
      expect(states.length).toBeGreaterThan(1)

      const secondYear = states[1]
      expect(secondYear.year).toBe(currentYear + 1)
      expect(secondYear.persons.self.age).toBe(31)

      // With no income or assets, expenses should trigger withdrawals
      expect(secondYear.withdrawals.tfsa).toBe(0) // No TFSA to withdraw from
      expect(secondYear.withdrawals.rrsp).toBe(0) // No RRSP to withdraw from
      expect(secondYear.withdrawals.nonRegistered).toBe(0) // No non-registered to withdraw from
    })
  })

  describe('Net Worth Projection', () => {
    test('calculates net worth correctly', () => {
      // Create a simple test case with no expenses
      const inputWithAssets: CalculatorSchemaType = {
        persons: [
          {
            personType: 'self',
            birthYear: currentYear - 30,
            lifeExpectancy: 90,
            registeredInvestments: [
              {
                id: 1,
                accountType: 'TFSA' as const,
                currentValue: 50000,
              },
            ],
            nonRegisteredInvestmentValue: 100000,
            nonRegisteredInvestmentBookValue: 80000,
          },
        ],
        calculateForSpouse: false,
        investmentReturnRate: 4,
        inflationRate: 2,
        province: 'ON',
        primaryResidenceValue: 500000,
      }

      const projection = projectNetWorth(inputWithAssets)
      expect(projection.length).toBeGreaterThan(0)

      // Check initial point
      const initialPoint = projection[0]
      expect(initialPoint.year).toBe(currentYear)
      expect(initialPoint.netWorth).toBe(650000) // 500k house + 50k TFSA + 100k non-reg

      // Log some intermediate points to understand the growth
      console.log('Initial net worth:', initialPoint.netWorth)

      // Check a few points along the way
      const year20Point = projection[20]
      console.log('After 20 years:', year20Point.netWorth)
      console.log(
        'Expected after 20 years:',
        150000 * Math.pow(1.05, 20) + 500000
      )

      const year40Point = projection[40]
      console.log('After 40 years:', year40Point.netWorth)
      console.log(
        'Expected after 40 years:',
        150000 * Math.pow(1.05, 40) + 500000
      )

      // Check final point (at age 90)
      const finalPoint = projection[projection.length - 1]
      console.log('Final net worth:', finalPoint.netWorth)
      console.log('Expected final:', 150000 * Math.pow(1.04, 60) + 500000)

      expect(finalPoint.year).toBe(currentYear + 60) // From age 30 to 90

      // Calculate expected final value
      const initialInvestments = 50000 + 100000 // TFSA + non-reg
      const expectedInvestmentGrowth = initialInvestments * Math.pow(1.04, 60)
      const expectedFinalNetWorth = Math.round(
        expectedInvestmentGrowth + 500000
      )

      // Allow for small rounding differences (within $1)
      expect(finalPoint.netWorth).toBe(expectedFinalNetWorth)
    })
  })
})
