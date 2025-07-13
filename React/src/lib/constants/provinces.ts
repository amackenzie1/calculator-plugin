export const PROVINCE_CODES = {
  'Alberta': 'AB',
  'British Columbia': 'BC',
  'Manitoba': 'MB',
  'New Brunswick': 'NB',
  'Newfoundland and Labrador': 'NL',
  'Nova Scotia': 'NS',
  'Ontario': 'ON',
  'Prince Edward Island': 'PE',
  'Quebec': 'QC',
  'Saskatchewan': 'SK',
  'Northwest Territories': 'NT',
  'Nunavut': 'NU',
  'Yukon': 'YT',
} as const;

export const canadianProvinces = Object.keys(PROVINCE_CODES) as CanadianProvince[];

export type CanadianProvince = keyof typeof PROVINCE_CODES;
export type Province = typeof PROVINCE_CODES[CanadianProvince];

export function getProvince(province: CanadianProvince): Province {
  return PROVINCE_CODES[province];
}

export function getProvinceName(code: Province): CanadianProvince | undefined {
  return (Object.entries(PROVINCE_CODES).find(([, c]) => c === code)?.[0] as CanadianProvince) || undefined;
}