import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import * as z from 'zod'
import { CalculatorSchema } from '@/lib/schema/calculator'
import { NumberInput, SelectField, FormSection, SelfSpouseFields, FormFieldWithTooltip, SwitchField } from '@/components/form'
import { fieldPath } from '@/lib/form-helpers'

interface AssetsCardProps {
  form: UseFormReturn<z.infer<typeof CalculatorSchema>>
  calculateForSpouse?: boolean
}

const AssetsCard = ({ form, calculateForSpouse = false }: AssetsCardProps) => {
  const primaryResidenceSell = form.watch('primaryResidenceSell')
  const persons = form.watch('persons')

  const filteredPersons = calculateForSpouse
    ? persons
    : persons.filter((person) => person.personType === 'self')

  const handleAddRegisteredInvestment = (personType: 'self' | 'spouse') => {
    const currentPersons = form.getValues('persons')
    const updatedPersons = currentPersons.map((person) => {
      if (person.personType === personType) {
        return {
          ...person,
          registeredInvestments: [
            ...(person.registeredInvestments ?? []),
            {
              id: Date.now(),
              accountType: null,
              currentValue: null,
            },
          ],
        }
      }
      return person
    })
    form.setValue('persons', updatedPersons)
  }

  const handleRemoveRegisteredInvestment = (
    personType: 'self' | 'spouse',
    id: number
  ) => {
    const currentPersons = form.getValues('persons')
    const updatedPersons = currentPersons.map((person) => {
      if (person.personType === personType) {
        return {
          ...person,
          registeredInvestments:
            person.registeredInvestments?.filter(
              (investment) => investment.id !== id
            ) ?? [],
        }
      }
      return person
    })
    form.setValue('persons', updatedPersons)
  }

  const registeredInvestmentOptions = [
    { value: 'TFSA', label: 'TFSA' },
    { value: 'RRSP', label: 'RRSP' },
    { value: 'RRIF', label: 'RRIF' },
    { value: 'LIRA', label: 'LIRA' },
    { value: 'LIF', label: 'LIF' },
  ]

  const homeOwnershipOptions = [
    { value: 'joint', label: 'Joint Ownership' },
    { value: 'self', label: 'Self Only' },
    { value: 'spouse', label: 'Spouse Only' },
  ]

  // Autofill for development
  useEffect(() => {
    // TODO: Remove this useEffect for production - for development autofill
    const autoFillFlag = 'formAutoFilled_Assets';
    if (process.env.NODE_ENV === 'development' && !sessionStorage.getItem(autoFillFlag)) {
      // My non-RRSP investments $300,123 (Cost 200123)
      form.setValue('persons.0.nonRegisteredInvestmentValue', 300123);
      form.setValue('persons.0.nonRegisteredInvestmentBookValue', 200123);

      // Spouse non-RRSP investments $30,000 (Cost 20,000)
      form.setValue('persons.1.nonRegisteredInvestmentValue', 30000);
      form.setValue('persons.1.nonRegisteredInvestmentBookValue', 20000);

      // My life insurance $400,000 spouse life insurance $100,000
      form.setValue('persons.0.lifeInsuranceDeathBenefit', 400000);
      form.setValue('persons.1.lifeInsuranceDeathBenefit', 100000);

      // Primary residence worth $800,000 won't sell it
      form.setValue('primaryResidenceValue', 800000);
      form.setValue('primaryResidenceSell', false);
      form.setValue('homeOwnership', 'joint');

      // My TFSA balance $15,100 spouse TFSA balance $55,050.21
      const currentPersons = form.getValues('persons');
      const updatedPersons = currentPersons.map((person) => {
        if (person.personType === 'self') {
          return {
            ...person,
            registeredInvestments: [
              {
                id: Date.now(),
                accountType: 'TFSA' as const,
                currentValue: 15100,
              },
            ],
          };
        } else if (person.personType === 'spouse') {
          return {
            ...person,
            registeredInvestments: [
              {
                id: Date.now() + 1,
                accountType: 'TFSA' as const,
                currentValue: 55050.21,
              },
            ],
          };
        }
        return person;
      });
      form.setValue('persons', updatedPersons);

      sessionStorage.setItem(autoFillFlag, 'true');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return (
    <Card className="form-card">
      <CardHeader className="form-card-header">
        <CardTitle className="form-card-title text-primary">
          Assets & Investments
        </CardTitle>
        <p className="form-card-description">
          Tell us about your savings, investments, and property.
        </p>
      </CardHeader>
      <CardContent className="form-card-content">
        <Form {...form}>
          <form className="space-y-8">
            {/* Registered Investments Section */}
            <FormSection
              title="Registered Investments"
              tooltip="Include all retirement and registered accounts"
            >
              <div className="space-y-6">
                {filteredPersons.map((person, personIndex) => {
                  const personLabel = person.personType === 'self' ? 'Your' : "Spouse's"
                  return (
                    <div key={person.personType} className="space-y-4">
                      <h4 className="text-lg font-medium">
                        {personLabel} Registered Investments
                      </h4>
                      
                      {person.registeredInvestments?.map((investment, investmentIndex) => (
                        <div
                          key={investment.id}
                          className="border rounded-lg p-4 space-y-4"
                        >
                          <div className="flex justify-between items-center">
                            <FormFieldWithTooltip
                              label={`Investment ${investmentIndex + 1}`}
                              tooltip={
                                investment.accountType === 'TFSA' ? 'Tax-Free Savings Account: Contributions are not tax-deductible, but withdrawals are tax-free.'
                                : investment.accountType === 'RRSP' ? 'Registered Retirement Savings Plan: Contributions are tax-deductible, withdrawals are taxed as income.'
                                : investment.accountType === 'RRIF' ? 'Registered Retirement Income Fund: Converted from RRSP, requires minimum annual withdrawals.'
                                : investment.accountType === 'LIRA' ? 'Locked-In Retirement Account: Cannot withdraw until retirement age.'
                                : investment.accountType === 'LIF' ? 'Life Income Fund: Converted from LIRA, provides retirement income with withdrawal limits.'
                                : 'Select an account type to see more information.'
                              }
                            >
                              <h5 className="font-medium">Investment {investmentIndex + 1}</h5>
                            </FormFieldWithTooltip>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveRegisteredInvestment(
                                  person.personType as 'self' | 'spouse',
                                  investment.id
                                )
                              }
                            >
                              Remove
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField
                              control={form.control}
                              name={fieldPath<z.infer<typeof CalculatorSchema>>(`persons.${personIndex}.registeredInvestments.${investmentIndex}.accountType`)}
                              label="Account Type"
                              placeholder="Select account type"
                              options={registeredInvestmentOptions}
                            />
                            <NumberInput
                              control={form.control}
                              name={fieldPath<z.infer<typeof CalculatorSchema>>(`persons.${personIndex}.registeredInvestments.${investmentIndex}.currentValue`)}
                              label="Current Value"
                              placeholder="Enter amount"
                              type="decimal"
                            />
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          handleAddRegisteredInvestment(person.personType as 'self' | 'spouse')
                        }
                      >
                        Add {personLabel} Registered Investment
                      </Button>
                    </div>
                  )
                })}
              </div>
            </FormSection>

            {/* Non-Registered Investments Section */}
            <FormSection
              title="Non-Registered Investments"
              tooltip="Enter information about your taxable investment accounts, stocks, bonds, GICs, or other non-registered investments."
            >
              <SelfSpouseFields
                calculateForSpouse={calculateForSpouse}
                selfContent={
                  <div className="space-y-4">
                    <FormFieldWithTooltip
                      label="Your Non-Registered Investments"
                      tooltip="Capital gains on these investments are taxable. In Canada, 50% of capital gains are included in taxable income."
                    >
                      <h4 className="text-lg font-medium">Your Non-Registered Investments</h4>
                    </FormFieldWithTooltip>
                    <NumberInput
                      control={form.control}
                      name="persons.0.nonRegisteredInvestmentValue"
                      label="Current Value"
                      placeholder="Enter current value"
                      type="decimal"
                    />
                    <NumberInput
                      control={form.control}
                      name="persons.0.nonRegisteredInvestmentBookValue"
                      label="Book Value (Cost Basis)"
                      placeholder="Enter original cost"
                      type="decimal"
                    />
                  </div>
                }
                spouseContent={
                  <div className="space-y-4">
                    <FormFieldWithTooltip
                      label="Spouse's Non-Registered Investments"
                      tooltip="Capital gains on these investments are taxable. In Canada, 50% of capital gains are included in taxable income."
                    >
                      <h4 className="text-lg font-medium">Spouse's Non-Registered Investments</h4>
                    </FormFieldWithTooltip>
                    <NumberInput
                      control={form.control}
                      name="persons.1.nonRegisteredInvestmentValue"
                      label="Current Value"
                      placeholder="Enter current value"
                      type="decimal"
                    />
                    <NumberInput
                      control={form.control}
                      name="persons.1.nonRegisteredInvestmentBookValue"
                      label="Book Value (Cost Basis)"
                      placeholder="Enter original cost"
                      type="decimal"
                    />
                  </div>
                }
              />
            </FormSection>

            {/* Life Insurance Section */}
            <FormSection
              title="Life Insurance"
              tooltip="Enter the death benefit amount for term or permanent life insurance policies. Only include policies where the surviving spouse (or estate) is the beneficiary."
            >
              <SelfSpouseFields
                calculateForSpouse={calculateForSpouse}
                selfContent={
                  <NumberInput
                    control={form.control}
                    name="persons.0.lifeInsuranceDeathBenefit"
                    label="Your Death Benefit Amount"
                    placeholder="Enter death benefit"
                    type="decimal"
                  />
                }
                spouseContent={
                  <NumberInput
                    control={form.control}
                    name="persons.1.lifeInsuranceDeathBenefit"
                    label="Spouse's Death Benefit Amount"
                    placeholder="Enter death benefit"
                    type="decimal"
                  />
                }
              />
            </FormSection>

            {/* Primary Residence Section */}
            <FormSection
              title="Primary Residence"
              tooltip="Your primary residence is typically exempt from capital gains tax in Canada. Include the current market value if you own your home."
            >
              <div className="space-y-6">
                <NumberInput
                  control={form.control}
                  name="primaryResidenceValue"
                  label="Current Market Value"
                  placeholder="Enter current value"
                  type="decimal"
                />

                <SwitchField
                  control={form.control}
                  name="primaryResidenceSell"
                  label="Plan to Sell Primary Residence"
                  description="Do you plan to sell your home during retirement?"
                />

                <SwitchField
                  control={form.control}
                  name="allowHomeBorrowing"
                  label="Allow Borrowing Against Home"
                  description="Enable use of home equity for donations or cash needs (e.g., reverse mortgage)."
                />

                <NumberInput
                  control={form.control}
                  name="borrowingRate"
                  label="Borrowing Interest Rate (%)"
                  placeholder="Enter borrowing rate (e.g., 5)"
                  type="decimal"
                />

                {calculateForSpouse && (
                  <SelectField
                    control={form.control}
                    name="homeOwnership"
                    label="Home Ownership"
                    placeholder="Select ownership type"
                    options={homeOwnershipOptions}
                  />
                )}

                {primaryResidenceSell && (
                  <NumberInput
                    control={form.control}
                    name="primaryResidenceSellYear"
                    label="Planned Sale Year"
                    placeholder="Enter year"
                    skipFormatting
                  />
                )}
              </div>
            </FormSection>

            <FormSection
              title="Withdrawal Preferences"
              tooltip="Control how cash needs are met."
            >
              <SwitchField
                control={form.control}
                name="withdrawOnlyNeededFromInvestments"
                label="Use Income Before Investment Withdrawals"
                description="Only withdraw from investments after applying annual income; reduces unnecessary capital gains and tax."
              />
            </FormSection>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default AssetsCard
