import * as z from 'zod'

const currentYear = new Date().getFullYear()
const lowerYearBound = currentYear - 150
const upperYearBound = currentYear + 150

const PersonSchema = z.object({
  personType: z.enum(['self', 'spouse']),
  birthYear: z.number().min(lowerYearBound).max(currentYear).nullable(),
  lifeExpectancy: z.number().min(0).max(130).nullable(),
  primaryYearlyIncome: z.number().nullable(),
  incomeYearStart: z
    .number()
    .min(lowerYearBound)
    .max(upperYearBound)
    .nullable(),
  incomeYearEnd: z.number().min(lowerYearBound).max(upperYearBound).nullable(),
  incomeStartAge: z.number().nullable(),
  incomeEndAge: z.number().nullable(),
  cppStartYear: z.number().min(lowerYearBound).max(upperYearBound).nullable(),
  cppStartAge: z.number().nullable(),
  cppAmount: z.number().nullable(),
  oasStartYear: z.number().min(lowerYearBound).max(upperYearBound).nullable(),
  oasStartAge: z.number().nullable(),
  oasAmount: z.number().nullable(),
  definedBenefitPensionStartYear: z
    .number()
    .min(lowerYearBound)
    .max(upperYearBound)
    .nullable(),
  definedBenefitPensionStartAge: z.number().nullable(),
  definedBenefitPensionAmount: z.number().nullable(),
  definedBenefitPensionIndexedToInflation: z.boolean().nullable(),
  registeredInvestments: z
    .array(
      z.object({
        id: z.number(),
        accountType: z.enum(['TFSA', 'RRSP', 'RRIF', 'LIRA', 'LIF']).nullable(),
        currentValue: z.number().nullable(),
      })
    )
    .nullable(),
  nonRegisteredInvestmentValue: z.number().nullable(),
  nonRegisteredInvestmentOpeningYear: z
    .number()
    .min(lowerYearBound)
    .max(currentYear)
    .nullable(),
  nonRegisteredInvestmentBookValue: z.number().nullable(),
  lifeInsuranceDeathBenefit: z.number().nullable(),
  annualExpenses: z.number().nullable(),
  healthCareExpenses: z.number().nullable(),
})

export const CalculatorSchema = z
  .object({
    calculateForSpouse: z.boolean().default(false),
    province: z.enum([
      'AB',
      'BC',
      'MB',
      'NB',
      'NL',
      'NS',
      'NU',
      'ON',
      'PE',
      'SK',
      'QC',
      'YT',
      'NT',
    ]),
    investorProfile: z
      .enum([
        'risk_averse',
        'conservative',
        'moderate',
        'aggressive',
        'speculative',
        'custom',
      ])
      .nullable(),
    inflationRate: z.number().default(0.025),
    investmentReturnRate: z.number().nullable(),
    specifyReturn: z.boolean().nullable(),
    persons: z.array(PersonSchema),
    otherIncomes: z.array(
      z.object({
        id: z.number(),
        personType: z.enum(['self', 'spouse']),
        description: z.string().nullable(),
        amount: z.number().nullable(),
        startYear: z.number().nullable(),
        endYear: z.number().nullable(),
      })
    ),
    expensesChangeForEachStage: z.boolean().nullable(),
    expensesChangeForEachStageSpouse: z.boolean().nullable(),
    charitableDonations: z.array(
      z.object({
        id: z.number(),
        personType: z.enum(['self', 'spouse']),
        amount: z.number().nullable(),
        startYear: z.number().nullable(),
        endYear: z.number().nullable(),
      })
    ),
    oneOffExpenses: z.array(
      z.object({
        id: z.number(),
        personType: z.enum(['self', 'spouse']),
        description: z.string().nullable(),
        amount: z.number().nullable(),
        year: z.number().nullable(),
      })
    ),
    primaryResidenceValue: z.number().nullable(),
    primaryResidenceSell: z.boolean().nullable(),
    primaryResidenceSellYear: z.number().nullable(),
    desiredEstateValue: z.number().nullable(),
    incomeReturnRate: z.number().nullable(),
    growthReturnRate: z.number().nullable(),
  })
  .refine(
    (data) => {
      return data.persons.some((person) => person.personType === 'self')
    },
    {
      message: "At least one person with type 'self' is required.",
      path: ['persons'],
    }
  )
  .refine(
    (data) => {
      return (
        data.calculateForSpouse === false ||
        data.persons.some((person) => person.personType === 'spouse')
      )
    },
    {
      message:
        "When 'calculateForSpouse' is true, a person with type 'spouse' is required.",
      path: ['persons'],
    }
  )

export type CalculatorSchemaType = z.infer<typeof CalculatorSchema>
export type Province = CalculatorSchemaType['province']
