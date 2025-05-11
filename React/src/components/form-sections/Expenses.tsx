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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { InfoIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import * as z from 'zod'
import { CalculatorSchema } from '../Schema'

interface ExpensesCardProps {
  form: UseFormReturn<z.infer<typeof CalculatorSchema>>
  calculateForSpouse: boolean
}

const ExpensesCard = ({ form, calculateForSpouse }: ExpensesCardProps) => {
  const [oneOffExpenseIdCounter, setOneOffExpenseIdCounter] = useState(0)
  const [charitableDonationIdCounter, setCharitableDonationIdCounter] =
    useState(0)

  const handleAddOneOffExpense = (personType: 'self' | 'spouse') => {
    const currentExpenses = form.getValues('oneOffExpenses') || []
    const newId = Math.max(...currentExpenses.map(e => e.id), -1) + 1
    form.setValue('oneOffExpenses', [
      ...currentExpenses,
      {
        id: newId,
        personType,
        description: '',
        amount: null,
        year: null,
      },
    ])
  }

  const handleAddCharitableDonation = (personType: 'self' | 'spouse') => {
    setCharitableDonationIdCounter((prev) => prev + 1)
    const currentDonations = form.getValues('charitableDonations') || []
    form.setValue('charitableDonations', [
      ...currentDonations,
      {
        id: charitableDonationIdCounter,
        personType,
        amount: null,
        startYear: null,
        endYear: null,
      },
    ])
  }

  const handleRemoveOneOffExpense = (id: number) => {
    const updatedExpenses = form
      .getValues('oneOffExpenses')
      .filter((expense) => expense.id !== id)
    form.setValue('oneOffExpenses', updatedExpenses, { shouldDirty: true })
  }

  const handleRemoveCharitableDonation = (id: number) => {
    const updatedDonations = form
      .getValues('charitableDonations')
      .filter((donation) => donation.id !== id)
    form.setValue('charitableDonations', updatedDonations, {
      shouldDirty: true,
    })
  }

  // Autofill for development
  useEffect(() => {
    // TODO: Remove this useEffect for production - for development autofill
    const autoFillFlag = 'formAutoFilled_Expenses';
    if (process.env.NODE_ENV === 'development' && !sessionStorage.getItem(autoFillFlag)) {
      // My expenses $100,123
      form.setValue('persons.0.annualExpenses' as any, 100123);

      // No expenses for spouse
      if (calculateForSpouse) {
        form.setValue('persons.1.annualExpenses' as any, 0);
      }

      // Desired estate 10123
      form.setValue('desiredEstateValue' as any, 10123);

      sessionStorage.setItem(autoFillFlag, 'true');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculateForSpouse]);

  return (
    <Card className="form-card">
      <CardHeader className="form-card-header">
        <CardTitle className="form-card-title text-primary">Expenses</CardTitle>
        <p className="form-card-description">
          Provide details about your various expenses and financial commitments.
        </p>
      </CardHeader>
      <CardContent className="form-card-content">
        <Form {...form}>
          <form className="space-y-8">
            {/* Annual Expenses Section */}
            <div className="form-section">
              <h3 className="form-section-title">Annual Expenses</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm text-muted-foreground mb-4 cursor-help flex items-center">
                      Enter your expected annual expenses <InfoIcon className="h-4 w-4 ml-1" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Enter the expected annual cost of essential items for the
                      lifestyle you desire throughout your retirement years.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {form
                  .getValues('persons')
                  .filter(
                    (person) =>
                      person.personType === 'self' || calculateForSpouse
                  )
                  .map((person) => (
                    <div key={person.personType} className="space-y-6">
                      <h4 className="text-lg font-medium">
                        {person.personType === 'self' ? 'Your' : "Spouse's"}{' '}
                        Annual Expenses
                      </h4>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`persons.${form
                            .getValues('persons')
                            .findIndex(
                              (p) => p.personType === person.personType
                            )}.annualExpenses`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Annual Living Expenses</FormLabel>
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
                          name={`persons.${form
                            .getValues('persons')
                            .findIndex(
                              (p) => p.personType === person.personType
                            )}.healthCareExpenses`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Annual Healthcare Expenses</FormLabel>
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
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* One-Off Expenses Section */}
            <div className="form-section">
              <h3 className="form-section-title">One-Off Expenses</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm text-muted-foreground mb-4 cursor-help flex items-center">
                      Enter any one-time expenses you anticipate <InfoIcon className="h-4 w-4 ml-1" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Include major purchases, travel plans, gifts, or other
                      significant one-time expenses.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Your One-Off Expenses</h4>
                  {(form.watch('oneOffExpenses') || [])
                    .filter((expense) => expense.personType === 'self')
                    .map((expense) => {
                      // Get the index once for all fields
                      const expenseIndex = form.getValues('oneOffExpenses').findIndex(e => e.id === expense.id)
                      return (
                        <div
                          key={expense.id}
                          className="border rounded-lg p-4 space-y-4 mb-4"
                        >
                          <div className="flex justify-between items-center">
                            <h5 className="font-medium">
                              One-Off Expense
                            </h5>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveOneOffExpense(expense.id)
                              }
                            >
                              Remove
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`oneOffExpenses.${expenseIndex}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter description"
                                      value={field.value || ''}
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
                              name={`oneOffExpenses.${expenseIndex}.amount`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Amount</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="Enter amount"
                                      value={field.value ?? ''}
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
                              name={`oneOffExpenses.${expenseIndex}.year`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Year</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="Enter year"
                                      value={field.value ?? ''}
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
                      )
                    })}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddOneOffExpense('self')}
                  >
                    Add One-Off Expense
                  </Button>
                </div>

                {calculateForSpouse && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">
                      Spouse's One-Off Expenses
                    </h4>
                    {(form.watch('oneOffExpenses') || [])
                      .filter((expense) => expense.personType === 'spouse')
                      .map((expense) => {
                        // Get the index once for all fields
                        const expenseIndex = form.getValues('oneOffExpenses').findIndex(e => e.id === expense.id)
                        return (
                          <div
                            key={expense.id}
                            className="border rounded-lg p-4 space-y-4 mb-4"
                          >
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium">
                                One-Off Expense
                              </h5>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemoveOneOffExpense(expense.id)
                                }
                              >
                                Remove
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`oneOffExpenses.${expenseIndex}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter description"
                                        value={field.value || ''}
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
                                name={`oneOffExpenses.${expenseIndex}.amount`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="Enter amount"
                                        value={field.value ?? ''}
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
                                name={`oneOffExpenses.${expenseIndex}.year`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Year</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="Enter year"
                                        value={field.value ?? ''}
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
                        )
                      })}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddOneOffExpense('spouse')}
                    >
                      Add One-Off Expense
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Charitable Donations Section */}
            <div className="form-section">
              <h3 className="form-section-title">Charitable Donations</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm text-muted-foreground mb-4 cursor-help flex items-center">
                      Enter your planned charitable donations <InfoIcon className="h-4 w-4 ml-1" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Include any regular or one-time charitable donations you
                      plan to make.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">
                    Your Charitable Donations
                  </h4>
                  {form
                    .watch('charitableDonations')
                    ?.filter((donation) => donation.personType === 'self')
                    .map((donation, index) => (
                      <div
                        key={donation.id}
                        className="border rounded-lg p-4 space-y-4 mb-4"
                      >
                        <div className="flex justify-between items-center">
                          <h5 className="font-medium">
                            Charitable Donation {index + 1}
                          </h5>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveCharitableDonation(donation.id)
                            }
                          >
                            Remove
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name={`charitableDonations.${index}.amount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount</FormLabel>
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
                            name={`charitableDonations.${index}.startYear`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Year</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Enter start year"
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
                            name={`charitableDonations.${index}.endYear`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Year</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Enter end year"
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
                        </div>
                      </div>
                    ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddCharitableDonation('self')}
                  >
                    Add Charitable Donation
                  </Button>
                </div>

                {calculateForSpouse && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">
                      Spouse's Charitable Donations
                    </h4>
                    {form
                      .watch('charitableDonations')
                      ?.filter((donation) => donation.personType === 'spouse')
                      .map((donation, index) => (
                        <div
                          key={donation.id}
                          className="border rounded-lg p-4 space-y-4 mb-4"
                        >
                          <div className="flex justify-between items-center">
                            <h5 className="font-medium">
                              Charitable Donation {index + 1}
                            </h5>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveCharitableDonation(donation.id)
                              }
                            >
                              Remove
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name={`charitableDonations.${index}.amount`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Amount</FormLabel>
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
                              name={`charitableDonations.${index}.startYear`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Year</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="Enter start year"
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
                              name={`charitableDonations.${index}.endYear`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Year</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="Enter end year"
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
                          </div>
                        </div>
                      ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddCharitableDonation('spouse')}
                    >
                      Add Charitable Donation
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Desired Estate Section */}
            <div className="form-section">
              <h3 className="form-section-title">Desired Estate</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm text-muted-foreground mb-4 cursor-help flex items-center">
                      Enter the amount you wish to leave to your heirs <InfoIcon className="h-4 w-4 ml-1" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Specify the amount you would like to leave as inheritance
                      or estate.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <FormField
                control={form.control}
                name="desiredEstateValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Estate Amount</FormLabel>
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
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ExpensesCard
