// File: src/lib/calculator/projection/surplus.ts
import { CalculatorSchemaType } from '@/lib/schema/calculator'
import { projectRetirementInternal } from './engine'
import { YearState } from './types'
import { deepClone } from './utils'

export interface SurplusCalculationResult {
  surplusCapital: number
  essentialCapital: number
  totalNetWorth: number
  liquidAssets: number
  isViable: boolean
  iterations: number
  confidenceLevel: number
  postDonationProjection?: YearState[]
  postDonationInput?: CalculatorSchemaType
  shortfallYear?: number  // Year when money runs out
  unmetExpenses?: number  // Amount of shortfall
}

export interface ProjectionTestResult {
  isSuccessful: boolean
  finalNetWorth: number
  shortfallYear?: number
  unmetExpenses?: number
}

/**
 * Calculates the initial liquid assets available for donation
 * Excludes illiquid assets like primary residence and life insurance
 */
function calculateLiquidAssets(input: CalculatorSchemaType): number {
  let liquidAssets = 0
  
  // Add all registered and non-registered investments (these are liquid)
  for (const person of input.persons) {
    // Non-registered investments
    liquidAssets += person.nonRegisteredInvestmentValue || 0
    
    // Registered investments
    if (person.registeredInvestments) {
      for (const account of person.registeredInvestments) {
        liquidAssets += account.currentValue || 0
      }
    }
  }
  
  // Note: We explicitly exclude:
  // - Primary residence (illiquid)
  // - Life insurance death benefit (not accessible until death)
  
  return liquidAssets
}

/**
 * Calculates the total net worth including house (only if they plan to sell it)
 */
function calculateTotalNetWorth(input: CalculatorSchemaType): number {
  let totalNetWorth = calculateLiquidAssets(input)
  
  // Only add primary residence if they plan to sell it
  // If keeping it forever, it's not part of usable net worth
  if (input.primaryResidenceValue && input.primaryResidenceSell) {
    totalNetWorth += input.primaryResidenceValue
  }
  
  // Note: We don't include life insurance death benefits here
  // They only become assets when someone dies
  
  return totalNetWorth
}

/**
 * Simulates an immediate withdrawal by reducing account values
 * Priority: non-registered -> TFSA -> RRSP -> RRIF -> LIF -> LIRA
 */
function simulateWithdrawal(
  input: CalculatorSchemaType, 
  withdrawalAmount: number
): CalculatorSchemaType {
  const modifiedInput = deepClone(input)
  
  // Calculate total available across all persons for proportional allocation
  let totalAvailable = 0
  for (const person of modifiedInput.persons) {
    totalAvailable += person.nonRegisteredInvestmentValue || 0
    if (person.registeredInvestments) {
      for (const account of person.registeredInvestments) {
        totalAvailable += account.currentValue || 0
      }
    }
  }
  
  if (totalAvailable === 0) return modifiedInput
  
  // Withdraw proportionally from each person based on their share of total assets
  for (const person of modifiedInput.persons) {
    let personTotal = person.nonRegisteredInvestmentValue || 0
    if (person.registeredInvestments) {
      for (const account of person.registeredInvestments) {
        personTotal += account.currentValue || 0
      }
    }
    
    const personProportion = personTotal / totalAvailable
    const personWithdrawal = withdrawalAmount * personProportion
    let personRemaining = personWithdrawal
    
    // 1. Withdraw from non-registered first (most tax-efficient)
    if (personRemaining > 0 && person.nonRegisteredInvestmentValue) {
      const available = person.nonRegisteredInvestmentValue
      const toWithdraw = Math.min(available, personRemaining)
      person.nonRegisteredInvestmentValue = Math.max(0, available - toWithdraw)
      personRemaining -= toWithdraw
    }
    
    // 2. Withdraw from registered investments in priority order
    if (personRemaining > 0 && person.registeredInvestments) {
      const priorityOrder = ['TFSA', 'RRSP', 'RRIF', 'LIF', 'LIRA']
      
      for (const accountType of priorityOrder) {
        if (personRemaining <= 0) break
        
        for (const account of person.registeredInvestments) {
          if (personRemaining <= 0) break
          if (account.accountType === accountType && account.currentValue) {
            const available = account.currentValue
            const toWithdraw = Math.min(available, personRemaining)
            account.currentValue = Math.max(0, available - toWithdraw)
            personRemaining -= toWithdraw
          }
        }
      }
    }
  }
  
  return modifiedInput
}

/**
 * Tests if a projection meets success criteria after withdrawal
 */
function testProjectionWithWithdrawal(
  input: CalculatorSchemaType,
  withdrawalAmount: number
): ProjectionTestResult {
  try {
    // Simulate the withdrawal
    const modifiedInput = simulateWithdrawal(input, withdrawalAmount)
    
    // Run the projection
    const states = projectRetirementInternal(modifiedInput)
    
    // Validate success criteria
    return validateProjectionSuccess(states, modifiedInput)
  } catch (error) {
    return {
      isSuccessful: false,
      finalNetWorth: 0,
      unmetExpenses: withdrawalAmount
    }
  }
}

/**
 * Validates if a projection meets all success criteria
 */
function validateProjectionSuccess(
  states: YearState[],
  input: CalculatorSchemaType
): ProjectionTestResult {
  const desiredEstate = input.desiredEstateValue || 0
  
  // Check each year for viability
  for (let i = 0; i < states.length; i++) {
    const state = states[i]
    
    // Calculate total net worth for this year
    let netWorth = 0
    for (const person of state.persons) {
      for (const account of Object.values(person.accounts)) {
        netWorth += account.marketValue
      }
    }
    
    // Only add house value if they plan to sell it
    // Must be consistent with calculateNetWorth function
    if (state.primaryResidenceValue && input.primaryResidenceSell) {
      netWorth += state.primaryResidenceValue
    }
    
    // Check if we've run out of money (or about to)
    // Also check if net worth is too low to cover basic needs
    if (netWorth <= 0) {
      return {
        isSuccessful: false,
        finalNetWorth: netWorth,
        shortfallYear: state.year
      }
    }
    
    // Also check if they have expenses they can't cover
    // This catches the case where they have 0 net worth but still need money
    const totalExpenses = state.persons.reduce((sum, person) => sum + person.expenses, 0)
    if (netWorth < totalExpenses && i < states.length - 1) {
      // They don't have enough for next year's expenses
      return {
        isSuccessful: false,
        finalNetWorth: netWorth,
        shortfallYear: state.year + 1,
        unmetExpenses: totalExpenses - netWorth
      }
    }
  }
  
  // Check final estate value
  const finalState = states[states.length - 1]
  if (!finalState) {
    return {
      isSuccessful: false,
      finalNetWorth: 0
    }
  }
  
  let finalNetWorth = 0
  for (const person of finalState.persons) {
    for (const account of Object.values(person.accounts)) {
      finalNetWorth += account.marketValue
    }
  }
  
  // Only include house if selling
  if (finalState.primaryResidenceValue && input.primaryResidenceSell) {
    finalNetWorth += finalState.primaryResidenceValue
  }
  
  // If final net worth is 0 or negative, that's definitely a failure
  if (finalNetWorth <= 0 && states.length > 1) {
    return {
      isSuccessful: false,
      finalNetWorth,
      shortfallYear: finalState.year
    }
  }
  
  const meetsEstateGoal = finalNetWorth >= desiredEstate
  
  return {
    isSuccessful: meetsEstateGoal,
    finalNetWorth
  }
}

/**
 * Binary search to find maximum surplus capital
 */
function binarySearchSurplus(input: CalculatorSchemaType): SurplusCalculationResult {
  const liquidAssets = calculateLiquidAssets(input)
  const totalNetWorth = calculateTotalNetWorth(input)
  
  let low = 0
  let high = liquidAssets  // Can only donate liquid assets, not house or life insurance
  let bestViable = 0
  let iterations = 0
  
  // Binary search with precision of $100
  while (high - low > 100 && iterations < 30) {
    iterations++
    const mid = Math.floor((low + high) / 2)
    
    // Test if we can withdraw 'mid' amount
    const result = testProjectionWithWithdrawal(input, mid)
    
    if (result.isSuccessful) {
      bestViable = mid
      low = mid
    } else {
      high = mid
    }
  }
  
  // Round to nearest $1000 for cleaner display
  const roundToThousand = (value: number) => Math.round(value / 1000) * 1000
  
  const actualSurplus = bestViable  // Keep precise value for calculations
  const displaySurplus = roundToThousand(bestViable)  // Rounded for display
  const essentialCapital = totalNetWorth - displaySurplus
  const confidenceLevel = liquidAssets > 0 ? Math.max(0, 1 - (high - low) / liquidAssets) : 1
  
  // Generate post-donation projection if there's surplus capital
  // Use the actual precise value for the simulation
  let postDonationProjection: YearState[] | undefined
  let postDonationInput: CalculatorSchemaType | undefined
  
  if (actualSurplus > 0) {
    try {
      postDonationInput = simulateWithdrawal(input, actualSurplus)  // Use precise value
      postDonationProjection = projectRetirementInternal(postDonationInput)
    } catch (error) {
      console.warn("Could not generate post-donation projection:", error)
    }
  }
  
  return {
    surplusCapital: displaySurplus,  // Use rounded value for display
    essentialCapital,
    totalNetWorth,
    liquidAssets: roundToThousand(liquidAssets),  // Round for display
    isViable: actualSurplus >= 0,  // Use actual value for logic
    iterations,
    confidenceLevel,
    postDonationProjection,
    postDonationInput
  }
}

/**
 * Main function to calculate surplus capital
 */
export function calculateSurplusCapital(
  input: CalculatorSchemaType,
  maxIterations: number = 30
): SurplusCalculationResult {
  // First test if current projection is viable at all
  const baselineResult = testProjectionWithWithdrawal(input, 0)
  
  if (!baselineResult.isSuccessful) {
    // Current assets insufficient for goals - they're already running out of money!
    const totalNetWorth = calculateTotalNetWorth(input)
    const liquidAssets = calculateLiquidAssets(input)
    const roundToThousand = (value: number) => Math.round(value / 1000) * 1000
    
    return {
      surplusCapital: 0,
      essentialCapital: totalNetWorth,
      totalNetWorth,
      liquidAssets: roundToThousand(liquidAssets),  // Round for display
      isViable: false,
      iterations: 1,
      confidenceLevel: 1.0,
      postDonationProjection: undefined,
      postDonationInput: undefined,
      shortfallYear: baselineResult.shortfallYear,
      unmetExpenses: baselineResult.unmetExpenses
    }
  }
  
  // Perform binary search
  return binarySearchSurplus(input)
}