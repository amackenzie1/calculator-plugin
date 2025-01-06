import * as z from "zod";

const CalculatorSchema = z.object({
  calculateForSpouse: z.boolean(),
  birthDateSelf: z.date().optional(),
  birthDateSpouse: z.date().optional(),
  lifeExpectancySelf: z
    .number()
    .min(0, { message: "Must be 0 or greater" })
    .max(130, { message: "Must be 130 or less" })
    .default(100),
  lifeExpectancySpouse: z
    .number()
    .min(0, { message: "Must be 0 or greater" })
    .max(130, { message: "Must be 130 or less" })
    .default(100),
  province: z.string().optional(),
  advancedMode: z.boolean().default(false),
  employmentIncomeSelf: z.number().optional(),
  employmentIncomeSpouse: z.number().optional(),
  incomeDateRangeSelf: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  incomeDateRangeSpouse: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  startingYearlyRevenueSelf: z.number().optional(),
  startingYearlyRevenueSpouse: z.number().optional(),
  currentYearlyRevenueSelf: z.number().optional(),
  currentYearlyRevenueSpouse: z.number().optional(),
  projectedMaxYearlyRevenueSelf: z.number().optional(),
  projectedMaxYearlyRevenueSpouse: z.number().optional(),
  yearsToReachMaxRevenueSelf: z.number().optional(),
  yearsToReachMaxRevenueSpouse: z.number().optional(),
  convertedYearlyIncomeSelf: z.number().optional(),
  convertedYearlyIncomeSpouse: z.number().optional(),
  otherIncomes: z.array(
    z.object({
      id: z.number(),
      description: z.string().optional(), // Description is now a string
      isAnnuity: z.boolean(),
      amount: z.number().optional(),
      year: z.number().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    })
  ),
  registeredInvestments: z
    .array(
      z.object({
        id: z.number(),
        accountType: z.string().optional(),
        currentValueSelf: z.number().optional(),
        currentValueSpouse: z.number().optional(),
      })
    )
    .optional(),
  nonRegisteredInvestmentValueSelf: z.number().optional(),
  nonRegisteredInvestmentValueSpouse: z.number().optional(),
  nonRegisteredInvestmentOpeningYearSelf: z.date().optional(),
  nonRegisteredInvestmentOpeningYearSpouse: z.date().optional(),
  nonRegisteredInvestmentBookValueSelf: z.number().optional(),
  nonRegisteredInvestmentBookValueSpouse: z.number().optional(),
  calculateNonRegisteredBookValueSelf: z.boolean().optional(),
  calculateNonRegisteredBookValueSpouse: z.boolean().optional(),
  lifeInsuranceDeathBenefitSelf: z.number().optional(),
  lifeInsuranceDeathBenefitSpouse: z.number().optional(),
});

export default CalculatorSchema;
