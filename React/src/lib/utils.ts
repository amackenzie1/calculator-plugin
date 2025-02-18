import { Province } from '@/components/Schema'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function yearFromBirthYearAndTargetAge(
  birthYear: number,
  targetAge: number
): number {
  return birthYear + targetAge
}

export const canadianProvinces = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Northwest Territories',
  'Nunavut',
  'Yukon',
] as const

export type CanadianProvince = (typeof canadianProvinces)[number]

export function getProvince(province: CanadianProvince): Province {
  switch (province) {
    case 'Alberta':
      return 'AB'
    case 'British Columbia':
      return 'BC'
    case 'Manitoba':
      return 'MB'
    case 'New Brunswick':
      return 'NB'
    case 'Newfoundland and Labrador':
      return 'NL'
    case 'Nova Scotia':
      return 'NS'
    case 'Ontario':
      return 'ON'
    case 'Prince Edward Island':
      return 'PE'
    case 'Quebec':
      return 'QC'
    case 'Saskatchewan':
      return 'SK'
    case 'Yukon':
      return 'YT'
    case 'Northwest Territories':
      return 'NT'
    case 'Nunavut':
      return 'NU'
    default:
      throw new Error(`Unknown province: ${province}`)
  }
}
