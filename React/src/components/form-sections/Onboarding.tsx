import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { CalculatorSchema } from '../Schema'

interface OnboardingCardProps {
  form: UseFormReturn<z.infer<typeof CalculatorSchema>>
}

const OnboardingCard = ({ form }: OnboardingCardProps) => {
  const canadianProvinces = [
    { label: 'Alberta', value: 'AB' },
    { label: 'British Columbia', value: 'BC' },
    { label: 'Manitoba', value: 'MB' },
    { label: 'New Brunswick', value: 'NB' },
    { label: 'Newfoundland and Labrador', value: 'NL' },
    { label: 'Nova Scotia', value: 'NS' },
    { label: 'Ontario', value: 'ON' },
    { label: 'Prince Edward Island', value: 'PE' },
    { label: 'Quebec', value: 'QC' },
    { label: 'Saskatchewan', value: 'SK' },
    { label: 'Northwest Territories', value: 'NT' },
    { label: 'Nunavut', value: 'NU' },
    { label: 'Yukon', value: 'YT' },
  ]

  const investorProfiles = [
    { label: 'Risk Averse (3%)', value: 'risk_averse', rate: 3 },
    { label: 'Conservative (4%)', value: 'conservative', rate: 4 },
    { label: 'Moderate (5%)', value: 'moderate', rate: 5 },
    { label: 'Aggressive (6%)', value: 'aggressive', rate: 6 },
    { label: 'Speculative (7%)', value: 'speculative', rate: 7 },
  ]

  useEffect(() => {
    const calculateInvestmentReturnRate = () => {
      const investorProfile = form.getValues('investorProfile')
      const specifyReturn = form.getValues('specifyReturn')

      if (investorProfile && investorProfile !== 'custom') {
        const selectedProfile = investorProfiles.find(
          (profile) => profile.value === investorProfile
        )
        return selectedProfile ? selectedProfile.rate : null
      }
      return specifyReturn ? null : null
    }

    const newInvestmentReturnRate = calculateInvestmentReturnRate()
    const currentInvestmentReturnRate = form.getValues('investmentReturnRate')

    if (newInvestmentReturnRate !== currentInvestmentReturnRate) {
      form.setValue('investmentReturnRate', newInvestmentReturnRate ?? null)
    }
  }, [form.watch('investorProfile'), form.watch('specifyReturn')])

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.calculateForSpouse) {
        if (!value.persons?.some((p) => p?.personType === 'spouse')) {
          form.setValue('persons.1', {
            personType: 'spouse',
            birthYear: null,
            lifeExpectancy: null,
            primaryYearlyIncome: null,
            incomeStartAge: null,
            incomeEndAge: null,
            incomeYearStart: null,
            incomeYearEnd: null,
            cppStartYear: null,
            cppStartAge: null,
            cppAmount: null,
            oasStartYear: null,
            oasStartAge: null,
            oasAmount: null,
            definedBenefitPensionStartYear: null,
            definedBenefitPensionStartAge: null,
            definedBenefitPensionAmount: null,
            definedBenefitPensionIndexedToInflation: null,
            registeredInvestments: [],
            nonRegisteredInvestmentValue: null,
            nonRegisteredInvestmentOpeningYear: null,
            nonRegisteredInvestmentBookValue: null,
            lifeInsuranceDeathBenefit: null,
            annualExpenses: null,
            healthCareExpenses: null,
          })
        }
      } else if (form.getValues('persons').length > 1) {
        form.setValue('persons', [form.getValues('persons')[0]])
      }
    })

    return () => subscription.unsubscribe()
  }, [form.watch('calculateForSpouse')])

  return (
    <Card className="form-card">
      <CardHeader className="form-card-header">
        <CardTitle className="form-card-title text-primary">
          General Information
        </CardTitle>
        <p className="form-card-description">
          To discover your Essential and Surplus Capital, let's start with some
          general questions.
        </p>
      </CardHeader>
      <CardContent className="form-card-content">
        <Form {...form}>
          <form className="space-y-8">
            {/* Personal Information Section */}
            <div className="form-section">
              <h3 className="form-section-title">Personal Information</h3>
              <TooltipProvider>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="calculateForSpouse"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <FormLabel>Calculate for Spouse</FormLabel>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help text-muted-foreground">
                                  (?)
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Select if you want to include your spouse in
                                  the calculations.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Include your spouse in the financial calculations
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="persons.0.birthYear"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>Your Birth Year</FormLabel>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help text-muted-foreground">
                                  (?)
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Enter the year you were born. We will use this
                                  to calculate your age.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter birth year"
                              value={field.value?.toString() ?? ''}
                              onChange={(e) => {
                                const value = e.target.value
                                field.onChange(value ? parseInt(value) : null)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch('calculateForSpouse') && (
                      <FormField
                        control={form.control}
                        name="persons.1.birthYear"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormLabel>Spouse's Birth Year</FormLabel>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help text-muted-foreground">
                                    (?)
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Enter the year your spouse was born.</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter spouse's birth year"
                                value={field.value?.toString() ?? ''}
                                onChange={(e) => {
                                  const value = e.target.value
                                  field.onChange(value ? parseInt(value) : null)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="persons.0.lifeExpectancy"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>Your Life Expectancy</FormLabel>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help text-muted-foreground">
                                  (?)
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Enter the age by which you will likely have
                                  passed away. You can be conservative with your
                                  estimate to start with and adjust it after if
                                  necessary to assess its impact on your
                                  finances. Most retirement calculators
                                  recommend age 91, but we suggest entering age
                                  100 at first to be safe.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter life expectancy"
                              value={field.value?.toString() ?? ''}
                              onChange={(e) => {
                                const value = e.target.value
                                field.onChange(value ? parseInt(value) : null)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch('calculateForSpouse') && (
                      <FormField
                        control={form.control}
                        name="persons.1.lifeExpectancy"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormLabel>Spouse's Life Expectancy</FormLabel>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help text-muted-foreground">
                                    (?)
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Enter the age by which your spouse will
                                    likely have passed away. We suggest entering
                                    age 100 at first to be safe.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter spouse's life expectancy"
                                value={field.value?.toString() ?? ''}
                                onChange={(e) => {
                                  const value = e.target.value
                                  field.onChange(value ? parseInt(value) : null)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Province</FormLabel>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help text-muted-foreground">
                                (?)
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Select your province of residence.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {canadianProvinces.map((province) => (
                              <SelectItem
                                key={province.value}
                                value={province.value}
                              >
                                {province.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TooltipProvider>
            </div>

            {/* Investment Profile Section */}
            <div className="form-section">
              <h3 className="form-section-title">Investment Profile</h3>
              <TooltipProvider>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="investorProfile"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Investment Risk Profile</FormLabel>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help text-muted-foreground">
                                (?)
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Each investor profile selection is designated a
                                rate of return percentage to be applied to your
                                assets and investments. Choose the appropriate
                                option ranging from low-risk i.e., risk averse,
                                to high-risk i.e., speculative, that best fits
                                your investment outlook. Please note that the
                                investor profile type you select will also be
                                applied to your spouse if you have included them
                                in your calculations. Investor Profile Options:
                                Risk Averse 3%, Conservative 4%, Moderate 5%,
                                Aggressive 6%, Speculative 7%
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            const selectedProfile = investorProfiles.find(
                              (profile) => profile.value === value
                            )
                            form.setValue(
                              'investmentReturnRate',
                              selectedProfile?.rate ?? 0
                            )
                          }}
                          value={field.value ?? undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select investor profile" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {investorProfiles.map((profile) => (
                              <SelectItem
                                key={profile.value}
                                value={profile.value}
                              >
                                {profile.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="inflationRate"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Inflation Rate (%)</FormLabel>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help text-muted-foreground">
                                (?)
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Enter the average rate of inflation that you
                                think will apply during the rest of your life.
                                This is the rate of inflation that will apply to
                                all your assets and your cost of living. The
                                historical rate of inflation in Canada and the
                                USA has been 2-3%.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Enter inflation rate"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value
                              field.onChange(value ? parseFloat(value) : null)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TooltipProvider>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default OnboardingCard
