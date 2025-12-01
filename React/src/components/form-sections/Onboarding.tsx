import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { CalculatorSchema } from '@/lib/schema/calculator'
import { NumberInput, SelectField, FormSection, SelfSpouseFields, SwitchField } from '@/components/form'

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
    { label: 'None (0%)', value: 'none', rate: 0 },
    { label: 'Risk Averse (3%)', value: 'risk_averse', rate: 3 },
    { label: 'Conservative (4%)', value: 'conservative', rate: 4 },
    { label: 'Moderate (5%)', value: 'moderate', rate: 5 },
    { label: 'Aggressive (6%)', value: 'aggressive', rate: 6 },
    { label: 'Speculative (7%)', value: 'speculative', rate: 7 },
  ]

  const calculateForSpouse = form.watch('calculateForSpouse')
  const investorProfile = form.watch('investorProfile')
  const specifyReturn = form.watch('specifyReturn')
  const nonRegBreakdown = form.watch('nonRegisteredReturnBreakdown')

  useEffect(() => {
    const calculateInvestmentReturnRate = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investorProfile, specifyReturn])

  useEffect(() => {
    // TODO: Remove this useEffect for production - for development autofill
    // This effect is intended to run only once on mount for development purposes.
    const autoFillFlag = 'formAutoFilled_Onboarding';
    if (process.env.NODE_ENV === 'development' && !sessionStorage.getItem(autoFillFlag)) {
      // console.log('Autofilling OnboardingCard form for development...'); // Uncomment for debugging

      form.setValue('calculateForSpouse', true);
      form.setValue('persons.0.birthYear', 1946);
      form.setValue('persons.1.birthYear', 1945);
      form.setValue('persons.0.lifeExpectancy', 99);
      form.setValue('persons.1.lifeExpectancy', 99);

      sessionStorage.setItem(autoFillFlag, 'true');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return (
    <Card className="form-card">
      <CardHeader className="form-card-header">
        <CardTitle className="form-card-title text-primary">
          Personal Information
        </CardTitle>
        <p className="form-card-description">
          Tell us about yourself and your financial planning preferences.
        </p>
      </CardHeader>
      <CardContent className="form-card-content">
        <Form {...form}>
          <form className="space-y-8">
            {/* Spouse Calculation Section */}
            <FormSection title="Family Status">
              <SwitchField
                control={form.control}
                name="calculateForSpouse"
                label="Calculate for Spouse"
                description="Include spouse/partner in the financial calculations"
              />
            </FormSection>

            {/* Personal Details Section */}
            <FormSection
              title="Personal Details"
              description="Enter birth year and life expectancy for retirement planning"
              tooltip="Life expectancy helps determine how long your retirement savings need to last. The average life expectancy in Canada is about 82 years, but many people plan for 90-95 years to be conservative."
            >
              <SelfSpouseFields
                calculateForSpouse={calculateForSpouse}
                selfContent={
                  <div className="space-y-4">
                    <NumberInput
                      control={form.control}
                      name="persons.0.birthYear"
                      label="Your Birth Year"
                      placeholder="Enter birth year (e.g., 1975)"
                      skipFormatting
                    />
                    <NumberInput
                      control={form.control}
                      name="persons.0.lifeExpectancy"
                      label="Your Life Expectancy"
                      placeholder="Enter expected age (e.g., 90)"
                    />
                  </div>
                }
                spouseContent={
                  <div className="space-y-4">
                    <NumberInput
                      control={form.control}
                      name="persons.1.birthYear"
                      label="Spouse's Birth Year"
                      placeholder="Enter birth year (e.g., 1975)"
                      skipFormatting
                    />
                    <NumberInput
                      control={form.control}
                      name="persons.1.lifeExpectancy"
                      label="Spouse's Life Expectancy"
                      placeholder="Enter expected age (e.g., 90)"
                    />
                  </div>
                }
              />
            </FormSection>

            {/* Location Section */}
            <FormSection
              title="Location"
              description="Select your province of residence for tax calculations"
            >
              <SelectField
                control={form.control}
                name="province"
                label="Province/Territory"
                placeholder="Select your province"
                options={canadianProvinces}
              />
            </FormSection>

            {/* Investment Profile Section */}
            <FormSection
              title="Investment Profile"
              description="Choose your investment risk profile or specify a custom return rate"
              tooltip="Your investor profile determines the expected annual return on your investments. Conservative investors typically see 3-4% returns, while aggressive investors might target 6-7%."
            >
              <div className="space-y-4">
                <SelectField
                  control={form.control}
                  name="investorProfile"
                  label="Investor Profile"
                  placeholder="Select your risk profile"
                  options={[...investorProfiles, { label: 'Custom', value: 'custom', rate: 0 }]}
                />

                {investorProfile === 'custom' && (
                  <SwitchField
                    control={form.control}
                    name="specifyReturn"
                    label="Specify Custom Return"
                    description="Enter a custom investment return rate"
                  />
                )}

                {specifyReturn && investorProfile === 'custom' && (
                  <NumberInput
                    control={form.control}
                    name="investmentReturnRate"
                    label="Annual Return Rate (%)"
                    placeholder="Enter return rate (e.g., 5.5)"
                    type="decimal"
                  />
                )}
              </div>
            </FormSection>

            <div className="rounded-lg border p-4 bg-muted/30">
              <h4 className="text-sm font-semibold">Non-Registered Return Breakdown</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Used for tax treatment of the selected return rate.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Interest</div>
                  <div className="font-medium">{Math.round((nonRegBreakdown?.interest ?? 0) * 100)}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Eligible Dividends</div>
                  <div className="font-medium">{Math.round((nonRegBreakdown?.eligibleDividends ?? 0) * 100)}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Capital Gains</div>
                  <div className="font-medium">{Math.round((nonRegBreakdown?.capitalGains ?? 0) * 100)}%</div>
                </div>
              </div>
            </div>

            {/* Inflation Rate Section */}
            <FormSection
              title="Economic Assumptions"
              description="Set the expected inflation rate for your projections"
              tooltip="The Bank of Canada targets 2% inflation. Historical average is around 2-3%."
            >
              <NumberInput
                control={form.control}
                name="inflationRate"
                label="Annual Inflation Rate (%)"
                placeholder="Enter inflation rate (e.g., 2.5)"
                type="decimal"
              />
            </FormSection>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default OnboardingCard
