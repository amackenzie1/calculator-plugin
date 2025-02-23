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
import { UseFormReturn } from 'react-hook-form'
import * as z from 'zod'
import { CalculatorSchema } from '../Schema'

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

  return (
    <Card className="form-card">
      <CardHeader className="form-card-header">
        <CardTitle className="form-card-title text-primary">Assets</CardTitle>
        <p className="form-card-description">
          Provide details about your various assets and investments.
        </p>
      </CardHeader>
      <CardContent className="form-card-content">
        <Form {...form}>
          <form className="space-y-8">
            <TooltipProvider>
              {/* Registered Investments Section */}
              <div className="form-section">
                <h3 className="form-section-title">Registered Investments</h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-muted-foreground mb-4 cursor-help">
                      Details about your registered investment accounts (?)
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>
                      Tax-Free Savings Account (TFSA): When money is withdrawn
                      from your TFSA it is not taxable.
                      <br />
                      <br />
                      Registered Retirement Savings Plan (RRSP): When money is
                      withdrawn from your RRSP account it is taxable. At age 71
                      your RRSP account will automatically convert into a RRIF
                      account.
                      <br />
                      <br />
                      Registered Retirement Income Fund (RRIF): At age 71 RRSPs
                      must be converted to a RRIF. We will calculate the
                      withdrawal amount for your income each year.
                      <br />
                      <br />
                      Locked-in Retirement Account (LIRA): If you have
                      contributed to a Defined Contribution Pension Plan you may
                      have a LIRA. At age 71 we will automatically convert your
                      LIRA account into a LIF account.
                      <br />
                      <br />
                      Life Income Fund (LIF): Use this if you have a LIRA
                      account that has been converted to a LIF. We will
                      calculate the withdrawal amount for your income each year.
                    </p>
                  </TooltipContent>
                </Tooltip>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPersons.map((person, personIndex) => (
                    <div key={personIndex} className="space-y-6">
                      <h4 className="text-lg font-medium">
                        {person.personType === 'self' ? 'Your' : "Spouse's"}{' '}
                        Registered Investments
                      </h4>

                      {person.registeredInvestments?.map(
                        (investment, index) => (
                          <div
                            key={investment.id}
                            className="border rounded-lg p-4 space-y-4"
                          >
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium">
                                Investment {index + 1}
                              </h5>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemoveRegisteredInvestment(
                                    person.personType,
                                    investment.id
                                  )
                                }
                              >
                                Remove
                              </Button>
                            </div>

                            <FormField
                              control={form.control}
                              name={`persons.${personIndex}.registeredInvestments.${index}.accountType`}
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center gap-2">
                                    <FormLabel>Account Type</FormLabel>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="cursor-help text-muted-foreground">
                                          (?)
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          Select the type of registered
                                          investment account you have.
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value ?? undefined}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select account type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {registeredInvestmentOptions.map(
                                        (option) => (
                                          <SelectItem
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`persons.${personIndex}.registeredInvestments.${index}.currentValue`}
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center gap-2">
                                    <FormLabel>Current Value</FormLabel>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="cursor-help text-muted-foreground">
                                          (?)
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          Enter the current market value of this
                                          registered investment account.
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
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
                        )
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          handleAddRegisteredInvestment(person.personType)
                        }
                      >
                        Add Registered Investment
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Registered Investments Section */}
              <div className="form-section">
                <h3 className="form-section-title">
                  Non-Registered Investments
                </h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-muted-foreground mb-4 cursor-help">
                      Details about your non-registered investments (?)
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>
                      This represents all assets and investments excluding your
                      primary residence and registered assets. Include cottages,
                      rental properties, non-registered investment accounts,
                      bank accounts, holding company values, art collections, or
                      any other valuable assets. The difference between the
                      total value and the book value represents a capital gain,
                      of which 50% will be taxable when the asset is sold.
                    </p>
                  </TooltipContent>
                </Tooltip>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPersons.map((person, personIndex) => (
                    <div key={personIndex} className="space-y-6">
                      <h4 className="text-lg font-medium">
                        {person.personType === 'self' ? 'Your' : "Spouse's"}{' '}
                        Non-Registered Investments
                      </h4>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`persons.${personIndex}.nonRegisteredInvestmentValue`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-2">
                                <FormLabel>Current Value</FormLabel>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-help text-muted-foreground">
                                      (?)
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Enter the total current market value of
                                      all your non-registered investments.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
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

                        <FormField
                          control={form.control}
                          name={`persons.${personIndex}.nonRegisteredInvestmentOpeningYear`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-2">
                                <FormLabel>Opening Year</FormLabel>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-help text-muted-foreground">
                                      (?)
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Enter the year you acquired these
                                      non-registered investments.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
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
                          name={`persons.${personIndex}.nonRegisteredInvestmentBookValue`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-2">
                                <FormLabel>Book Value</FormLabel>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-help text-muted-foreground">
                                      (?)
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Enter the total cost or book value of all
                                      your non-registered investments. The
                                      difference between the total value and
                                      book value represents a capital gain, of
                                      which 50% will be taxable when the asset
                                      is sold.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
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
                    </div>
                  ))}
                </div>
              </div>

              {/* Life Insurance Section */}
              <div className="form-section">
                <h3 className="form-section-title">Life Insurance</h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-muted-foreground mb-4 cursor-help">
                      Details about your life insurance policies (?)
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>
                      Enter the face value of universal or whole life insurance
                      policies where your spouse or immediate family is the
                      beneficiary. This will form part of your surplus capital.
                      Do not include policies where someone outside your
                      immediate family is the beneficiary, as this would inflate
                      your total net estate projection.
                    </p>
                  </TooltipContent>
                </Tooltip>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPersons.map((person, personIndex) => (
                    <div key={personIndex} className="space-y-4">
                      <h4 className="text-lg font-medium">
                        {person.personType === 'self' ? 'Your' : "Spouse's"}{' '}
                        Life Insurance
                      </h4>

                      <FormField
                        control={form.control}
                        name={`persons.${personIndex}.lifeInsuranceDeathBenefit`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormLabel>Death Benefit Amount</FormLabel>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help text-muted-foreground">
                                    (?)
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Enter the amount of life insurance death
                                    benefit that will be paid to your
                                    beneficiaries.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
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
                  ))}
                </div>
              </div>

              {/* Primary Residence Section */}
              <div className="form-section">
                <h3 className="form-section-title">Primary Residence</h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-muted-foreground mb-4 cursor-help">
                      Details about your primary residence (?)
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      We will assume your home increases at your chosen
                      inflation rate. When the home is eventually sold, the gain
                      is considered to be a tax-free capital gain. This is
                      different from other assets where capital gains are
                      typically taxable.
                    </p>
                  </TooltipContent>
                </Tooltip>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="primaryResidenceValue"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Current Market Value</FormLabel>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help text-muted-foreground">
                                (?)
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Enter the current market value of your primary
                                residence.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Enter amount"
                            value={
                              field.value == null ? '' : field.value.toString()
                            }
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

                  <FormField
                    control={form.control}
                    name="primaryResidenceSell"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <FormLabel>Plan to Sell</FormLabel>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help text-muted-foreground">
                                  (?)
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Indicate whether you plan to sell your primary
                                  residence in the future.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Do you plan to sell your home in the future?
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

                  {primaryResidenceSell && (
                    <FormField
                      control={form.control}
                      name="primaryResidenceSellYear"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>Planned Sale Year</FormLabel>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help text-muted-foreground">
                                  (?)
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Enter the year when you plan to sell your
                                  primary residence.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
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
                  )}
                </div>
              </div>
            </TooltipProvider>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default AssetsCard
