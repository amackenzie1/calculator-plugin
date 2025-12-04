import { CalculatorSchemaType } from '@/lib/schema/calculator'
import {
  projectNetWorth,
  projectRetirement,
} from '../lib/calculator/projection'
import { initializePerson } from '../lib/utils'

describe('Retirement Projection', () => {
  const currentYear = new Date().getFullYear()

  // Basic test input with minimum required fields
  const basicInput: CalculatorSchemaType = {
    persons: [
      {
        ...initializePerson('self'),
        birthYear: currentYear - 30,
        lifeExpectancy: 90,
        annualExpenses: 50000,
      },
    ],
    calculateForSpouse: false,
    investmentReturnRate: 4,
    inflationRate: 2,
    province: 'ON',
    otherIncomes: [],
    charitableDonations: [],
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
    nonRegisteredReturnBreakdown: { interest: 0.2, eligibleDividends: 0.3, capitalGains: 0.5 },
    expensesChangeForEachStage: null,
    expensesChangeForEachStageSpouse: null,
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

      // With no income or assets, expenses should trigger withdrawals
      expect(secondYear.persons[0].accounts.tfsa.marketValue).toBe(0) // No TFSA to withdraw from
      expect(secondYear.persons[0].accounts.rrsp.marketValue).toBe(0) // No RRSP to withdraw from
      expect(secondYear.persons[0].accounts.nonRegistered.marketValue).toBe(0) // No non-registered to withdraw from
    })
  })

  describe('Net Worth Projection', () => {
    test('handles house sale with self homeOwnership attribution correctly', () => {
      // Test with self-owned house
      const inputWithSelfOwnedHouse: CalculatorSchemaType = {
        ...basicInput,
        calculateForSpouse: true,
        persons: [
          {
            ...initializePerson('self'),
            birthYear: currentYear - 30,
            lifeExpectancy: 90,
            nonRegisteredInvestmentValue: 100000,
            nonRegisteredInvestmentBookValue: 100000,
          },
          {
            ...initializePerson('spouse'),
            birthYear: currentYear - 30,
            lifeExpectancy: 90,
            nonRegisteredInvestmentValue: 100000,
            nonRegisteredInvestmentBookValue: 100000,
          },
        ],
        primaryResidenceValue: 500000,
        primaryResidenceSell: true,
        primaryResidenceSellYear: currentYear + 10,
        homeOwnership: 'self',
      }
      
      const states = projectRetirement(inputWithSelfOwnedHouse)
      
      // Find the year of the house sale
      // Log all years to find house sale year
      console.log('Looking for house sale in year:', currentYear + 10);
      console.log('Initial non-registered amounts:');
      console.log(`  Self: ${states[0].persons[0].accounts.nonRegistered.marketValue}`);
      console.log(`  Spouse: ${states[0].persons[1].accounts.nonRegistered.marketValue}`);
      
      // We need to check for the year AFTER the sale year, as that's when the proceeds
      // will have been added to the accounts
      const saleYear = currentYear + 10;
      const afterSaleYear = saleYear + 1;
      
      console.log(`Sale happens in ${saleYear}, checking year ${afterSaleYear} for results`);
      
      // Find the year AFTER the sale - this is when the house proceeds will be allocated
      const houseSaleYear = states.find(state => state.year === afterSaleYear);
      console.log('House sale year found:', houseSaleYear ? 'Yes' : 'No');
      
      if (houseSaleYear) {
        console.log('House sale year details:', JSON.stringify(houseSaleYear, null, 2));
        
        // Calculate expected values
        // Since we're checking the year AFTER sale, we need to account for an additional year of growth
        const initialGrowth = Math.pow(1.04, 11); // Growth up to sale year (including first year now)
        const additionalYearGrowth = 1.04; // One more year after sale  
        
        // Self should have both original investment with growth + grown house value with 1 more year of growth
        const selfNonRegValue = houseSaleYear.persons[0].accounts.nonRegistered.marketValue;
        const expectedSelfBaseGrowth = 100000 * initialGrowth; // Original investment growth
        // House value grows for 11 years (2025-2035, including first year's closing balance)
        const grownHouseValue = 500000 * Math.pow(1.04, 11); // House value after 11 years of growth (sold in 2035)
        const expectedHouseProceedsWithGrowth = grownHouseValue * additionalYearGrowth; // House proceeds with 1 more year growth
        const expectedSelfValue = expectedSelfBaseGrowth * additionalYearGrowth + expectedHouseProceedsWithGrowth;
        
        console.log('Self non-registered value:', selfNonRegValue);
        console.log('Expected self value:', expectedSelfValue);
        console.log('Grown house value:', grownHouseValue);
        console.log('Expected house proceeds with growth:', expectedHouseProceedsWithGrowth);
        console.log('Expected self base growth:', expectedSelfBaseGrowth * additionalYearGrowth);
        
        // Use close approximation for floating point comparisons
        expect(selfNonRegValue).toBeCloseTo(expectedSelfValue, -1); // Less precision needed
        
        // Spouse should not have received any house proceeds, just investment growth
        const spouseNonRegValue = houseSaleYear.persons[1].accounts.nonRegistered.marketValue;
        const expectedSpouseValue = 100000 * initialGrowth * additionalYearGrowth;
        
        console.log('Spouse non-registered value:', spouseNonRegValue);
        console.log('Expected spouse value:', expectedSpouseValue);
        
        expect(spouseNonRegValue).toBeCloseTo(expectedSpouseValue, -1); // Less precision needed
      }
    })

    test('handles house sale with spouse homeOwnership attribution correctly', () => {
      // Test with spouse-owned house
      const inputWithSpouseOwnedHouse: CalculatorSchemaType = {
        ...basicInput,
        calculateForSpouse: true,
        persons: [
          {
            ...initializePerson('self'),
            birthYear: currentYear - 30,
            lifeExpectancy: 90,
            nonRegisteredInvestmentValue: 100000,
            nonRegisteredInvestmentBookValue: 100000,
          },
          {
            ...initializePerson('spouse'),
            birthYear: currentYear - 30,
            lifeExpectancy: 90,
            nonRegisteredInvestmentValue: 100000,
            nonRegisteredInvestmentBookValue: 100000,
          },
        ],
        primaryResidenceValue: 500000,
        primaryResidenceSell: true,
        primaryResidenceSellYear: currentYear + 10,
        homeOwnership: 'spouse',
      }
      
      const states = projectRetirement(inputWithSpouseOwnedHouse)
      
      // We need to check for the year AFTER the sale year, as that's when the proceeds
      // will have been added to the accounts
      const saleYear = currentYear + 10;
      const afterSaleYear = saleYear + 1;
      
      // Find the year AFTER the sale - this is when the house proceeds will be allocated
      const houseSaleYear = states.find(state => state.year === afterSaleYear);
      
      if (houseSaleYear) {
        // Calculate expected values
        // Since we're checking the year AFTER sale, we need to account for an additional year of growth
        const initialGrowth = Math.pow(1.04, 11); // Growth up to sale year (including first year now)
        const additionalYearGrowth = 1.04; // One more year after sale  
        
        // Self should only have original investment with growth
        const selfNonRegValue = houseSaleYear.persons[0].accounts.nonRegistered.marketValue;
        const expectedSelfValue = 100000 * initialGrowth * additionalYearGrowth;
        
        // Use close approximation for floating point comparisons
        expect(selfNonRegValue).toBeCloseTo(expectedSelfValue, -1); // Less precision needed
        
        // Spouse should have both original investment with growth + grown house value with 1 more year of growth
        const spouseNonRegValue = houseSaleYear.persons[1].accounts.nonRegistered.marketValue;
        const expectedSpouseBaseGrowth = 100000 * initialGrowth; // Original investment growth
        // House value grows for 11 years (2025-2035, including first year's closing balance)
        const grownHouseValue = 500000 * Math.pow(1.04, 11); // House value after 11 years of growth (sold in 2035)
        const expectedHouseProceedsWithGrowth = grownHouseValue * additionalYearGrowth; // House proceeds with 1 more year growth
        const expectedSpouseValue = expectedSpouseBaseGrowth * additionalYearGrowth + expectedHouseProceedsWithGrowth;
        
        expect(spouseNonRegValue).toBeCloseTo(expectedSpouseValue, -1); // Less precision needed
      }
    })
    
    test('calculates net worth correctly', () => {
      // Create a simple test case with no expenses
      const inputWithAssets: CalculatorSchemaType = {
        persons: [
          {
            ...initializePerson('self'),
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
        otherIncomes: [],
        charitableDonations: [],
    oneOffExpenses: [],
    investorProfile: null,
    specifyReturn: null,
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
    nonRegisteredReturnBreakdown: { interest: 0.2, eligibleDividends: 0.3, capitalGains: 0.5 },
    expensesChangeForEachStage: null,
    expensesChangeForEachStageSpouse: null,
  }

      const projection = projectNetWorth(inputWithAssets)
      expect(projection.length).toBeGreaterThan(0)

      // Check initial point
      const initialPoint = projection[0]
      expect(initialPoint.year).toBe(currentYear)
      // Now showing closing balances: all assets grow by 4%
      // House NOT included (not selling): (50k TFSA + 100k non-reg) * 1.04 = 156000
      expect(initialPoint.netWorth).toBe(156000) // House excluded since not selling

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
      // Home NOT included since not selling
      // Now includes growth for all 61 years (first year is now closing balance)
      const expectedInvestmentGrowth = initialInvestments * Math.pow(1.04, 61)
      const expectedFinalNetWorth = Math.round(expectedInvestmentGrowth)

      // Allow for small rounding differences (within $1)
      expect(finalPoint.netWorth).toBe(expectedFinalNetWorth)
    })
  })

  describe('Registered Investments', () => {
    test('handles registered investments correctly', () => {
      const input: CalculatorSchemaType = {
        ...basicInput,
        persons: [
          {
            ...initializePerson('self'),
            birthYear: currentYear - 30,
            lifeExpectancy: 90,
            registeredInvestments: [
              {
                id: 1,
                accountType: 'TFSA',
                currentValue: 50000,
              },
            ],
            nonRegisteredInvestmentValue: 100000,
            nonRegisteredInvestmentBookValue: 80000,
          },
        ],
      }

      const states = projectRetirement(input)
      expect(states.length).toBeGreaterThan(0)

      const initialState = states[0]
      // Now showing closing balance after 4% return for the first year
      expect(initialState.persons[0].accounts.tfsa.marketValue).toBe(52000) // 50000 * 1.04
      // Non-registered: 100k start, 4% return = 4k total
      // Split: 50% cap gains (2k, unrealized) + 20% interest (0.8k cash) + 30% div (1.2k cash) = 104k market value
      expect(initialState.persons[0].accounts.nonRegistered.marketValue).toBe(104000)
      // Book value: 80k start + 2k cash income (interest + dividends) = 82k
      expect(initialState.persons[0].accounts.nonRegistered.bookValue).toBe(82000)
    })
  })
})
