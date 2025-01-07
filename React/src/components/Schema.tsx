import * as z from "zod";

const currentYear = new Date().getFullYear();
const lowerYearBound = currentYear - 150;
const upperYearBound = currentYear + 150;

const PersonSchema = z.object({
  personType: z.enum(["self", "spouse"]),
  birthYear: z.number().min(lowerYearBound).max(currentYear),
  lifeExpectancy: z.number().min(0).max(130),
  primaryYearlyIncome: z.number().optional(),
  incomeYearStart: z
    .number()
    .min(lowerYearBound)
    .max(upperYearBound)
    .optional(),
  incomeYearEnd: z.number().min(lowerYearBound).max(upperYearBound).optional(),
  cppStartYear: z.number().min(lowerYearBound).max(upperYearBound).optional(),
  cppAmount: z.number().optional(),
  oasStartYear: z.number().min(lowerYearBound).max(upperYearBound).optional(),
  oasAmount: z.number().optional(),
  definedBenefitPensionStartYear: z
    .number()
    .min(lowerYearBound)
    .max(upperYearBound)
    .optional(),
  definedBenefitPensionAmount: z.number().optional(),
  definedBenefitPensionIndexedToInflation: z.boolean().optional(),
  registeredInvestments: z
    .array(
      z.object({
        accountType: z.enum(["TFSA", "RRSP", "RRIF", "LIRA", "LIF"]).optional(),
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
});

const CalculatorSchema = z
  .object({
    calculateForSpouse: z.boolean().default(false),
    province: z.enum([
      "Alberta",
      "British Columbia",
      "Manitoba",
      "New Brunswick",
      "Newfoundland & Labrador",
      "Nova Scotia",
      "Nunavut",
      "Ontario",
      "Prince Edward Island",
      "Saskatchewan",
      "Quebec",
      "Yukon",
    ]),
    investorProfile: z
      .enum([
        "risk_averse",
        "conservative",
        "moderate",
        "aggressive",
        "speculative",
        "custom",
      ])
      .optional(),
    inflationRate: z.number().default(0.025),
    investmentReturnRate: z.number(),
    specifyReturn: z.boolean().optional(),
    persons: z.array(PersonSchema),
    otherIncomes: z.array(
      z.object({
        personType: z.enum(["self", "spouse"]),
        description: z.string().optional(),
        amount: z.number().optional(),
        Year: z.number().optional(), // Changed from 'year'
        Year: z.number().optional(), // Changed from 'year'
      })
    ),
    expensesChangeForEachStage: z.boolean().optional(),
    expensesChangeForEachStageSpouse: z.boolean().optional(),
    charitableDonations: z.array(
      z.object({
        personType: z.enum(["self", "spouse"]),
        amount: z.number().optional(),
        Year: z.number().optional(),
        Year: z.number().optional(),
      })
    ),
    oneOffExpenses: z.array(
      z.object({
        personType: z.enum(["self", "spouse"]),
        description: z.string().optional(),
        amount: z.number().optional(),
        year: z.number().optional(),
      })
    ),
    primaryResidenceValue: z.number().optional(),
    primaryResidenceSell: z.boolean().optional(),
    desiredEstateValue: z.number().optional(),
  })
  .refine(
    (data) => {
      return data.persons.some((person) => person.personType === "self");
    },
    {
      message: "At least one person with type 'self' is required.",
      path: ["persons"],
    }
  )
  .refine(
    (data) => {
      return (
        data.calculateForSpouse === false ||
        data.persons.some((person) => person.personType === "spouse")
      );
    },
    {
      message:
        "When 'calculateForSpouse' is true, a person with type 'spouse' is required.",
      path: ["persons"],
    }
  );

export { CalculatorSchema };
