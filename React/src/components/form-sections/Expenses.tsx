import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import * as z from 'zod'
import { CalculatorSchema } from '@/lib/schema/calculator'
import { NumberInput, TextInput, FormSection, SelfSpouseFields } from '@/components/form'
import { useFormList } from '@/hooks/useFormList'
import { fieldPath } from '@/lib/form-helpers'

interface ExpensesCardProps {
  form: UseFormReturn<z.infer<typeof CalculatorSchema>>
  calculateForSpouse: boolean
}

const ExpensesCard = ({ form, calculateForSpouse }: ExpensesCardProps) => {
  const { handleAdd: handleAddOneOffExpense, handleRemove: handleRemoveOneOffExpense } = useFormList(form, 'oneOffExpenses')
  const { handleAdd: handleAddCharitableDonation, handleRemove: handleRemoveCharitableDonation } = useFormList(form, 'charitableDonations')

  const addOneOffExpense = (personType: 'self' | 'spouse') => {
    const currentExpenses = form.getValues('oneOffExpenses') || []
    const newId = currentExpenses.length > 0 ? Math.max(...currentExpenses.map(e => e.id)) + 1 : 1
    handleAddOneOffExpense({
      id: newId,
      personType,
      description: '',
      amount: null,
      year: null,
    })
  }

  const addCharitableDonation = (personType: 'self' | 'spouse') => {
    const currentDonations = form.getValues('charitableDonations') || []
    const newId = currentDonations.length > 0 ? Math.max(...currentDonations.map(d => d.id)) + 1 : 1
    handleAddCharitableDonation({
      id: newId,
      personType,
      amount: null,
      startYear: null,
      endYear: null,
    })
  }

  // Autofill for development
  useEffect(() => {
    // TODO: Remove this useEffect for production - for development autofill
    const autoFillFlag = 'formAutoFilled_Expenses';
    if (process.env.NODE_ENV === 'development' && !sessionStorage.getItem(autoFillFlag)) {
      // My expenses $100,123
      form.setValue('persons.0.annualExpenses', 100123);

      // No expenses for spouse
      if (calculateForSpouse) {
        form.setValue('persons.1.annualExpenses', 0);
      }

      // Desired estate 10123
      form.setValue('desiredEstateValue', 10123);

      sessionStorage.setItem(autoFillFlag, 'true');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculateForSpouse]);

  const oneOffExpenses = form.watch('oneOffExpenses') || []
  const charitableDonations = form.watch('charitableDonations') || []

  return (
    <Card className="form-card">
      <CardHeader className="form-card-header">
        <CardTitle className="form-card-title text-primary">
          Expenses & Donations
        </CardTitle>
        <p className="form-card-description">
          Enter your expected retirement expenses and any planned donations.
        </p>
      </CardHeader>
      <CardContent className="form-card-content">
        <Form {...form}>
          <form className="space-y-8">
            {/* Annual Expenses Section */}
            <FormSection
              title="Annual Expenses"
              description="Enter your expected annual living expenses during retirement"
              tooltip="Include all regular expenses such as housing, food, healthcare, transportation, entertainment, etc. This amount should be in today's dollars and will be adjusted for inflation."
            >
              <SelfSpouseFields
                calculateForSpouse={calculateForSpouse}
                selfContent={
                  <NumberInput
                    control={form.control}
                    name="persons.0.annualExpenses"
                    label="Your Annual Expenses"
                    placeholder="Enter annual expenses"
                    type="decimal"
                  />
                }
                spouseContent={
                  <NumberInput
                    control={form.control}
                    name="persons.1.annualExpenses"
                    label="Spouse's Annual Expenses"
                    placeholder="Enter annual expenses"
                    type="decimal"
                  />
                }
              />
            </FormSection>

            {/* One-Off Expenses Section */}
            <FormSection
              title="One-Off Expenses"
              description="Add any large, one-time expenses"
              tooltip="Include major purchases like a new car, home renovations, vacations, or other significant one-time costs."
            >
              <div className="space-y-6">
                {oneOffExpenses.map((expense, index) => {
                  const personLabel = expense.personType === 'self' ? 'Self' : 'Spouse'
                  return (
                    <div
                      key={expense.id}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">
                          One-Off Expense {index + 1} ({personLabel})
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveOneOffExpense(expense.id)}
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <TextInput
                          control={form.control}
                          name={fieldPath<z.infer<typeof CalculatorSchema>>(`oneOffExpenses.${index}.description`)}
                          label="Description"
                          placeholder="Enter description"
                        />
                        <NumberInput
                          control={form.control}
                          name={fieldPath<z.infer<typeof CalculatorSchema>>(`oneOffExpenses.${index}.amount`)}
                          label="Amount"
                          placeholder="Enter amount"
                          type="decimal"
                        />
                        <NumberInput
                          control={form.control}
                          name={fieldPath<z.infer<typeof CalculatorSchema>>(`oneOffExpenses.${index}.year`)}
                          label="Year"
                          placeholder="Enter year"
                        />
                      </div>
                    </div>
                  )
                })}

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addOneOffExpense('self')}
                  >
                    Add One-Off Expense (Self)
                  </Button>
                  {calculateForSpouse && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addOneOffExpense('spouse')}
                    >
                      Add One-Off Expense (Spouse)
                    </Button>
                  )}
                </div>
              </div>
            </FormSection>

            {/* Charitable Donations Section */}
            <FormSection
              title="Charitable Donations"
              description="Add any planned charitable giving"
              tooltip="Regular charitable donations can provide tax benefits and help reduce your taxable income."
            >
              <div className="space-y-6">
                {charitableDonations.map((donation, index) => {
                  const personLabel = donation.personType === 'self' ? 'Self' : 'Spouse'
                  return (
                    <div
                      key={donation.id}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">
                          Charitable Donation {index + 1} ({personLabel})
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCharitableDonation(donation.id)}
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <NumberInput
                          control={form.control}
                          name={fieldPath<z.infer<typeof CalculatorSchema>>(`charitableDonations.${index}.amount`)}
                          label="Annual Amount"
                          placeholder="Enter amount"
                          type="decimal"
                        />
                        <NumberInput
                          control={form.control}
                          name={fieldPath<z.infer<typeof CalculatorSchema>>(`charitableDonations.${index}.startYear`)}
                          label="Start Year"
                          placeholder="Enter year"
                        />
                        <NumberInput
                          control={form.control}
                          name={fieldPath<z.infer<typeof CalculatorSchema>>(`charitableDonations.${index}.endYear`)}
                          label="End Year"
                          placeholder="Enter year"
                        />
                      </div>
                    </div>
                  )
                })}

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addCharitableDonation('self')}
                  >
                    Add Charitable Donation (Self)
                  </Button>
                  {calculateForSpouse && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addCharitableDonation('spouse')}
                    >
                      Add Charitable Donation (Spouse)
                    </Button>
                  )}
                </div>
              </div>
            </FormSection>

            {/* Desired Estate Value Section */}
            <FormSection
              title="Estate Planning"
              description="Enter the amount you'd like to leave as an estate"
              tooltip="This is the target value you'd like to leave to your beneficiaries at the end of your life. The calculator will try to preserve this amount while meeting your expenses."
            >
              <NumberInput
                control={form.control}
                name="desiredEstateValue"
                label="Desired Estate Value"
                placeholder="Enter desired estate value"
                type="decimal"
              />
            </FormSection>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ExpensesCard