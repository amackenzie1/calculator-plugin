import { projectRetirement } from '../lib/calculator/projection'
import { generateExcelReport } from '../lib/generateExcelReport'
import * as ExcelJS from 'exceljs'
import { createTestScenario, extractRowLabels, findRowNumbers, getCellValue, currentYear } from '../lib/test-utils'

describe('XLSX Report Generation', () => {
  test('XLSX report includes charitable donations and net cash flow rows for high-income scenario', async () => {
    const emailScenario = createTestScenario({
      persons: [{
        birthYear: 1950,
        lifeExpectancy: 95,
        annualExpenses: 100000,
        primaryYearlyIncome: 1200000,
        incomeYearStart: currentYear,
        incomeYearEnd: currentYear + 50,
        cppAmount: 16000,
        cppStartYear: currentYear,
        oasAmount: 0,
        registeredInvestments: [{ id: 1, accountType: 'RRIF', currentValue: 20000000 }],
      }],
      investmentReturnRate: 5,
      charitableDonations: [{ id: 1, personType: 'self', amount: 100000, startYear: currentYear, endYear: currentYear + 50 }],
      primaryResidenceValue: 1500000,
      primaryResidenceSell: false,
      homeOwnership: 'self',
      desiredEstateValue: 20000000,
    })

    const states = projectRetirement(emailScenario)
    expect(states.length).toBeGreaterThan(0)

    const workbook = await generateExcelReport(states, emailScenario, 'test.xlsx', true) as ExcelJS.Workbook
    const sheet = workbook.getWorksheet('Financial Projection')!

    const rowLabels = extractRowLabels(sheet)
    console.log('\n=== XLSX Report Row Labels ===')
    rowLabels.forEach((label, i) => console.log(`${i + 1}. ${label}`))

    expect(rowLabels).toContain('Charitable Donations')
    expect(rowLabels).toContain('Annual Net Cash Flow')
    expect(rowLabels).toContain('Total Cash Sources')
    expect(rowLabels).toContain('Total Cash Uses')
    expect(rowLabels).toContain('Net Worth')

    const rows = findRowNumbers(sheet, ['Charitable Donations', 'Annual Net Cash Flow', 'Total Cash Sources', 'Total Cash Uses', 'Net Worth'])

    Object.values(rows).forEach(num => expect(num).toBeGreaterThan(0))

    const firstYearCharity = getCellValue(sheet, rows['Charitable Donations'], 2)
    expect(firstYearCharity).toBe(100000)

    const firstYearSources = getCellValue(sheet, rows['Total Cash Sources'], 2)
    const firstYearUses = getCellValue(sheet, rows['Total Cash Uses'], 2)
    const firstYearNetCashFlow = getCellValue(sheet, rows['Annual Net Cash Flow'], 2)

    console.log('\n=== First Year Values ===')
    console.log(`Charitable Donations: $${firstYearCharity.toLocaleString()}`)
    console.log(`Total Cash Sources: $${firstYearSources.toLocaleString()}`)
    console.log(`Total Cash Uses: $${firstYearUses.toLocaleString()}`)
    console.log(`Annual Net Cash Flow: $${firstYearNetCashFlow.toLocaleString()}`)

    expect(firstYearNetCashFlow).toBeCloseTo(firstYearSources - firstYearUses, 0)
    expect(firstYearNetCashFlow).toBeGreaterThan(400000)

    const year1NetWorth = getCellValue(sheet, rows['Net Worth'], 2)
    const year2NetWorth = getCellValue(sheet, rows['Net Worth'], 3)
    const year3NetWorth = getCellValue(sheet, rows['Net Worth'], 4)

    console.log('\n=== Net Worth Progression ===')
    console.log(`Year 1: $${year1NetWorth.toLocaleString()}`)
    console.log(`Year 2: $${year2NetWorth.toLocaleString()}`)
    console.log(`Year 3: $${year3NetWorth.toLocaleString()}`)

    expect(year1NetWorth).toBeGreaterThan(19000000)
    expect(year1NetWorth).toBeLessThan(21000000)
    expect(firstYearUses).toBeGreaterThan(600000)

    console.log('\n=== Verification Summary ===')
    console.log('✅ All verifications passed')
  })

  test('XLSX report shows correct structure for scenario without charitable donations', async () => {
    const scenario = createTestScenario({
      persons: [{ annualExpenses: 50000, nonRegisteredInvestmentValue: 500000, nonRegisteredInvestmentBookValue: 500000 }],
    })

    const states = projectRetirement(scenario)
    const workbook = await generateExcelReport(states, scenario, 'test.xlsx', true) as ExcelJS.Workbook
    const sheet = workbook.getWorksheet('Financial Projection')!

    const rows = findRowNumbers(sheet, ['Charitable Donations'])
    expect(rows['Charitable Donations']).toBeGreaterThan(0)
    expect(getCellValue(sheet, rows['Charitable Donations'], 2)).toBe(0)
  })

  test('XLSX report includes reverse mortgage debt tracking when allowHomeBorrowing is enabled', async () => {
    const reverseMortgageScenario = createTestScenario({
      persons: [{
        birthYear: 1950,
        lifeExpectancy: 100,
        annualExpenses: 80000,
        cppAmount: 19000,
        cppStartYear: 2019,
        oasAmount: 9000,
        oasStartYear: 2019,
        nonRegisteredInvestmentValue: 0,
        nonRegisteredInvestmentBookValue: 0,
        registeredInvestments: [],
      }],
      investmentReturnRate: 5,
      inflationRate: 2.5,
      primaryResidenceValue: 2000000,
      primaryResidenceSell: true,
      primaryResidenceSellYear: 2040,
      homeOwnership: 'self',
      desiredEstateValue: 10000,
      borrowingRate: 8,
      allowHomeBorrowing: true,
    })

    const states = projectRetirement(reverseMortgageScenario)
    expect(states.length).toBeGreaterThan(0)

    console.log('\n=== Reverse Mortgage Debt Tracking ===')
    console.log(`Year ${states[0].year} debt: $${states[0].liabilities.debtBalance.toLocaleString()}`)
    console.log(`Year ${states[0].year} interest expense: $${states[0].liabilities.interestExpense.toLocaleString()}`)
    console.log(`Year ${states[5].year} debt: $${states[5].liabilities.debtBalance.toLocaleString()}`)
    console.log(`Year ${states[5].year} interest expense: $${states[5].liabilities.interestExpense.toLocaleString()}`)

    if (states[1].liabilities.debtBalance > 0) {
      expect(states[2].liabilities.interestExpense).toBeGreaterThan(0)
    }

    const workbook = await generateExcelReport(states, reverseMortgageScenario, 'test.xlsx', true) as ExcelJS.Workbook
    const sheet = workbook.getWorksheet('Financial Projection')!

    const rowLabels = extractRowLabels(sheet)
    console.log('\n=== XLSX Report Row Labels (Reverse Mortgage Scenario) ===')
    rowLabels.forEach((label, i) => console.log(`${i + 1}. ${label}`))

    expect(rowLabels).toContain('Liabilities')
    expect(rowLabels).toContain('Reverse Mortgage')
    expect(rowLabels).toContain('Cumulative Debt Balance')
    expect(rowLabels).toContain('Total Liabilities')
    expect(rowLabels).toContain('Reverse Mortgage Interest')

    const rows = findRowNumbers(sheet, ['Cumulative Debt Balance', 'Reverse Mortgage Interest', 'Net Worth'])
    Object.values(rows).forEach(num => expect(num).toBeGreaterThan(0))

    expect(getCellValue(sheet, rows['Cumulative Debt Balance'], 2)).toBeCloseTo(states[0].liabilities.debtBalance, 0)
    expect(getCellValue(sheet, rows['Reverse Mortgage Interest'], 2)).toBeCloseTo(states[0].liabilities.interestExpense, 0)

    console.log('\n=== Verification Summary (Reverse Mortgage) ===')
    console.log('✅ All verifications passed')
  })

  test('XLSX report does NOT include Liabilities section when allowHomeBorrowing is disabled', async () => {
    const scenario = createTestScenario({
      persons: [{ annualExpenses: 50000, nonRegisteredInvestmentValue: 500000, nonRegisteredInvestmentBookValue: 500000 }],
      primaryResidenceValue: 1000000,
      primaryResidenceSell: false,
      homeOwnership: 'self',
    })

    const states = projectRetirement(scenario)
    const workbook = await generateExcelReport(states, scenario, 'test.xlsx', true) as ExcelJS.Workbook
    const sheet = workbook.getWorksheet('Financial Projection')!

    const rowLabels = extractRowLabels(sheet)

    expect(rowLabels).not.toContain('Liabilities')
    expect(rowLabels).not.toContain('Reverse Mortgage')
    expect(rowLabels).not.toContain('Cumulative Debt Balance')
    expect(rowLabels).not.toContain('Reverse Mortgage Interest')

    console.log('\n=== Verification (No Reverse Mortgage) ===')
    console.log('✅ Liabilities section correctly excluded when allowHomeBorrowing is disabled')
  })
})
