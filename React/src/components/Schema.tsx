import * as z from 'zod'

const currentYear = new Date().getFullYear()
const lowerYearBound = currentYear - 150
const upperYearBound = currentYear + 150

const PersonSchema = z.object({
  personType: z.enum(['self', 'spouse']),
  birthYear: z.number().min(lowerYearBound).max(currentYear).optional(),
  lifeExpectancy: z.number().min(0).max(130).optional(),
  primaryYearlyIncome: z.number().optional(),
  incomeYearStart: z
    .number()
    .min(lowerYearBound)
    .max(upperYearBound)
    .optional(),
  incomeYearEnd: z.number().min(lowerYearBound).max(upperYearBound).optional(),
  incomeStartAge: z.number().optional(),
  incomeEndAge: z.number().optional(),
  cppStartYear: z.number().min(lowerYearBound).max(upperYearBound).optional(),
  cppStartAge: z.number().optional(),
  cppAmount: z.number().optional(),
  oasStartYear: z.number().min(lowerYearBound).max(upperYearBound).optional(),
  oasStartAge: z.number().optional(),
  oasAmount: z.number().optional(),
  definedBenefitPensionStartYear: z
    .number()
    .min(lowerYearBound)
    .max(upperYearBound)
    .optional(),
  definedBenefitPensionStartAge: z.number().optional(),
  definedBenefitPensionAmount: z.number().optional(),
  definedBenefitPensionIndexedToInflation: z.boolean().optional(),
  registeredInvestments: z
    .array(
      z.object({
        id: z.number(),
        accountType: z.enum(['TFSA', 'RRSP', 'RRIF', 'LIRA', 'LIF']).optional(),
        currentValue: z.number().optional(),
      })
    )
    .optional(),
  nonRegisteredInvestmentValue: z.number().optional(),
  nonRegisteredInvestmentOpeningYear: z
    .number()
    .min(lowerYearBound)
    .max(currentYear)
    .optional(),
  nonRegisteredInvestmentBookValue: z.number().optional(),
  lifeInsuranceDeathBenefit: z.number().optional(),
  annualRetirementExpenses: z.number().optional(),
  healthCareExpenses: z.number().optional(),
  annualRetirementExpensesStage2: z.number().optional(),
  healthCareExpensesStage2: z.number().optional(),
  annualRetirementExpensesStage3: z.number().optional(),
  healthCareExpensesStage3: z.number().optional(),
  annualRetirementExpensesStage4: z.number().optional(),
  healthCareExpensesStage4: z.number().optional(),
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
      .optional(),
    inflationRate: z.number().default(0.025),
    investmentReturnRate: z.number(),
    specifyReturn: z.boolean().optional(),
    persons: z.array(PersonSchema),
    otherIncomes: z.array(
      z.object({
        id: z.number(),
        personType: z.enum(['self', 'spouse']),
        description: z.string().optional(),
        amount: z.number().optional(),
        startYear: z.number().optional(), // Changed from 'year'
        endYear: z.number().optional(), // Changed from 'year'
      })
    ),
    expensesChangeForEachStage: z.boolean().optional(),
    expensesChangeForEachStageSpouse: z.boolean().optional(),
    charitableDonations: z.array(
      z.object({
        id: z.number(),
        personType: z.enum(['self', 'spouse']),
        amount: z.number().optional(),
        startYear: z.number().optional(),
        endYear: z.number().optional(),
      })
    ),
    oneOffExpenses: z.array(
      z.object({
        id: z.number(),
        personType: z.enum(['self', 'spouse']),
        description: z.string().optional(),
        amount: z.number().optional(),
        year: z.number().optional(),
      })
    ),
    primaryResidenceValue: z.number().optional(),
    primaryResidenceSell: z.boolean().optional(),
    primaryResidenceSellYear: z.number().optional(),
    desiredEstateValue: z.number().optional(),
    incomeReturnRate: z.number().optional(),
    growthReturnRate: z.number().optional(),
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
