import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import * as z from 'zod'
import { CalculatorSchema } from '@/lib/schema/calculator'
import { NumberInput, TextInput, FormSection, SelfSpouseFields, FormFieldWithTooltip, SwitchField } from '@/components/form'
import { useFormList } from '@/hooks/useFormList'
import { fieldPath } from '@/lib/form-helpers'

interface IncomeCardProps {
  form: UseFormReturn<z.infer<typeof CalculatorSchema>>
  calculateForSpouse: boolean
  birthYearSelf: number | undefined
  birthYearSpouse: number | undefined
  yearFromBirthYearAndTargetAge: (
    birthYear: number,
    targetAge: number
  ) => number
}

const IncomeCard = ({
  form,
  calculateForSpouse,
  birthYearSelf,
  birthYearSpouse,
  yearFromBirthYearAndTargetAge,
}: IncomeCardProps) => {
  const { handleAdd: handleAddOtherIncome, handleRemove: handleRemoveOtherIncome } = useFormList(form, 'otherIncomes')

  // Autofill for development
  useEffect(() => {
    // TODO: Remove this useEffect for production - for development autofill
    const autoFillFlag = 'formAutoFilled_Income';
    if (process.env.NODE_ENV === 'development' && !sessionStorage.getItem(autoFillFlag)) {
      // My CPP 15000 spouse CPP 10,000 (Start at age 65 for both)
      form.setValue('persons.0.cppAmount', 15000);
      form.setValue('persons.0.cppStartAge', 65);
      form.setValue('persons.1.cppAmount', 10000);
      form.setValue('persons.1.cppStartAge', 65);

      // My OAS 9000 spouse OAS also 9000 (Start at 65 for both)
      form.setValue('persons.0.oasAmount', 9000);
      form.setValue('persons.0.oasStartAge', 65);
      form.setValue('persons.1.oasAmount', 9000);
      form.setValue('persons.1.oasStartAge', 65);

      // No other entries on this page - so ensure otherIncomes arrays are empty or not set if not needed.
      sessionStorage.setItem(autoFillFlag, 'true');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const addOtherIncome = (personType: 'self' | 'spouse') => {
    handleAddOtherIncome({
      id: Date.now(),
      personType: personType,
      description: '',
      amount: null,
      startYear: null,
      endYear: null,
    })
  }

  const handlePrimaryIncomeYearChange = (personType: 'self' | 'spouse', field: 'start' | 'end') => {
    const year = form.getValues(
      `persons.${personType === 'spouse' ? 1 : 0}.${field === 'start' ? 'incomeYearStart' : 'incomeYearEnd'}`
    )
    const birthYear = personType === 'self' ? birthYearSelf : birthYearSpouse

    if (year && birthYear) {
      const age = year - birthYear
      form.setValue(
        `persons.${personType === 'spouse' ? 1 : 0}.${field === 'start' ? 'incomeStartAge' : 'incomeEndAge'}`,
        age
      )
    }
  }

  const handlePensionAgeBlur = (
    personType: 'self' | 'spouse',
    fieldPrefix: 'cpp' | 'oas' | 'definedBenefitPension'
  ) => {
    const values = form.getValues()
    const age =
      values.persons?.[personType === 'spouse' ? 1 : 0]?.[
        `${fieldPrefix}StartAge` as keyof (typeof values.persons)[0]
      ]
    const birthYear = personType === 'self' ? birthYearSelf : birthYearSpouse

    if (age && birthYear) {
      const year = yearFromBirthYearAndTargetAge(birthYear, Number(age))
      form.setValue(
        `persons.${personType === 'spouse' ? 1 : 0}.${fieldPrefix}StartYear`,
        year
      )
    }
  }

  return (
    <Card className="form-card">
      <CardHeader className="form-card-header">
        <CardTitle className="form-card-title text-primary">
          Income Information
        </CardTitle>
        <p className="form-card-description">
          Provide details about your various sources of income.
        </p>
      </CardHeader>
      <CardContent className="form-card-content">
        <Form {...form}>
          <form className="space-y-8">
            {/* Government Benefits Section */}
            <FormSection title="Government Benefits">
              <div className="space-y-6">
                {/* CPP/QPP */}
                <div className="border rounded-lg p-4 space-y-4">
                  <FormFieldWithTooltip
                    label="CPP/QPP"
                    tooltip="The age you start your pension, how long you contributed, and your average earnings throughout your life determine how much CPP or QPP you receive. In 2023 the maximum annual pension for someone retiring at age 65 is $15,678.84 ($1,306.57 per month)."
                  >
                    <h4 className="text-lg font-medium">CPP/QPP</h4>
                  </FormFieldWithTooltip>

                  <SelfSpouseFields
                    calculateForSpouse={calculateForSpouse}
                    selfContent={
                      <div className="space-y-4">
                        <NumberInput
                          control={form.control}
                          name="persons.0.cppStartAge"
                          label="Your Start Age"
                          placeholder="Enter age"
                          onBlur={() => handlePensionAgeBlur('self', 'cpp')}
                        />
                        <NumberInput
                          control={form.control}
                          name="persons.0.cppAmount"
                          label="Your Annual Amount (before tax)"
                          placeholder="Enter amount"
                          type="decimal"
                        />
                        <p className="text-sm text-muted-foreground">
                          If you don't know what your monthly CPP payments will be, you can sign into your My Service Canada Account for your monthly CPP estimate. For QPP, you can find more information at{' '}
                          <a href="http://www.rqq.gouv.qc.ca/fr/retraite" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                            www.rqq.gouv.qc.ca/fr/retraite
                          </a>.
                        </p>
                      </div>
                    }
                    spouseContent={
                      <div className="space-y-4">
                        <NumberInput
                          control={form.control}
                          name="persons.1.cppStartAge"
                          label="Spouse's Start Age"
                          placeholder="Enter age"
                          onBlur={() => handlePensionAgeBlur('spouse', 'cpp')}
                        />
                        <NumberInput
                          control={form.control}
                          name="persons.1.cppAmount"
                          label="Spouse's Annual Amount (before tax)"
                          placeholder="Enter amount"
                          type="decimal"
                        />
                        <p className="text-sm text-muted-foreground">
                          If you don't know what your monthly CPP payments will be, you can sign into your My Service Canada Account for your monthly CPP estimate. For QPP, you can find more information at{' '}
                          <a href="http://www.rqq.gouv.qc.ca/fr/retraite" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                            www.rqq.gouv.qc.ca/fr/retraite
                          </a>.
                        </p>
                      </div>
                    }
                  />
                </div>

                {/* OAS */}
                <div className="border rounded-lg p-4 space-y-4">
                  <FormFieldWithTooltip
                    label="Old Age Security (OAS)"
                    tooltip="The maximum pension is $8,292 for 2023. The amount you receive for OAS depends on how many years you have lived in Canada."
                  >
                    <h4 className="text-lg font-medium">Old Age Security (OAS)</h4>
                  </FormFieldWithTooltip>

                  <SelfSpouseFields
                    calculateForSpouse={calculateForSpouse}
                    selfContent={
                      <div className="space-y-4">
                        <NumberInput
                          control={form.control}
                          name="persons.0.oasStartAge"
                          label="Your Start Age"
                          placeholder="Enter age"
                          onBlur={() => handlePensionAgeBlur('self', 'oas')}
                        />
                        <NumberInput
                          control={form.control}
                          name="persons.0.oasAmount"
                          label="Your Annual Amount (before tax)"
                          placeholder="Enter amount"
                          type="decimal"
                        />
                        <p className="text-sm text-muted-foreground">
                          You can start receiving OAS from age 65. For each year you delay OAS up until age 70 the amount received will increase by 7.2% per year.
                        </p>
                      </div>
                    }
                    spouseContent={
                      <div className="space-y-4">
                        <NumberInput
                          control={form.control}
                          name="persons.1.oasStartAge"
                          label="Spouse's Start Age"
                          placeholder="Enter age"
                          onBlur={() => handlePensionAgeBlur('spouse', 'oas')}
                        />
                        <NumberInput
                          control={form.control}
                          name="persons.1.oasAmount"
                          label="Spouse's Annual Amount (before tax)"
                          placeholder="Enter amount"
                          type="decimal"
                        />
                        <p className="text-sm text-muted-foreground">
                          You can start receiving OAS from age 65. For each year you delay OAS up until age 70 the amount received will increase by 7.2% per year.
                        </p>
                      </div>
                    }
                  />
                </div>

                {/* Other Pension */}
                <div className="border rounded-lg p-4 space-y-4">
                  <FormFieldWithTooltip
                    label="Other Pension"
                    tooltip="Include any private pension from a government or private company."
                  >
                    <h4 className="text-lg font-medium">Other Pension</h4>
                  </FormFieldWithTooltip>

                  <SelfSpouseFields
                    calculateForSpouse={calculateForSpouse}
                    selfContent={
                      <div className="space-y-4">
                        <NumberInput
                          control={form.control}
                          name="persons.0.definedBenefitPensionStartAge"
                          label="Your Start Age"
                          placeholder="Enter age"
                          onBlur={() => handlePensionAgeBlur('self', 'definedBenefitPension')}
                        />
                        <NumberInput
                          control={form.control}
                          name="persons.0.definedBenefitPensionAmount"
                          label="Your Annual Amount (before tax)"
                          placeholder="Enter amount"
                        />
                        <SwitchField
                          control={form.control}
                          name="persons.0.definedBenefitPensionIndexedToInflation"
                          label="Indexed to Inflation"
                          description="Will this pension increase with inflation?"
                        />
                      </div>
                    }
                    spouseContent={
                      <div className="space-y-4">
                        <NumberInput
                          control={form.control}
                          name="persons.1.definedBenefitPensionStartAge"
                          label="Spouse's Start Age"
                          placeholder="Enter age"
                          onBlur={() => handlePensionAgeBlur('spouse', 'definedBenefitPension')}
                        />
                        <NumberInput
                          control={form.control}
                          name="persons.1.definedBenefitPensionAmount"
                          label="Spouse's Annual Amount (before tax)"
                          placeholder="Enter amount"
                        />
                        <SwitchField
                          control={form.control}
                          name="persons.1.definedBenefitPensionIndexedToInflation"
                          label="Indexed to Inflation"
                          description="Will this pension increase with inflation?"
                        />
                      </div>
                    }
                  />
                </div>
              </div>
            </FormSection>

            {/* Primary Income Section */}
            <FormSection 
              title="Primary Income"
              description="Enter your annual employment income (before tax)"
              tooltip="Include income from employment, consulting, small business, or other sources. Do not include investment income, pension income, RRSP, or RRIF withdrawals."
            >
              <div className="space-y-6">
                <SelfSpouseFields
                  calculateForSpouse={calculateForSpouse}
                  selfContent={
                    <div className="space-y-2">
                      <NumberInput
                        control={form.control}
                        name="persons.0.primaryYearlyIncome"
                        label="Your Annual Income (before tax)"
                        placeholder="Enter income"
                      />
                      <p className="text-sm text-muted-foreground">
                        Note: Do not enter the investment income you will earn, or any pension income. Our calculator will handle this for you.
                      </p>
                    </div>
                  }
                  spouseContent={
                    <div className="space-y-2">
                      <NumberInput
                        control={form.control}
                        name="persons.1.primaryYearlyIncome"
                        label="Spouse's Annual Income (before tax)"
                        placeholder="Enter income"
                      />
                    </div>
                  }
                />

                <SelfSpouseFields
                  calculateForSpouse={calculateForSpouse}
                  selfContent={
                    <div className="space-y-4">
                      <NumberInput
                        control={form.control}
                        name="persons.0.incomeYearStart"
                        label="Your Income Start Year"
                        placeholder="Enter year"
                        skipFormatting
                        onBlur={() => handlePrimaryIncomeYearChange('self', 'start')}
                      />
                      <NumberInput
                        control={form.control}
                        name="persons.0.incomeYearEnd"
                        label="Your Income End Year"
                        placeholder="Enter year"
                        skipFormatting
                        onBlur={() => handlePrimaryIncomeYearChange('self', 'end')}
                      />
                    </div>
                  }
                  spouseContent={
                    <div className="space-y-4">
                      <NumberInput
                        control={form.control}
                        name="persons.1.incomeYearStart"
                        label="Spouse's Income Start Year"
                        placeholder="Enter year"
                        skipFormatting
                        onBlur={() => handlePrimaryIncomeYearChange('spouse', 'start')}
                      />
                      <NumberInput
                        control={form.control}
                        name="persons.1.incomeYearEnd"
                        label="Spouse's Income End Year"
                        placeholder="Enter year"
                        skipFormatting
                        onBlur={() => handlePrimaryIncomeYearChange('spouse', 'end')}
                      />
                    </div>
                  }
                />
              </div>
            </FormSection>

            {/* Other Income Section */}
            <FormSection 
              title="Other Income Sources"
              description="Enter any additional sources of income"
              tooltip="Include income from rental properties, lump-sum payments, inheritances, annuities, or other sources. Do not include investment income, pension income, RRSP, or RRIF withdrawals."
            >
              <div className="space-y-6">
                {form.watch('otherIncomes')?.map((income, index) => (
                  <div
                    key={income.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Other Income {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOtherIncome(income.id)}
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        control={form.control}
                        name={fieldPath<z.infer<typeof CalculatorSchema>>(`otherIncomes.${index}.description`)}
                        label="Description"
                        placeholder="Enter description"
                      />
                      <NumberInput
                        control={form.control}
                        name={fieldPath<z.infer<typeof CalculatorSchema>>(`otherIncomes.${index}.amount`)}
                        label="Annual Amount"
                        placeholder="Enter amount"
                      />
                      <NumberInput
                        control={form.control}
                        name={fieldPath<z.infer<typeof CalculatorSchema>>(`otherIncomes.${index}.startYear`)}
                        label="Start Year"
                        placeholder="Enter year"
                        skipFormatting
                      />
                      <NumberInput
                        control={form.control}
                        name={fieldPath<z.infer<typeof CalculatorSchema>>(`otherIncomes.${index}.endYear`)}
                        label="End Year"
                        placeholder="Enter year"
                        skipFormatting
                      />
                    </div>
                  </div>
                ))}

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addOtherIncome('self')}
                  >
                    Add Other Income (Self)
                  </Button>
                  {calculateForSpouse && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addOtherIncome('spouse')}
                    >
                      Add Other Income (Spouse)
                    </Button>
                  )}
                </div>
              </div>
            </FormSection>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default IncomeCard