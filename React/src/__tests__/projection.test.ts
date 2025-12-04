import { projectNetWorth, projectRetirement } from '../lib/calculator/projection'
import { CalculatorSchemaType } from '@/lib/schema/calculator'
import { createTestScenario, currentYear } from '../lib/test-utils'

describe('Retirement Projection', () => {
  const basicInput = createTestScenario({
    persons: [{ birthYear: currentYear - 30, lifeExpectancy: 90, annualExpenses: 50000 }],
  })

  describe('Input Validation', () => {
    test('throws error if no self person provided', () => {
      const invalidInput: CalculatorSchemaType = { ...basicInput, persons: [] }
      expect(() => projectRetirement(invalidInput)).toThrow("Must have a person of type 'self'")
    })
  })

  describe('Initial State', () => {
    test('creates correct initial state with basic input', () => {
      const states = projectRetirement(basicInput)
      expect(states.length).toBeGreaterThan(0)

      const initialState = states[0]
      expect(initialState.year).toBe(currentYear)
      expect(initialState.persons[0].age).toBe(30)
      expect(initialState.persons[0].expenses).toBe(50000)
      expect(initialState.persons[0].realizedGains).toBe(0)
      expect(initialState.persons[0].taxPaid).toBe(0)
    })
  })

  describe('Single Year Projection', () => {
    test('correctly projects one year forward', () => {
      const states = projectRetirement(basicInput)
      expect(states.length).toBeGreaterThan(1)

      const secondYear = states[1]
      expect(secondYear.year).toBe(currentYear + 1)
      expect(secondYear.persons[0].age).toBe(31)
      expect(secondYear.persons[0].accounts.tfsa.marketValue).toBe(0)
      expect(secondYear.persons[0].accounts.rrsp.marketValue).toBe(0)
      expect(secondYear.persons[0].accounts.nonRegistered.marketValue).toBe(0)
    })
  })

  describe('Net Worth Projection', () => {
    test('handles house sale with self homeOwnership attribution correctly', () => {
      const input = createTestScenario({
        calculateForSpouse: true,
        persons: [
          { birthYear: currentYear - 30, lifeExpectancy: 90, nonRegisteredInvestmentValue: 100000, nonRegisteredInvestmentBookValue: 100000 },
          { personType: 'spouse', birthYear: currentYear - 30, lifeExpectancy: 90, nonRegisteredInvestmentValue: 100000, nonRegisteredInvestmentBookValue: 100000 },
        ],
        primaryResidenceValue: 500000,
        primaryResidenceSell: true,
        primaryResidenceSellYear: currentYear + 10,
        homeOwnership: 'self',
      })

      const states = projectRetirement(input)
      const afterSaleYear = currentYear + 11
      const houseSaleYear = states.find(state => state.year === afterSaleYear)

      console.log('Looking for house sale in year:', currentYear + 10)
      console.log('Initial non-registered amounts:')
      console.log(`  Self: ${states[0].persons[0].accounts.nonRegistered.marketValue}`)
      console.log(`  Spouse: ${states[0].persons[1].accounts.nonRegistered.marketValue}`)

      if (houseSaleYear) {
        const initialGrowth = Math.pow(1.04, 11)
        const additionalYearGrowth = 1.04
        const grownHouseValue = 500000 * Math.pow(1.04, 11)

        const selfNonRegValue = houseSaleYear.persons[0].accounts.nonRegistered.marketValue
        const expectedSelfValue = 100000 * initialGrowth * additionalYearGrowth + grownHouseValue * additionalYearGrowth
        expect(selfNonRegValue).toBeCloseTo(expectedSelfValue, -1)

        const spouseNonRegValue = houseSaleYear.persons[1].accounts.nonRegistered.marketValue
        const expectedSpouseValue = 100000 * initialGrowth * additionalYearGrowth
        expect(spouseNonRegValue).toBeCloseTo(expectedSpouseValue, -1)
      }
    })

    test('handles house sale with spouse homeOwnership attribution correctly', () => {
      const input = createTestScenario({
        calculateForSpouse: true,
        persons: [
          { birthYear: currentYear - 30, lifeExpectancy: 90, nonRegisteredInvestmentValue: 100000, nonRegisteredInvestmentBookValue: 100000 },
          { personType: 'spouse', birthYear: currentYear - 30, lifeExpectancy: 90, nonRegisteredInvestmentValue: 100000, nonRegisteredInvestmentBookValue: 100000 },
        ],
        primaryResidenceValue: 500000,
        primaryResidenceSell: true,
        primaryResidenceSellYear: currentYear + 10,
        homeOwnership: 'spouse',
      })

      const states = projectRetirement(input)
      const afterSaleYear = currentYear + 11
      const houseSaleYear = states.find(state => state.year === afterSaleYear)

      if (houseSaleYear) {
        const initialGrowth = Math.pow(1.04, 11)
        const additionalYearGrowth = 1.04
        const grownHouseValue = 500000 * Math.pow(1.04, 11)

        const selfNonRegValue = houseSaleYear.persons[0].accounts.nonRegistered.marketValue
        const expectedSelfValue = 100000 * initialGrowth * additionalYearGrowth
        expect(selfNonRegValue).toBeCloseTo(expectedSelfValue, -1)

        const spouseNonRegValue = houseSaleYear.persons[1].accounts.nonRegistered.marketValue
        const expectedSpouseValue = 100000 * initialGrowth * additionalYearGrowth + grownHouseValue * additionalYearGrowth
        expect(spouseNonRegValue).toBeCloseTo(expectedSpouseValue, -1)
      }
    })

    test('calculates net worth correctly', () => {
      const inputWithAssets = createTestScenario({
        persons: [{
          birthYear: currentYear - 30,
          lifeExpectancy: 90,
          registeredInvestments: [{ id: 1, accountType: 'TFSA', currentValue: 50000 }],
          nonRegisteredInvestmentValue: 100000,
          nonRegisteredInvestmentBookValue: 80000,
        }],
        primaryResidenceValue: 500000,
      })

      const projection = projectNetWorth(inputWithAssets)
      expect(projection.length).toBeGreaterThan(0)

      const initialPoint = projection[0]
      expect(initialPoint.year).toBe(currentYear)
      expect(initialPoint.netWorth).toBe(156000) // (50k + 100k) * 1.04

      console.log('Initial net worth:', initialPoint.netWorth)
      console.log('After 20 years:', projection[20].netWorth)
      console.log('After 40 years:', projection[40].netWorth)

      const finalPoint = projection[projection.length - 1]
      console.log('Final net worth:', finalPoint.netWorth)
      expect(finalPoint.year).toBe(currentYear + 60)

      const expectedFinalNetWorth = Math.round(150000 * Math.pow(1.04, 61))
      expect(finalPoint.netWorth).toBe(expectedFinalNetWorth)
    })
  })

  describe('Registered Investments', () => {
    test('handles registered investments correctly', () => {
      const input = createTestScenario({
        persons: [{
          birthYear: currentYear - 30,
          lifeExpectancy: 90,
          registeredInvestments: [{ id: 1, accountType: 'TFSA', currentValue: 50000 }],
          nonRegisteredInvestmentValue: 100000,
          nonRegisteredInvestmentBookValue: 80000,
        }],
      })

      const states = projectRetirement(input)
      expect(states.length).toBeGreaterThan(0)

      const initialState = states[0]
      expect(initialState.persons[0].accounts.tfsa.marketValue).toBe(52000)
      expect(initialState.persons[0].accounts.nonRegistered.marketValue).toBe(104000)
      expect(initialState.persons[0].accounts.nonRegistered.bookValue).toBe(82000)
    })
  })
})
