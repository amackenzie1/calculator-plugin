import { Button } from '@/components/ui/button'
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
import { Switch } from '@/components/ui/switch'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { useEffect } from 'react'
import { UseFormReturn, useFieldArray } from 'react-hook-form'
import * as z from 'zod'
import { CalculatorSchema } from '../Schema'

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
  const {
    fields: otherIncomeFields,
    append: appendOtherIncome,
    remove: removeOtherIncome,
  } = useFieldArray({
    control: form.control,
    name: 'persons.0.otherIncomes',
  })

  const {
    fields: spouseOtherIncomeFields,
    append: appendSpouseOtherIncome,
    remove: removeSpouseOtherIncome,
  } = useFieldArray({
    control: form.control,
    name: 'persons.1.otherIncomes',
  })

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

  const handleAddOtherIncome = (personType: 'self' | 'spouse') => {
    const currentOtherIncomes = form.getValues('otherIncomes') || []
    const newOtherIncome = {
      id: Date.now(),
      personType: personType,
      description: '',
      amount: null,
      startYear: null,
      endYear: null,
    }

    form.setValue('otherIncomes', [...currentOtherIncomes, newOtherIncome])
  }

  const handleRemoveOtherIncome = (id: number) => {
    const updatedOtherIncomes = form
      .getValues('otherIncomes')
      .filter((income) => income.id !== id)
    form.setValue('otherIncomes', updatedOtherIncomes)
  }

  const handlePrimaryIncomeAgeBlur = (personType: 'self' | 'spouse') => {
    const startAge = form.getValues(
      `persons.${personType === 'spouse' ? 1 : 0}.incomeStartAge`
    )
    const endAge = form.getValues(
      `persons.${personType === 'spouse' ? 1 : 0}.incomeEndAge`
    )
    const birthYear = personType === 'self' ? birthYearSelf : birthYearSpouse

    if (startAge && birthYear) {
      const startYear = yearFromBirthYearAndTargetAge(birthYear, startAge)
      form.setValue(
        `persons.${personType === 'spouse' ? 1 : 0}.incomeYearStart`,
        startYear
      )
    }

    if (endAge && birthYear) {
      const endYear = yearFromBirthYearAndTargetAge(birthYear, endAge)
      form.setValue(
        `persons.${personType === 'spouse' ? 1 : 0}.incomeYearEnd`,
        endYear
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
            {/* Primary Income Section */}
            <div className="form-section">
              <h3 className="form-section-title">Primary Income</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-muted-foreground mb-4 cursor-help">
                      Enter your annual employment income (before tax) (?)
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Include income from employment, consulting, small
                      business, or other sources. Do not include investment
                      income, pension income, RRSP, or RRIF withdrawals.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="persons.0.primaryYearlyIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Annual Income (before tax)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter income"
                            value={
                              field.value == null ? '' : field.value.toString()
                            }
                            onChange={(e) => {
                              const value = e.target.value
                              field.onChange(value ? parseInt(value) : null)
                            }}
                            onBlur={() => handlePrimaryIncomeAgeBlur('self')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {calculateForSpouse && (
                    <FormField
                      control={form.control}
                      name="persons.1.primaryYearlyIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Spouse's Annual Income (before tax)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter income"
                              value={
                                field.value == null
                                  ? ''
                                  : field.value.toString()
                              }
                              onChange={(e) => {
                                const value = e.target.value
                                field.onChange(value ? parseInt(value) : null)
                              }}
                              onBlur={() =>
                                handlePrimaryIncomeAgeBlur('spouse')
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="persons.0.incomeStartAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Income Start Age</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter age"
                              value={
                                field.value == null
                                  ? ''
                                  : field.value.toString()
                              }
                              onChange={(e) => {
                                const value = e.target.value
                                field.onChange(value ? parseInt(value) : null)
                              }}
                              onBlur={() => handlePrimaryIncomeAgeBlur('self')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="persons.0.incomeEndAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Income End Age</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter age"
                              value={
                                field.value == null
                                  ? ''
                                  : field.value.toString()
                              }
                              onChange={(e) => {
                                const value = e.target.value
                                field.onChange(value ? parseInt(value) : null)
                              }}
                              onBlur={() => handlePrimaryIncomeAgeBlur('self')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {calculateForSpouse && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="persons.1.incomeStartAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Spouse's Income Start Age</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter age"
                                value={
                                  field.value == null
                                    ? ''
                                    : field.value.toString()
                                }
                                onChange={(e) => {
                                  const value = e.target.value
                                  field.onChange(value ? parseInt(value) : null)
                                }}
                                onBlur={() =>
                                  handlePrimaryIncomeAgeBlur('spouse')
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="persons.1.incomeEndAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Spouse's Income End Age</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter age"
                                value={
                                  field.value == null
                                    ? ''
                                    : field.value.toString()
                                }
                                onChange={(e) => {
                                  const value = e.target.value
                                  field.onChange(value ? parseInt(value) : null)
                                }}
                                onBlur={() =>
                                  handlePrimaryIncomeAgeBlur('spouse')
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Government Benefits Section */}
            <div className="form-section">
              <h3 className="form-section-title">Government Benefits</h3>

              {/* CPP/QPP */}
              <div className="space-y-6">
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-medium">CPP/QPP</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help text-muted-foreground">
                            (?)
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            The age you start your pension, how long you
                            contributed, and your average earnings throughout
                            your life determine how much CPP or QPP you receive.
                            In 2023 the maximum annual pension for someone
                            retiring at age 65 is $15,678.84 ($1,306.57 per
                            month).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="persons.0.cppStartAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Start Age</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter age"
                                value={
                                  field.value == null
                                    ? ''
                                    : field.value.toString()
                                }
                                onChange={(e) => {
                                  const value = e.target.value
                                  field.onChange(value ? parseInt(value) : null)
                                }}
                                onBlur={() =>
                                  handlePensionAgeBlur('self', 'cpp')
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="persons.0.cppAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Annual Amount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="Enter amount"
                                value={
                                  field.value == null
                                    ? ''
                                    : field.value.toString()
                                }
                                onChange={(e) => {
                                  const value = e.target.value
                                  field.onChange(
                                    value ? parseFloat(value) : null
                                  )
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {calculateForSpouse && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="persons.1.cppStartAge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Spouse's Start Age</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter age"
                                  value={
                                    field.value == null
                                      ? ''
                                      : field.value.toString()
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value
                                    field.onChange(
                                      value ? parseInt(value) : null
                                    )
                                  }}
                                  onBlur={() =>
                                    handlePensionAgeBlur('spouse', 'cpp')
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="persons.1.cppAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Spouse's Annual Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="Enter amount"
                                  value={
                                    field.value == null
                                      ? ''
                                      : field.value.toString()
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value
                                    field.onChange(
                                      value ? parseFloat(value) : null
                                    )
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* OAS */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-medium">
                      Old Age Security (OAS)
                    </h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help text-muted-foreground">
                            (?)
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            The maximum pension is $8,292 for 2023. The amount
                            you receive for OAS depends on how many years you
                            have lived in Canada.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="persons.0.oasStartAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Start Age</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter age"
                                value={
                                  field.value == null
                                    ? ''
                                    : field.value.toString()
                                }
                                onChange={(e) => {
                                  const value = e.target.value
                                  field.onChange(value ? parseInt(value) : null)
                                }}
                                onBlur={() =>
                                  handlePensionAgeBlur('self', 'oas')
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="persons.0.oasAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Annual Amount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="Enter amount"
                                value={
                                  field.value == null
                                    ? ''
                                    : field.value.toString()
                                }
                                onChange={(e) => {
                                  const value = e.target.value
                                  field.onChange(
                                    value ? parseFloat(value) : null
                                  )
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {calculateForSpouse && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="persons.1.oasStartAge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Spouse's Start Age</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter age"
                                  value={
                                    field.value == null
                                      ? ''
                                      : field.value.toString()
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value
                                    field.onChange(
                                      value ? parseInt(value) : null
                                    )
                                  }}
                                  onBlur={() =>
                                    handlePensionAgeBlur('spouse', 'oas')
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="persons.1.oasAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Spouse's Annual Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="Enter amount"
                                  value={
                                    field.value == null
                                      ? ''
                                      : field.value.toString()
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value
                                    field.onChange(
                                      value ? parseFloat(value) : null
                                    )
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Defined Benefit Pension */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-medium">
                      Defined Benefit Pension
                    </h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help text-muted-foreground">
                            (?)
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Include any private pension from a government or
                            private company.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="persons.0.definedBenefitPensionStartAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Start Age</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter age"
                                value={
                                  field.value == null
                                    ? ''
                                    : field.value.toString()
                                }
                                onChange={(e) => {
                                  const value = e.target.value
                                  field.onChange(value ? parseInt(value) : null)
                                }}
                                onBlur={() =>
                                  handlePensionAgeBlur(
                                    'self',
                                    'definedBenefitPension'
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="persons.0.definedBenefitPensionAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Annual Amount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter amount"
                                value={
                                  field.value == null
                                    ? ''
                                    : field.value.toString()
                                }
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

                      <FormField
                        control={form.control}
                        name="persons.0.definedBenefitPensionIndexedToInflation"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Indexed to Inflation</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Will this pension increase with inflation?
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value ?? false}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    {calculateForSpouse && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="persons.1.definedBenefitPensionStartAge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Spouse's Start Age</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter age"
                                  value={
                                    field.value == null
                                      ? ''
                                      : field.value.toString()
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value
                                    field.onChange(
                                      value ? parseInt(value) : null
                                    )
                                  }}
                                  onBlur={() =>
                                    handlePensionAgeBlur(
                                      'spouse',
                                      'definedBenefitPension'
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="persons.1.definedBenefitPensionAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Spouse's Annual Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter amount"
                                  value={
                                    field.value == null
                                      ? ''
                                      : field.value.toString()
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value
                                    field.onChange(
                                      value ? parseInt(value) : null
                                    )
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="persons.1.definedBenefitPensionIndexedToInflation"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel>Indexed to Inflation</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Will this pension increase with inflation?
                                </p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value ?? false}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Other Income Section */}
            <div className="form-section">
              <h3 className="form-section-title">Other Income Sources</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-muted-foreground mb-4 cursor-help">
                      Enter any additional sources of income (?)
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Include income from rental properties, lump-sum payments,
                      inheritances, annuities, or other sources. Do not include
                      investment income, pension income, RRSP, or RRIF
                      withdrawals.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

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
                      <FormField
                        control={form.control}
                        name={`otherIncomes.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter description"
                                value={
                                  field.value == null
                                    ? ''
                                    : field.value.toString()
                                }
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`otherIncomes.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Annual Amount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter amount"
                                value={
                                  field.value == null
                                    ? ''
                                    : field.value.toString()
                                }
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

                      <FormField
                        control={form.control}
                        name={`otherIncomes.${index}.startYear`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Year</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter year"
                                value={
                                  field.value == null
                                    ? ''
                                    : field.value.toString()
                                }
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

                      <FormField
                        control={form.control}
                        name={`otherIncomes.${index}.endYear`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Year</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter year"
                                value={
                                  field.value == null
                                    ? ''
                                    : field.value.toString()
                                }
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
                    </div>
                  </div>
                ))}

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddOtherIncome('self')}
                  >
                    Add Other Income (Self)
                  </Button>
                  {calculateForSpouse && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddOtherIncome('spouse')}
                    >
                      Add Other Income (Spouse)
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default IncomeCard
