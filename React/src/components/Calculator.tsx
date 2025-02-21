// File: src/components/Calculator.tsx
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { projectNetWorth } from '@/lib/calculator/projection'
import { yearFromBirthYearAndTargetAge } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import AssetsCard from './form-sections/Assets'
import ExpensesCard from './form-sections/Expenses'
import IncomeCard from './form-sections/Income'
import OnboardingCard from './form-sections/Onboarding'
import ResultsCard from './form-sections/Results'
import { CalculatorSchema, CalculatorSchemaType } from './Schema'

const Calculator = () => {
  const form = useForm<z.infer<typeof CalculatorSchema>>({
    resolver: zodResolver(CalculatorSchema),
    defaultValues: {
      calculateForSpouse: false,
      expensesChangeForEachStage: false,
      expensesChangeForEachStageSpouse: false,
      investmentReturnRate: null,
      province: 'ON',
      persons: [
        {
          personType: 'self',
          birthYear: null,
          lifeExpectancy: null,
          primaryYearlyIncome: null,
          incomeYearStart: null,
          incomeYearEnd: null,
          cppStartYear: null,
          cppAmount: null,
          oasStartYear: null,
          oasAmount: null,
          definedBenefitPensionStartYear: null,
          definedBenefitPensionAmount: null,
          definedBenefitPensionIndexedToInflation: null,
          registeredInvestments: [],
          nonRegisteredInvestmentValue: null,
          nonRegisteredInvestmentOpeningYear: null,
          nonRegisteredInvestmentBookValue: null,
          lifeInsuranceDeathBenefit: null,
          annualExpenses: null,
          healthCareExpenses: null,
        },
      ],
      otherIncomes: [],
      charitableDonations: [],
      oneOffExpenses: [],
    },
  })

  const calculateForSpouse = form.watch('calculateForSpouse')
  const birthYearSelf = form.watch('persons.0.birthYear') ?? undefined
  const birthYearSpouse = calculateForSpouse
    ? form.watch('persons.1.birthYear') ?? undefined
    : undefined

  // Projection state
  const [projectionData, setProjectionData] = useState<
    { year: number; netWorth: number }[]
  >([])

  const onSubmit = (data: CalculatorSchemaType) => {
    // Use the projection module to get the data
    console.log('data', data)
    const projection = projectNetWorth(data)
    setProjectionData(projection)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center text-primary mb-12">
        Financial Calculator
      </h1>
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="general" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 h-14 text-lg">
            <TabsTrigger value="general" className="text-lg">
              General
            </TabsTrigger>
            <TabsTrigger value="income" className="text-lg">
              Income
            </TabsTrigger>
            <TabsTrigger value="assets" className="text-lg">
              Assets
            </TabsTrigger>
            <TabsTrigger value="expenses" className="text-lg">
              Expenses
            </TabsTrigger>
            <TabsTrigger value="results" className="text-lg">
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <OnboardingCard form={form} />
          </TabsContent>
          <TabsContent value="income">
            <IncomeCard
              form={form}
              calculateForSpouse={calculateForSpouse}
              birthYearSelf={birthYearSelf}
              birthYearSpouse={birthYearSpouse}
              yearFromBirthYearAndTargetAge={yearFromBirthYearAndTargetAge}
            />
          </TabsContent>
          <TabsContent value="assets">
            <AssetsCard form={form} />
          </TabsContent>
          <TabsContent value="expenses">
            <ExpensesCard form={form} calculateForSpouse={calculateForSpouse} />
          </TabsContent>
          <TabsContent value="results">
            <ResultsCard projectionData={projectionData} />
          </TabsContent>
        </Tabs>
        <div className="mt-8 flex justify-center">
          <Button
            onClick={form.handleSubmit(onSubmit)}
            size="lg"
            className="w-full max-w-xs"
          >
            Calculate Results
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Calculator
