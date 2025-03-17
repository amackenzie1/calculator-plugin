import { Province } from '@/components/Schema'

// Interface for tax brackets
interface TaxBracket {
  rate: number
  upTo?: number
}

// Constants for federal amounts
const FEDERAL_AMOUNTS = {
  BPA_2024: 15075,
  AGE_AMOUNT_2024: 8790,
  AGE_AMOUNT_THRESHOLD_2024: 44000,
  AGE_AMOUNT_REDUCTION_RATE: 0.15,
  LOWEST_RATE: 0.15 // Federal lowest tax rate for credits
}

/** Federal tax brackets for 2024 */
const federalBrackets: TaxBracket[] = [
  { rate: 0.15, upTo: 57375 },
  { rate: 0.205, upTo: 114750 },
  { rate: 0.26, upTo: 177882 },
  { rate: 0.29, upTo: 253414 },
  { rate: 0.33 },
]

/**
 * Helper function to calculate tax using progressive brackets
 */
function applyProgressiveBrackets(
  taxableIncome: number,
  brackets: TaxBracket[]
): number {
  let tax = 0
  let previousLimit = 0

  for (const { rate, upTo } of brackets) {
    if (upTo === undefined) {
      if (taxableIncome > previousLimit) {
        tax += (taxableIncome - previousLimit) * rate
      }
      break
    } else {
      if (taxableIncome <= previousLimit) {
        break
      } else if (taxableIncome > upTo) {
        tax += (upTo - previousLimit) * rate
        previousLimit = upTo
      } else {
        tax += (taxableIncome - previousLimit) * rate
        break
      }
    }
  }

  return tax
}

/**
 * Gets the federal Basic Personal Amount based on income
 */
export function getFederalBPA(income: number): number {
  return FEDERAL_AMOUNTS.BPA_2024 // Using 2024 amount
}

/**
 * Calculates the age amount credit for individuals 65 and older
 */
export function calculateAgeAmount(age: number, income: number): number {
  if (age < 65) return 0

  if (income <= FEDERAL_AMOUNTS.AGE_AMOUNT_THRESHOLD_2024) {
    return FEDERAL_AMOUNTS.AGE_AMOUNT_2024
  }

  // Reduce age amount by 15% of income over threshold
  const reduction = Math.min(
    FEDERAL_AMOUNTS.AGE_AMOUNT_2024,
    (income - FEDERAL_AMOUNTS.AGE_AMOUNT_THRESHOLD_2024) * FEDERAL_AMOUNTS.AGE_AMOUNT_REDUCTION_RATE
  )
  
  return Math.max(0, FEDERAL_AMOUNTS.AGE_AMOUNT_2024 - reduction)
}

/**
 * Calculates federal tax including BPA, age amount, and Quebec abatement
 */
function calculateFederalTax(province: Province, income: number, age: number): number {
  // Calculate base tax on total income
  const baseTax = applyProgressiveBrackets(income, federalBrackets)

  // Calculate tax credits
  const bpaCredit = getFederalBPA(income) * FEDERAL_AMOUNTS.LOWEST_RATE
  const ageCredit = calculateAgeAmount(age, income) * FEDERAL_AMOUNTS.LOWEST_RATE
  
  // Apply credits to get net federal tax
  let federalTaxOwed = Math.max(0, baseTax - bpaCredit - ageCredit)

  if (province === 'QC') {
    federalTaxOwed *= 1 - 0.165 // Quebec abatement
  }

  return federalTaxOwed
}

/**
 * Calculates provincial tax based on province-specific brackets and BPA
 */
function calculateProvincialTax(province: Province, income: number): number {
  const { personalAmount, brackets } = provincialTaxData[province]
  
  // Calculate base provincial tax
  const baseTax = applyProgressiveBrackets(income, brackets)
  
  // Calculate provincial basic personal amount credit
  const provincialBPACredit = personalAmount * brackets[0].rate // Use lowest provincial rate
  
  return Math.max(0, baseTax - provincialBPACredit)
}

/**
 * Calculates total combined federal and provincial tax
 * @param income Taxable income
 * @param province Province/territory for tax calculation
 * @param charitableDonations Optional charitable donations amount
 * @param age Age of the taxpayer (needed for age amount calculation)
 */
export function calculateTax(
  income: number,
  province: Province,
  charitableDonations: number = 0,
  age: number = 0
): number {
  if (income <= 0) return 0

  // Apply charitable donation tax credit if applicable
  const taxableIncome = income
  let taxCredit = 0

  if (charitableDonations > 0) {
    // Simplified charitable donation tax credit calculation
    const firstTier = Math.min(charitableDonations, 200)
    const secondTier = Math.max(0, charitableDonations - 200)
    taxCredit = firstTier * 0.15 + secondTier * 0.29 // Federal approximation
  }

  const fedTax = calculateFederalTax(province, taxableIncome, age)
  const provTax = calculateProvincialTax(province, taxableIncome)

  return Math.max(0, fedTax + provTax - taxCredit)
}

/**
 * Holds the provincial/territorial basic personal amount (BPA)
 * and the array of progressive brackets (rate + upTo).
 */
export const provincialTaxData: Record<
  Province,
  {
    personalAmount: number
    brackets: TaxBracket[]
  }
> = {
  AB: {
    personalAmount: 22476, // Approx. 2025 (indexed from 2024 $21,885)
    brackets: [
      { rate: 0.1, upTo: 148269 },
      { rate: 0.12, upTo: 177922 },
      { rate: 0.13, upTo: 237230 },
      { rate: 0.14, upTo: 355845 },
      { rate: 0.15 },
    ],
  },
  BC: {
    personalAmount: 12932, // Confirmed for 2025
    brackets: [
      { rate: 0.0506, upTo: 49279 },
      { rate: 0.077, upTo: 98560 },
      { rate: 0.105, upTo: 113158 },
      { rate: 0.1229, upTo: 137407 },
      { rate: 0.147, upTo: 186306 },
      { rate: 0.168, upTo: 259829 },
      { rate: 0.205 },
    ],
  },
  MB: {
    personalAmount: 15780, // Confirmed for 2025
    brackets: [
      { rate: 0.108, upTo: 51108 },
      { rate: 0.1275, upTo: 109520 },
      { rate: 0.174 },
    ],
  },
  NB: {
    personalAmount: 13651, // Approx. 2025 (indexed from $13,292 in 2024)
    brackets: [
      { rate: 0.094, upTo: 51330 },
      { rate: 0.14, upTo: 102660 },
      { rate: 0.16, upTo: 190148 },
      { rate: 0.195 },
    ],
  },
  NL: {
    personalAmount: 11067, // Confirmed for 2025
    brackets: [
      { rate: 0.087, upTo: 44192 },
      { rate: 0.145, upTo: 88382 },
      { rate: 0.158, upTo: 157792 },
      { rate: 0.178, upTo: 220910 },
      { rate: 0.198, upTo: 275870 },
      { rate: 0.208, upTo: 551739 },
      { rate: 0.213, upTo: 1103478 },
      { rate: 0.218 },
    ],
  },
  NS: {
    personalAmount: 11790, // Approx. 2025 (indexed from $11,481)
    brackets: [
      { rate: 0.0879, upTo: 29590 },
      { rate: 0.1495, upTo: 59180 },
      { rate: 0.1667, upTo: 93000 },
      { rate: 0.175, upTo: 150000 },
      { rate: 0.21 },
    ],
  },
  NT: {
    personalAmount: 17842, // Confirmed for 2025
    brackets: [
      { rate: 0.059, upTo: 51964 },
      { rate: 0.086, upTo: 103930 },
      { rate: 0.122, upTo: 168967 },
      { rate: 0.1405 },
    ],
  },
  NU: {
    personalAmount: 19274, // Confirmed for 2025
    brackets: [
      { rate: 0.04, upTo: 54707 },
      { rate: 0.07, upTo: 109413 },
      { rate: 0.09, upTo: 177881 },
      { rate: 0.115 },
    ],
  },
  ON: {
    personalAmount: 12732, // Approx. 2025 (indexed from $12,399)
    brackets: [
      { rate: 0.0505, upTo: 52884 },
      { rate: 0.0915, upTo: 105771 },
      { rate: 0.1116, upTo: 150000 },
      { rate: 0.1216, upTo: 220000 },
      { rate: 0.1316 },
    ],
  },
  PE: {
    personalAmount: 14250, // Confirmed for 2025
    brackets: [
      { rate: 0.095, upTo: 33328 },
      { rate: 0.1347, upTo: 64656 },
      { rate: 0.166, upTo: 105000 },
      { rate: 0.1762, upTo: 140000 },
      { rate: 0.19 },
    ],
  },
  QC: {
    personalAmount: 18571, // Confirmed for 2025
    brackets: [
      { rate: 0.14, upTo: 53255 },
      { rate: 0.19, upTo: 106495 },
      { rate: 0.24, upTo: 129590 },
      { rate: 0.2575 },
    ],
  },
  SK: {
    personalAmount: 19491, // Confirmed for 2025
    brackets: [
      { rate: 0.105, upTo: 53463 },
      { rate: 0.125, upTo: 152750 },
      { rate: 0.145 },
    ],
  },
  YT: {
    personalAmount: 16129, // Aligned with federal BPA for 2025
    brackets: [
      { rate: 0.064, upTo: 57375 },
      { rate: 0.09, upTo: 114750 },
      { rate: 0.109, upTo: 177882 },
      { rate: 0.128, upTo: 500000 },
      { rate: 0.15 },
    ],
  },
}

/**
 * Calculates tax with income splitting between spouses
 */
export function calculateSplitTax(
  householdIncome: number,
  spouseIncomeSplit: number,
  province: Province
): number {
  if (spouseIncomeSplit <= 0) {
    return calculateTax(householdIncome, province)
  }

  const spousePortion = householdIncome * spouseIncomeSplit
  const primaryPortion = householdIncome - spousePortion
  return (
    calculateTax(primaryPortion, province) +
    calculateTax(spousePortion, province)
  )
}
