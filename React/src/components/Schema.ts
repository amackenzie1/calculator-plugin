export type Person = {
  personType: 'self' | 'spouse'
  birthYear: number | null
  lifeExpectancy: number | null
  primaryYearlyIncome: number | null
  incomeYearStart: number | null
  incomeYearEnd: number | null
  annualExpenses: number | null
  healthCareExpenses: number | null
  registeredInvestments: RegisteredInvestment[] | null
  nonRegisteredInvestmentValue: number | null
  nonRegisteredInvestmentBookValue: number | null
  cppAmount: number | null
  cppStartYear: number | null
  oasAmount: number | null
  oasStartYear: number | null
  definedBenefitPensionAmount: number | null
  definedBenefitPensionStartYear: number | null
  definedBenefitPensionIndexedToInflation: boolean | null
  lifeInsuranceDeathBenefit: number | null
  rrspContributionRoom: number | null
  tfsaContributionRoom: number | null
}
