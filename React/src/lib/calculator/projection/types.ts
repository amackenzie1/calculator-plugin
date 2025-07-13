// File: src/lib/calculator/projection/types.ts
import { CalculatorSchemaType } from '@/lib/schema/calculator'
import { AccountType, WithdrawalAccountType } from './constants'

export interface ProjectionDataPoint {
  year: number
  netWorth: number
}

// Types for our state-based approach
export interface AccountState {
  marketValue: number
  bookValue: number // For non-registered accounts
}

// Type-safe account collections using the constants
export type AccountsCollection = {
  [K in AccountType]: AccountState
}

export type WithdrawalsCollection = {
  [K in WithdrawalAccountType]: number
}

export interface PersonState {
  age: number
  personType: 'self' | 'spouse'
  accounts: AccountsCollection
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
  taxPaid: number
  realizedGains: number
  expenses: number
  withdrawals: WithdrawalsCollection
}

export interface YearState {
  year: number
  persons: PersonState[]
}

// Helper type for a person from the schema
export type SchemaPerson = NonNullable<CalculatorSchemaType['persons'][number]>