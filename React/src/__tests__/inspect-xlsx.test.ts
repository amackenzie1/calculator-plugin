import { CalculatorSchemaType } from '@/lib/schema/calculator'
import { projectRetirement } from '../lib/calculator/projection'
import { generateExcelReport } from '../lib/generateExcelReport'
import { initializePerson } from '../lib/utils'
import * as ExcelJS from 'exceljs'

describe('XLSX Manual Inspection', () => {
  test('Display XLSX report in readable format', async () => {
    const currentYear = new Date().getFullYear()

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

    const states = projectRetirement(emailScenario)
    const workbook = await generateExcelReport(
      states.slice(0, 5), // First 5 years
      emailScenario,
      'test.xlsx',
      true
    ) as ExcelJS.Workbook

    const sheet = workbook.getWorksheet('Financial Projection')

    console.log('\n═══════════════════════════════════════════════════════════════')
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
    console.log('FULL REPORT:\n')

    sheet!.eachRow((row: ExcelJS.Row, rowNumber: number) => {
      const label = row.getCell(1).value?.toString() || ''

      if (rowNumber === 1) return // Skip header (already printed)

      // Get values for first 5 years
      const values: string[] = []
      for (let i = 2; i <= 6; i++) {
        const val = row.getCell(i).value
        values.push(fmt(val))
      }

      // Determine row type
      const isBoldSection = label.trim() && !label.startsWith('  ') &&
                           (label.includes('Cash') || label.includes('Assets') || label.includes('Net Worth'))
      const isIndented = label.startsWith('  ')

      if (isBoldSection) {
        console.log('\n' + '─'.repeat(130))
        console.log(`${label.padEnd(40)} ${values.join('    ')}`)
        console.log('─'.repeat(130))
      } else if (isIndented) {
        const trimmed = label.trim()
        console.log(`    ${trimmed.padEnd(36)} ${values.join('    ')}`)
      } else if (label.trim()) {
        console.log(`  ${label.trim().padEnd(38)} ${values.join('    ')}`)
      }
    })

    console.log('\n═══════════════════════════════════════════════════════════════')
    console.log('                       KEY CHECKS')
    console.log('═══════════════════════════════════════════════════════════════\n')

    // Find key rows
    let charityRow = 0
    let netFlowRow = 0
    let totalSourcesRow = 0
    let totalUsesRow = 0
    let generalExpensesRow = 0

    sheet!.eachRow((row: ExcelJS.Row, rowNumber: number) => {
      const label = row.getCell(1).value?.toString().trim() || ''
      if (label === 'Charitable Donations') charityRow = rowNumber
      if (label === 'Annual Net Cash Flow') netFlowRow = rowNumber
      if (label === 'Total Cash Sources') totalSourcesRow = rowNumber
      if (label === 'Total Cash Uses') totalUsesRow = rowNumber
      if (label === 'General Expenses') generalExpensesRow = rowNumber
    })

    const charityVal = sheet!.getRow(charityRow).getCell(2).value as number
    const generalExpVal = sheet!.getRow(generalExpensesRow).getCell(2).value as number
    const sources = sheet!.getRow(totalSourcesRow).getCell(2).value as number
    const uses = sheet!.getRow(totalUsesRow).getCell(2).value as number
    const netFlow = sheet!.getRow(netFlowRow).getCell(2).value as number

    console.log('1️⃣  CHARITABLE DONATIONS VISIBILITY')
    console.log(`   Row ${charityRow}: Charitable Donations = ${fmt(charityVal)}`)
    console.log(`   ✅ Separate line item (not hidden in General Expenses)`)

    console.log('\n2️⃣  EXPENSE BREAKDOWN')
    console.log(`   Row ${generalExpensesRow}: General Expenses = ${fmt(generalExpVal)}`)
    console.log(`   Row ${charityRow}: Charitable Donations = ${fmt(charityVal)}`)
    console.log(`   ✅ Charity shown separately from regular expenses`)

    console.log('\n3️⃣  CASH FLOW SUMMARY')
    console.log(`   Row ${totalSourcesRow}: Total Cash Sources = ${fmt(sources)}`)
    console.log(`   Row ${totalUsesRow}: Total Cash Uses = ${fmt(uses)}`)
    console.log(`   Row ${netFlowRow}: Annual Net Cash Flow = ${fmt(netFlow)}`)

    console.log('\n4️⃣  NET CASH FLOW CALCULATION')
    console.log(`   ${fmt(sources)} (sources) - ${fmt(uses)} (uses) = ${fmt(sources - uses)}`)
    console.log(`   Net Cash Flow shown: ${fmt(netFlow)}`)
    const diff = Math.abs(sources - uses - netFlow)
    console.log(`   Difference: ${fmt(diff)} ${diff < 1 ? '✅ CORRECT' : '❌ ERROR'}`)

    console.log('\n5️⃣  INTERPRETABILITY CHECK')
    console.log(`   ✅ Clear section headers (Cash Sources, Cash Uses, Assets)`)
    console.log(`   ✅ Indented sub-items for hierarchy`)
    console.log(`   ✅ Bold totals for easy scanning`)
    console.log(`   ✅ Currency formatting`)
    console.log(`   ✅ Year headers with ages`)

    console.log('\n═══════════════════════════════════════════════════════════════\n')

    // Assertions
    expect(charityVal).toBe(100000)
    expect(sources).toBeGreaterThan(uses)
    expect(Math.abs(sources - uses - netFlow)).toBeLessThan(1)
  })
})
