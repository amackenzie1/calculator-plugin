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
import { createNumberInput } from '@/lib/form-utils'
import { useState } from 'react'
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

  const expensesChangeForEachStage = form.watch('expensesChangeForEachStage')
  const expensesChangeForEachStageSpouse = form.watch(
    'expensesChangeForEachStageSpouse'
  )

  const handleAddOneOffExpense = (personType: 'self' | 'spouse') => {
    setOneOffExpenseIdCounter((prev) => prev + 1)
    const currentExpenses = form.getValues('oneOffExpenses') || []
    form.setValue('oneOffExpenses', [
      ...currentExpenses,
      {
        id: oneOffExpenseIdCounter,
        personType,
        description: '',
        amount: undefined,
        year: undefined,
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
        amount: undefined,
        startYear: undefined,
        endYear: undefined,
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
            {/* Retirement Expenses Section */}
            <div className="form-section">
              <h3 className="form-section-title">Retirement Expenses</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-muted-foreground mb-4 cursor-help">
                      Enter your expected retirement expenses (?)
                    </p>
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
                {form.getValues('persons').map((person, personIndex) => (
                  <div key={personIndex} className="space-y-6">
                    <h4 className="text-lg font-medium">
                      {person.personType === 'self' ? 'Your' : "Spouse's"}{' '}
                      Retirement Expenses
                    </h4>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={
                          person.personType === 'self'
                            ? 'expensesChangeForEachStage'
                            : 'expensesChangeForEachStageSpouse'
                        }
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>
                                Specify Expenses Through Each Stage
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Do you want to specify different expenses for
                                each retirement stage?
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

                      {(person.personType === 'self' &&
                        expensesChangeForEachStage) ||
                      (person.personType === 'spouse' &&
                        expensesChangeForEachStageSpouse) ? (
                        <>
                          <div className="space-y-4 border rounded-lg p-4">
                            <h5 className="font-medium">
                              Stage 1 (Current Age to 75)
                            </h5>
                            <FormField
                              control={form.control}
                              name={`persons.${personIndex}.annualRetirementExpenses`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Annual Retirement Expenses
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...createNumberInput(field, {
                                        isDecimal: true,
                                      })}
                                      placeholder="Enter amount"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`persons.${personIndex}.healthCareExpenses`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Annual Healthcare Expenses
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...createNumberInput(field, {
                                        isDecimal: true,
                                      })}
                                      placeholder="Enter amount"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="space-y-4 border rounded-lg p-4">
                            <h5 className="font-medium">
                              Stage 2 (Ages 76-85)
                            </h5>
                            <FormField
                              control={form.control}
                              name={`persons.${personIndex}.annualRetirementExpensesStage2`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Annual Retirement Expenses
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...createNumberInput(field, {
                                        isDecimal: true,
                                      })}
                                      placeholder="Enter amount"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`persons.${personIndex}.healthCareExpensesStage2`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Annual Healthcare Expenses
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...createNumberInput(field, {
                                        isDecimal: true,
                                      })}
                                      placeholder="Enter amount"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="space-y-4 border rounded-lg p-4">
                            <h5 className="font-medium">Stage 3 (Age 86+)</h5>
                            <FormField
                              control={form.control}
                              name={`persons.${personIndex}.annualRetirementExpensesStage3`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Annual Retirement Expenses
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...createNumberInput(field, {
                                        isDecimal: true,
                                      })}
                                      placeholder="Enter amount"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`persons.${personIndex}.healthCareExpensesStage3`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Annual Healthcare Expenses
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...createNumberInput(field, {
                                        isDecimal: true,
                                      })}
                                      placeholder="Enter amount"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <FormField
                            control={form.control}
                            name={`persons.${personIndex}.annualRetirementExpenses`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Annual Retirement Expenses
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...createNumberInput(field, {
                                      isDecimal: true,
                                    })}
                                    placeholder="Enter amount"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`persons.${personIndex}.healthCareExpenses`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Annual Healthcare Expenses
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...createNumberInput(field, {
                                      isDecimal: true,
                                    })}
                                    placeholder="Enter amount"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
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
                    <p className="text-sm text-muted-foreground mb-4 cursor-help">
                      Enter any one-time expenses you anticipate (?)
                    </p>
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
                  {form
                    .watch('oneOffExpenses')
                    ?.filter((expense) => expense.personType === 'self')
                    .map((expense, index) => (
                      <div
                        key={expense.id}
                        className="border rounded-lg p-4 space-y-4 mb-4"
                      >
                        <div className="flex justify-between items-center">
                          <h5 className="font-medium">
                            One-Off Expense {index + 1}
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
                            name={`oneOffExpenses.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter description"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`oneOffExpenses.${index}.amount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                  <Input
                                    {...createNumberInput(field, {
                                      isDecimal: true,
                                    })}
                                    placeholder="Enter amount"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`oneOffExpenses.${index}.year`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Year</FormLabel>
                                <FormControl>
                                  <Input
                                    {...createNumberInput(field)}
                                    placeholder="Enter year"
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
                    {form
                      .watch('oneOffExpenses')
                      ?.filter((expense) => expense.personType === 'spouse')
                      .map((expense, index) => (
                        <div
                          key={expense.id}
                          className="border rounded-lg p-4 space-y-4 mb-4"
                        >
                          <div className="flex justify-between items-center">
                            <h5 className="font-medium">
                              One-Off Expense {index + 1}
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
                              name={`oneOffExpenses.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter description"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`oneOffExpenses.${index}.amount`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Amount</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...createNumberInput(field, {
                                        isDecimal: true,
                                      })}
                                      placeholder="Enter amount"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`oneOffExpenses.${index}.year`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Year</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...createNumberInput(field)}
                                      placeholder="Enter year"
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
                    <p className="text-sm text-muted-foreground mb-4 cursor-help">
                      Enter your planned charitable donations (?)
                    </p>
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
                                    {...createNumberInput(field, {
                                      isDecimal: true,
                                    })}
                                    placeholder="Enter amount"
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
                                    {...createNumberInput(field)}
                                    placeholder="Enter start year"
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
                                    {...createNumberInput(field)}
                                    placeholder="Enter end year"
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
                                      {...createNumberInput(field, {
                                        isDecimal: true,
                                      })}
                                      placeholder="Enter amount"
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
                                      {...createNumberInput(field)}
                                      placeholder="Enter start year"
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
                                      {...createNumberInput(field)}
                                      placeholder="Enter end year"
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
                    <p className="text-sm text-muted-foreground mb-4 cursor-help">
                      Enter the amount you wish to leave to your heirs (?)
                    </p>
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
                        {...createNumberInput(field, { isDecimal: true })}
                        placeholder="Enter amount"
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
