// Script to inspect XLSX report structure
import { projectRetirement } from '../src/lib/calculator/projection'
import { generateExcelReport } from '../src/lib/generateExcelReport'
import { initializePerson } from '../src/lib/utils'
import { CalculatorSchemaType } from '../src/lib/schema/calculator'
import * as ExcelJS from 'exceljs'

const currentYear = new Date().getFullYear()

// Email scenario: High income with charitable donations
const emailScenario: CalculatorSchemaType = {
  persons: [
    {
      ...initializePerson('self'),
      birthYear: 1950,
      lifeExpectancy: 95,
      annualExpenses: 100000,
      primaryYearlyIncome: 1200000,
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

async function inspectXLSX() {
  console.log('Generating projection and XLSX report...\n')
  const states = projectRetirement(emailScenario)

  const workbook = await generateExcelReport(
    states.slice(0, 5), // First 5 years for easier viewing
    emailScenario,
    'test.xlsx',
    true
  ) as ExcelJS.Workbook

  const sheet = workbook.getWorksheet('Financial Projection')

  console.log('═══════════════════════════════════════════════════════════════')
  console.log('                    XLSX REPORT INSPECTION')
  console.log('═══════════════════════════════════════════════════════════════\n')

  // Get column headers
  const headerRow = sheet!.getRow(1)
  const headers: string[] = []
  for (let i = 1; i <= 6; i++) {
    const val = headerRow.getCell(i).value
    headers.push(val ? val.toString() : '')
  }

  console.log('COLUMN HEADERS:')
  console.log(headers.join(' | '))
  console.log('───────────────────────────────────────────────────────────────\n')

  // Format currency helper
  const fmt = (val: any): string => {
    if (val === null || val === undefined || val === '') return '-'
    if (typeof val === 'number') {
      return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    }
    return val.toString()
  }

  // Print all rows
  console.log('ROW DATA:\n')

  sheet!.eachRow((row: ExcelJS.Row, rowNumber: number) => {
    const label = row.getCell(1).value?.toString() || ''

    if (rowNumber === 1) return // Skip header row (already printed)

    // Get values for first 5 years
    const values: string[] = []
    for (let i = 2; i <= 6; i++) {
      const val = row.getCell(i).value
      values.push(fmt(val))
    }

    // Determine row type for formatting
    const isBold = label.trim() && !label.startsWith('  ')
    const isIndented = label.startsWith('  ')

    if (isBold && label.trim()) {
      console.log('\n' + '═'.repeat(60))
      console.log(`${label.padEnd(35)} ${values.join('  ')}`)
      console.log('═'.repeat(60))
    } else if (isIndented) {
      console.log(`  ${label.trim().padEnd(33)} ${values.join('  ')}`)
    } else if (label.trim()) {
      console.log(`${label.padEnd(35)} ${values.join('  ')}`)
    }
  })

  console.log('\n═══════════════════════════════════════════════════════════════')
  console.log('                       KEY OBSERVATIONS')
  console.log('═══════════════════════════════════════════════════════════════\n')

  // Find specific rows to highlight
  let charityRow = 0
  let netFlowRow = 0
  let totalSourcesRow = 0
  let totalUsesRow = 0

  sheet!.eachRow((row: ExcelJS.Row, rowNumber: number) => {
    const label = row.getCell(1).value?.toString().trim() || ''
    if (label === 'Charitable Donations') charityRow = rowNumber
    if (label === 'Annual Net Cash Flow') netFlowRow = rowNumber
    if (label === 'Total Cash Sources') totalSourcesRow = rowNumber
    if (label === 'Total Cash Uses') totalUsesRow = rowNumber
  })

  console.log('✅ Charitable Donations row found at line', charityRow)
  console.log('   Value:', fmt(sheet!.getRow(charityRow).getCell(2).value))

  console.log('\n✅ Total Cash Sources row found at line', totalSourcesRow)
  console.log('   Value:', fmt(sheet!.getRow(totalSourcesRow).getCell(2).value))

  console.log('\n✅ Total Cash Uses row found at line', totalUsesRow)
  console.log('   Value:', fmt(sheet!.getRow(totalUsesRow).getCell(2).value))

  console.log('\n✅ Annual Net Cash Flow row found at line', netFlowRow)
  console.log('   Value:', fmt(sheet!.getRow(netFlowRow).getCell(2).value))

  const sources = sheet!.getRow(totalSourcesRow).getCell(2).value as number
  const uses = sheet!.getRow(totalUsesRow).getCell(2).value as number
  const netFlow = sheet!.getRow(netFlowRow).getCell(2).value as number

  console.log('\n✅ Math Check: Sources - Uses = Net Flow')
  console.log(`   ${fmt(sources)} - ${fmt(uses)} = ${fmt(netFlow)}`)
  console.log(`   Difference: ${fmt(sources - uses - netFlow)}`)

  console.log('\n═══════════════════════════════════════════════════════════════\n')
}

inspectXLSX().catch(console.error)
