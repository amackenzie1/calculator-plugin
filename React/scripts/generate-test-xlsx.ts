// Script to generate a test XLSX file for manual inspection
import { projectRetirement } from '../src/lib/calculator/projection'
import { generateExcelReport } from '../src/lib/generateExcelReport'
import { initializePerson } from '../src/lib/utils'
import { CalculatorSchemaType } from '../src/lib/schema/calculator'
import * as fs from 'fs'
import * as path from 'path'

const currentYear = new Date().getFullYear()

// Email scenario: High income with charitable donations
const emailScenario: CalculatorSchemaType = {
  persons: [
    {
      ...initializePerson('self'),
      birthYear: 1950,
      lifeExpectancy: 95,
      annualExpenses: 100000,
      primaryYearlyIncome: 1200000, // Indexed pension
      incomeYearStart: currentYear,
      incomeYearEnd: currentYear + 50,
      cppAmount: 16000,
      cppStartYear: currentYear,
      oasAmount: 0,
      nonRegisteredInvestmentValue: 0,
      nonRegisteredInvestmentBookValue: 0,
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
      amount: 100000,
      startYear: currentYear,
      endYear: currentYear + 50,
    },
  ],
  oneOffExpenses: [],
  investorProfile: null,
  specifyReturn: null,
  primaryResidenceValue: 1500000,
  primaryResidenceSell: false,
  primaryResidenceSellYear: null,
  homeOwnership: 'self',
  desiredEstateValue: 20000000,
  incomeReturnRate: null,
  growthReturnRate: null,
  nonRegisteredReturnBreakdown: {
    interest: 0.2,
    eligibleDividends: 0.3,
    capitalGains: 0.5,
  },
  expensesChangeForEachStage: null,
  expensesChangeForEachStageSpouse: null,
}

async function generateTestFile() {
  console.log('Running projection...')
  const states = projectRetirement(emailScenario)
  console.log(`Generated ${states.length} years of projections`)

  console.log('\nGenerating XLSX workbook...')
  const workbook = await generateExcelReport(
    states.slice(0, 10), // First 10 years for easier inspection
    emailScenario,
    'test.xlsx',
    true
  )

  if (!workbook) {
    console.error('Failed to generate workbook')
    return
  }

  console.log('Writing to file...')
  const outputPath = path.join(__dirname, '..', 'test-output.xlsx')
  await workbook.xlsx.writeFile(outputPath)
  console.log(`\n✅ XLSX file written to: ${outputPath}`)
  console.log('\nYou can open this file in Excel to inspect it manually.')
}

generateTestFile().catch(console.error)
