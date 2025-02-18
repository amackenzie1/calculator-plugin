// File: src/components/Calculator.tsx
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { projectNetWorth } from '@/lib/calculator/projection'
import { yearFromBirthYearAndTargetAge } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
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
      persons: [
        {
          personType: 'self',
          birthYear: undefined,
          lifeExpectancy: undefined,
          primaryYearlyIncome: undefined,
          incomeYearStart: undefined,
          incomeYearEnd: undefined,
          cppStartYear: undefined,
          cppAmount: undefined,
          oasStartYear: undefined,
          oasAmount: undefined,
          definedBenefitPensionStartYear: undefined,
          definedBenefitPensionAmount: undefined,
          definedBenefitPensionIndexedToInflation: undefined,
          registeredInvestments: [],
          nonRegisteredInvestmentValue: undefined,
          nonRegisteredInvestmentOpeningYear: undefined,
          nonRegisteredInvestmentBookValue: undefined,
          lifeInsuranceDeathBenefit: undefined,
          annualRetirementExpenses: undefined,
          healthCareExpenses: undefined,
          annualRetirementExpensesStage2: undefined,
          healthCareExpensesStage2: undefined,
          annualRetirementExpensesStage3: undefined,
          healthCareExpensesStage3: undefined,
        },
      ],
      province: undefined,
      otherIncomes: [],
      charitableDonations: [],
      oneOffExpenses: [],
    },
  })

  const calculateForSpouse = form.watch('calculateForSpouse')
  const birthYearSelf = form.watch('persons.0.birthYear')
  const birthYearSpouse = calculateForSpouse
    ? form.watch('persons.1.birthYear')
    : undefined

  // Projection state
  const [projectionData, setProjectionData] = useState<
    { year: number; netWorth: number }[]
  >([])

  // Load state from local storage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem('calculatorState')
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      form.reset(parsedData)
    }
  }, [])

  // Save state to local storage whenever form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem('calculatorState', JSON.stringify(value))
    })
    return () => subscription.unsubscribe()
  }, [form])

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
