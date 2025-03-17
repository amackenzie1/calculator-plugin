// File: src/components/Calculator.tsx
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { projectNetWorth } from '@/lib/calculator/projection'
import { initializePerson, yearFromBirthYearAndTargetAge } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, InfoIcon, PercentIcon, SaveIcon, UserIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import * as z from 'zod'
import AssetsCard from './form-sections/Assets'
import ExpensesCard from './form-sections/Expenses'
import IncomeCard from './form-sections/Income'
import OnboardingCard from './form-sections/Onboarding'
import ResultsCard from './form-sections/Results'
import { CalculatorSchema, CalculatorSchemaType } from './Schema'

const steps = [
  { id: 'general', label: 'General', icon: UserIcon },
  { id: 'income', label: 'Income', icon: PercentIcon },
  { id: 'assets', label: 'Assets', icon: SaveIcon },
  { id: 'expenses', label: 'Expenses', icon: InfoIcon },
  { id: 'results', label: 'Results', icon: CheckIcon },
]

const Calculator = () => {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof CalculatorSchema>>({
    resolver: zodResolver(CalculatorSchema),
    defaultValues: {
      calculateForSpouse: false,
      expensesChangeForEachStage: false,
      expensesChangeForEachStageSpouse: false,
      investmentReturnRate: null,
      province: 'QC',
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

  // Store the submitted data for CSV export
  const [submittedData, setSubmittedData] = useState<
    CalculatorSchemaType | undefined
  >(undefined)

  // Current step (tab)
  const [currentTab, setCurrentTab] = useState('general')
  
  // Completed steps tracker
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    general: false,
    income: false,
    assets: false,
    expenses: false,
    results: false,
  })

  // Calculate progress percentage
  const progressPercentage = Math.max(
    (Object.values(completedSteps).filter(Boolean).length / (steps.length - 1)) * 100,
    (steps.findIndex(step => step.id === currentTab) / (steps.length - 1)) * 100
  )

  // Handle tab change
  const handleTabChange = (value: string) => {
    setCurrentTab(value)
  }

  // Move to next step
  const handleNext = () => {
    const currentIndex = steps.findIndex(step => step.id === currentTab)
    
    // If we're on the expenses tab (last tab before results), calculate results
    if (currentTab === "expenses") {
      form.handleSubmit(onSubmit, onError)()
      return
    }
    
    // Otherwise, proceed to the next tab
    if (currentIndex < steps.length - 1) {
      const nextStepId = steps[currentIndex + 1].id
      setCurrentTab(nextStepId)
      
      // Mark current step as completed
      setCompletedSteps(prev => ({
        ...prev,
        [currentTab]: true
      }))
    }
  }

  // Move to previous step
  const handlePrevious = () => {
    const currentIndex = steps.findIndex(step => step.id === currentTab)
    if (currentIndex > 0) {
      const prevStepId = steps[currentIndex - 1].id
      setCurrentTab(prevStepId)
    }
  }

  // Check if this is the first or last step
  const isFirstStep = currentTab === steps[0].id
  const isLastStep = currentTab === steps[steps.length - 1].id
  const isResultsTab = currentTab === 'results'

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

      // Store the submitted data for CSV export
      setSubmittedData(formattedData)

      // Switch to results tab after successful calculation
      setCurrentTab('results')
      
      // Mark all previous steps as completed
      setCompletedSteps({
        general: true,
        income: true,
        assets: true,
        expenses: true,
        results: true,
      })

      toast({
        title: 'Calculation Complete',
        description:
          'Your financial projection has been calculated successfully.',
        variant: 'default',
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

  // Update the browser tab title based on the current step
  useEffect(() => {
    const currentStep = steps.find(step => step.id === currentTab)
    if (currentStep) {
      document.title = `Use It Wisely | ${currentStep.label}`
    }
  }, [currentTab])

  return (
    <div className="space-y-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center space-y-2">
          <h2 className="text-3xl font-bold text-primary">Financial Projection Calculator</h2>
          <p className="text-muted-foreground">Plan your financial future with precision</p>
        </div>
        
        {/* Progress bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
        </div>
        
        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 h-16 p-1">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isCompleted = completedSteps[step.id]
              const isActive = currentTab === step.id
              
              return (
                <TabsTrigger 
                  key={step.id} 
                  value={step.id} 
                  className={`text-base flex items-center gap-2 transition-all ${
                    isActive ? 'tab-active' : ''
                  } ${isCompleted ? 'tab-completed' : ''}`}
                  disabled={step.id === 'results' && !submittedData}
                >
                  <span className={`tab-indicator`}>
                    {isCompleted ? <CheckIcon size={14} /> : index + 1}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">
                    <StepIcon size={16} />
                  </span>
                </TabsTrigger>
              )
            })}
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
            <ResultsCard
              projectionData={projectionData}
              calculatorData={submittedData}
            />
          </TabsContent>
        </Tabs>

        {/* Navigation and submit buttons */}
        <div className="form-navigation">
          {!isFirstStep && !isResultsTab && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon size={16} />
              <span>Previous</span>
            </Button>
          )}
          
          {isFirstStep && <div></div>}
          
          {isResultsTab && (
            <Button
              variant="outline"
              onClick={() => setCurrentTab('general')}
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon size={16} />
              <span>Back to Start</span>
            </Button>
          )}
          
          {!isLastStep ? (
            <Button
              onClick={handleNext}
              className="flex items-center gap-2 ml-auto"
            >
              <span>{currentTab !== "expenses" ? "Next" : "Calculate & View Results"}</span>
              {currentTab === "expenses" ? <CheckIcon size={16} /> : <ArrowRightIcon size={16} />}
            </Button>
          ) : (
            <div></div>
          )}
          
          {!isResultsTab && currentTab !== "expenses" && (
            <Button
              onClick={form.handleSubmit(onSubmit, onError)}
              size="lg"
              className="flex items-center gap-2"
              variant={isLastStep ? "default" : "secondary"}
            >
              <CheckIcon size={16} />
              <span>Calculate Results</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Calculator
