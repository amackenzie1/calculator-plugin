import { CalculatorSchema } from '@/lib/schema/calculator'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function yearFromBirthYearAndTargetAge(
  birthYear: number,
  targetAge: number
): number {
  return birthYear + targetAge
}

type Person = z.infer<typeof CalculatorSchema>['persons'][number]

export function initializePerson(personType: 'self' | 'spouse'): Person {
  return {
    personType,
    birthYear: null,
    lifeExpectancy: null,
    primaryYearlyIncome: null,
    incomeYearStart: null,
    incomeYearEnd: null,
    incomeStartAge: null,
    incomeEndAge: null,
    cppStartYear: null,
    cppStartAge: null,
    cppAmount: null,
    oasStartYear: null,
    oasStartAge: null,
    oasAmount: null,
    definedBenefitPensionStartYear: null,
    definedBenefitPensionStartAge: null,
    definedBenefitPensionAmount: null,
    definedBenefitPensionIndexedToInflation: null,
    registeredInvestments: [],
    nonRegisteredInvestmentValue: null,
    nonRegisteredInvestmentOpeningYear: null,
    nonRegisteredInvestmentBookValue: null,
    lifeInsuranceDeathBenefit: null,
    annualExpenses: null,
    healthCareExpenses: null,
  }
}

// Re-export from provinces module for backward compatibility
export { canadianProvinces, type CanadianProvince, getProvince } from '@/lib/constants/provinces'
