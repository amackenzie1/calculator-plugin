import { CalculatorSchemaType } from '@/lib/schema/calculator'
import { initializePerson } from '../lib/utils'
import * as ExcelJS from 'exceljs'

const currentYear = new Date().getFullYear()

// Default test scenario - provides sensible defaults for all required fields
const DEFAULT_SCENARIO: CalculatorSchemaType = {
  persons: [{ ...initializePerson('self'), birthYear: currentYear - 40, lifeExpectancy: 90 }],
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

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

/**
 * Creates a test scenario by merging overrides with defaults.
 * Supports nested overrides for persons array.
 */
export function createTestScenario(overrides: DeepPartial<CalculatorSchemaType> = {}): CalculatorSchemaType {
  const { persons, ...restOverrides } = overrides

  // Merge persons separately to handle array properly
  const mergedPersons = persons
    ? persons.map((personOverride, i) => ({
        ...initializePerson(personOverride?.personType || (i === 0 ? 'self' : 'spouse')),
        birthYear: currentYear - 40,
        lifeExpectancy: 90,
        ...personOverride,
      }))
    : DEFAULT_SCENARIO.persons

  return {
    ...DEFAULT_SCENARIO,
    ...restOverrides,
    persons: mergedPersons as CalculatorSchemaType['persons'],
  }
}

/**
 * Extracts all row labels from column A of an Excel worksheet
 */
export function extractRowLabels(sheet: ExcelJS.Worksheet): string[] {
  const labels: string[] = []
  sheet.eachRow((row) => {
    const cell = row.getCell(1)
    if (cell.value) labels.push(cell.value.toString().trim())
  })
  return labels
}

/**
 * Finds row numbers for specified labels in an Excel worksheet
 */
export function findRowNumbers(sheet: ExcelJS.Worksheet, labels: string[]): Record<string, number> {
  const result: Record<string, number> = {}
  labels.forEach(label => result[label] = 0)

  sheet.eachRow((row, rowNumber) => {
    const cellLabel = row.getCell(1).value?.toString().trim() || ''
    if (labels.includes(cellLabel)) result[cellLabel] = rowNumber
  })

  return result
}

/**
 * Gets a cell value from a specific row and column
 */
export function getCellValue(sheet: ExcelJS.Worksheet, rowNum: number, col: number): number {
  return sheet.getRow(rowNum).getCell(col).value as number
}

export { currentYear }
