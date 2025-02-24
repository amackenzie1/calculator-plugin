// File: src/lib/calculator/projection/types.ts
import { CalculatorSchemaType } from '@/components/Schema'

export interface ProjectionDataPoint {
  year: number
  netWorth: number
}

// Types for our state-based approach
export interface AccountState {
  marketValue: number
  bookValue: number // For non-registered accounts
}

export interface PersonState {
  age: number
  personType: 'self' | 'spouse'
  accounts: {
    nonRegistered: AccountState
    tfsa: AccountState
    rrsp: AccountState
    rrif: AccountState
    lira: AccountState
    lif: AccountState
  }
  income: {
    employment: number
    cpp: number
    oas: number
    definedBenefit: number
    other: Array<{
      amount: number
      description: string
    }>
  }
}

export interface YearState {
  year: number
  persons: {
    [key: string]: PersonState // Allow any number of people
  }
  realizedGains: number
  taxPaid: number
  expenses: number
  withdrawals: {
    nonRegistered: number
    tfsa: number
    rrsp: number
    rrif: number
  }
}

// Helper type for a person from the schema
export type SchemaPerson = NonNullable<CalculatorSchemaType['persons'][number]>