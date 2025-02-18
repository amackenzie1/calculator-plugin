import {
  calculateSplitTax,
  calculateTax,
  getFederalBPA,
  provincialTaxData,
} from '../lib/calculator/tax' // adjust the import path as needed

describe('Tax Calculations', () => {
  test('calculateTax returns 0 when income is 0 or negative', () => {
    expect(calculateTax(0, 'ON')).toBe(0)
    expect(calculateTax(-1000, 'ON')).toBe(0)
  })

  test('calculates Ontario tax correctly for a given income', () => {
    const income = 50000
    const province = 'ON'
    // --- Federal Tax Calculation ---
    // For incomes below the phaseout threshold, full BPA applies.
    const federalBPA = getFederalBPA(income) // Should be full 15705 for income=50000
    const federalTaxable = Math.max(0, income - federalBPA)
    // With federalBrackets[0] = { rate: 0.15, upTo: 57375 } and income below that limit:
    const expectedFedTax = federalTaxable * 0.15

    // --- Provincial Tax Calculation (Ontario) ---
    const ontarioData = provincialTaxData[province]
    const provincialTaxable = Math.max(0, income - ontarioData.personalAmount)
    // Ontario's first bracket: { rate: 0.0505, upTo: 52886 }
    const expectedProvTax = provincialTaxable * 0.0505

    const expectedTotalTax = expectedFedTax + expectedProvTax
    const computedTax = calculateTax(income, province)
    expect(computedTax).toBeCloseTo(expectedTotalTax, 2)
  })

  test('calculates Quebec tax with federal abatement correctly', () => {
    const income = 50000
    const province = 'QC'
    // --- Federal Tax Calculation with Abatement ---
    const federalBPA = getFederalBPA(income) // Still 15705 for income=50000
    const federalTaxable = Math.max(0, income - federalBPA)
    const fedTaxBeforeAbatement = federalTaxable * 0.15 // income falls in first bracket
    // Quebec federal tax abatement reduces the federal tax by 16.5%
    const expectedFedTax = fedTaxBeforeAbatement * (1 - 0.165)

    // --- Provincial Tax Calculation (Quebec) ---
    const quebecData = provincialTaxData[province]
    const provincialTaxable = Math.max(0, income - quebecData.personalAmount)
    // For simplicity, assume the taxable amount is within the first bracket.
    const expectedProvTax = provincialTaxable * quebecData.brackets[0].rate

    const expectedTotalTax = expectedFedTax + expectedProvTax
    const computedTax = calculateTax(income, province)
    expect(computedTax).toBeCloseTo(expectedTotalTax, 2)
  })

  test('calculateSplitTax returns same result as calculateTax when spouse split is 0', () => {
    const income = 100000
    const province = 'ON'
    const taxSingle = calculateTax(income, province)
    const taxSplit = calculateSplitTax(income, 0, province)
    expect(taxSplit).toBeCloseTo(taxSingle, 2)
  })

  test('calculateSplitTax splits income correctly between spouses', () => {
    const income = 100000
    const province = 'ON'
    const spouseIncomeSplit = 0.3 // 30% to spouse, 70% to primary
    const spousePortion = income * spouseIncomeSplit
    const primaryPortion = income - spousePortion

    const expectedTax =
      calculateTax(primaryPortion, province) +
      calculateTax(spousePortion, province)
    const computedTax = calculateSplitTax(income, spouseIncomeSplit, province)
    expect(computedTax).toBeCloseTo(expectedTax, 2)
  })
})
