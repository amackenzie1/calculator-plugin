// File: src/components/Calculator.tsx
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { projectNetWorth } from '@/lib/calculator/projection'
import { initializePerson, yearFromBirthYearAndTargetAge } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import * as z from 'zod'
import AssetsCard from './form-sections/Assets'
import ExpensesCard from './form-sections/Expenses'
import IncomeCard from './form-sections/Income'
import OnboardingCard from './form-sections/Onboarding'
import ResultsCard from './form-sections/Results'
import { CalculatorSchema, CalculatorSchemaType } from './Schema'

const Calculator = () => {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof CalculatorSchema>>({
    resolver: zodResolver(CalculatorSchema),
    defaultValues: {
      calculateForSpouse: false,
      expensesChangeForEachStage: false,
      expensesChangeForEachStageSpouse: false,
      investmentReturnRate: null,
      province: 'ON',
      investorProfile: 'risk_averse',
      inflationRate: 2.5,
      specifyReturn: null,
      persons: [
        initializePerson('self'),
        initializePerson('spouse'), // Initialize both people right away
      ],
      otherIncomes: [],
      charitableDonations: [],
      oneOffExpenses: [],
      primaryResidenceValue: null,
      primaryResidenceSell: null,
      primaryResidenceSellYear: null,
      desiredEstateValue: null,
      incomeReturnRate: null,
      growthReturnRate: null,
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
    // Check minimum required fields
    const self = data.persons[0]
    const requiredFields: { field: string; value: number | null }[] = [
      { field: 'Birth Year', value: self.birthYear },
      { field: 'Life Expectancy', value: self.lifeExpectancy },
      { field: 'Investment Return Rate', value: data.investmentReturnRate },
    ]

    const missingFields = requiredFields
      .filter((field) => field.value === null || field.value === undefined)
      .map((field) => field.field)

    if (missingFields.length > 0) {
      toast({
        title: 'Missing Required Fields',
        description: `Please fill in the following fields: ${missingFields.join(
          ', '
        )}`,
        variant: 'destructive',
      })
      return
    }

    // Filter out spouse data if calculateForSpouse is false
    const formattedData = {
      ...data,
      persons: calculateForSpouse ? data.persons : [data.persons[0]],
    }

    try {
      // Use the projection module to get the data
      console.log('data', formattedData)
      const projection = projectNetWorth(formattedData)
      setProjectionData(projection)

      // Switch to results tab after successful calculation
      const tabsList = document.querySelector('[role="tablist"]') as HTMLElement
      const resultsTab = tabsList?.querySelector(
        '[value="results"]'
      ) as HTMLElement
      resultsTab?.click()

      toast({
        title: 'Calculation Complete',
        description:
          'Your financial projection has been calculated successfully.',
      })
    } catch (error) {
      console.error('Projection calculation error:', error)
      toast({
        title: 'Calculation Error',
        description:
          error instanceof Error
            ? error.message
            : 'There was an error calculating the projection. Please check your inputs and try again.',
        variant: 'destructive',
      })
    }
  }

  const onError = (errors: FieldErrors<CalculatorSchemaType>) => {
    console.error('Form validation errors:', errors)

    // Extract error messages
    const errorMessages = Object.entries(errors).map(([key, value]) => {
      if (key === 'persons') {
        return 'Personal Information: Please check birth year and life expectancy'
      }
      return `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value.message}`
    })

    toast({
      title: 'Validation Error',
      description: errorMessages.join('\n'),
      variant: 'destructive',
    })
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center text-primary mb-12">
        Use It Wisely
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
            <AssetsCard form={form} calculateForSpouse={calculateForSpouse} />
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
            onClick={form.handleSubmit(onSubmit, onError)}
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
