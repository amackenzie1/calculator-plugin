import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import React from "react";
import { CalculatorSchema } from "@/schema";

// Receive the form object as a prop
interface IncomeCardProps {
  form: UseFormReturn<z.infer<typeof CalculatorSchema>>;
  calculateForSpouse: boolean;
}

const IncomeCard = ({ form, calculateForSpouse }: IncomeCardProps) => {
  // --- Helper Functions ---

  const handleAddOtherIncome = () => {
    form.setValue("otherIncomes", [
      ...(form.getValues("otherIncomes") || []),
      {
        id: Date.now(),
        description: "", // Now a string
        isAnnuity: false,
        amount: undefined,
        year: undefined,
        startDate: undefined,
        endDate: undefined,
      },
    ]);
  };

  const handleRemoveOtherIncome = (id: number) => {
    form.setValue(
      "otherIncomes",
      form.getValues("otherIncomes").filter((income) => income.id !== id)
    );
  };

  return (
    <Card className="mx-auto w-full max-w-3xl border-blue-500">
      <CardHeader>
        <CardTitle className="text-blue-500 underline">Income</CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Provide your income details below.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <tbody>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium"
                      rowSpan={2}
                    >
                      Primary Yearly Income
                    </th>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="employmentIncomeSelf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="employmentIncomeSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              Annual income (before tax)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                id="employmentIncomeSelf"
                                placeholder="Enter income"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : undefined
                                  );
                                  // Update yearlyAnnuitySelf when employmentIncomeSelf changes
                                  form.setValue(
                                    "yearlyAnnuitySelf",
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : undefined
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    {calculateForSpouse && (
                      <td className="px-6 py-4">
                        <FormField
                          control={form.control}
                          name="employmentIncomeSpouse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="employmentIncomeSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                Annual income (before tax)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="employmentIncomeSpouse"
                                  placeholder="Enter income"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(
                                      e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined
                                    );
                                    // Update yearlyAnnuitySpouse when employmentIncomeSpouse changes
                                    form.setValue(
                                      "yearlyAnnuitySpouse",
                                      e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined
                                    );
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>
                    )}
                  </tr>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="incomeDateRangeSelf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="incomeDateRangeSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              Between which years do you project earning this
                              income?
                            </FormLabel>
                            <FormControl>
                              <DatePickerWithRange
                                date={field.value}
                                setDate={(date) => field.onChange(date)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    {calculateForSpouse && (
                      <td className="px-6 py-4">
                        <FormField
                          control={form.control}
                          name="incomeDateRangeSpouse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="incomeDateRangeSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                Between which years do you project earning this
                                income?
                              </FormLabel>
                              <FormControl>
                                <DatePickerWithRange
                                  date={field.value}
                                  setDate={(date) => field.onChange(date)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>
                    )}
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium"
                      rowSpan={3}
                    >
                      Pension Income
                    </th>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      Canada Pension Plan (CPP) or Quebec Pension Plan (QPP)
                    </td>
                    {calculateForSpouse && <td className="px-6 py-4"></td>}
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="cppAgeSelf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="cppAgeSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              At what age have you/will you receive these
                              payments?
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                id="cppAgeSelf"
                                placeholder="Enter age"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    {calculateForSpouse && (
                      <td className="px-6 py-4">
                        <FormField
                          control={form.control}
                          name="cppAgeSpouse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="cppAgeSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                At what age have you/will you receive these
                                payments?
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="cppAgeSpouse"
                                  placeholder="Enter age"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>
                    )}
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="cppAmountSelf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="cppAmountSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              What is the annual amount (before tax)?
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                id="cppAmountSelf"
                                placeholder="Enter amount"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    {calculateForSpouse && (
                      <td className="px-6 py-4">
                        <FormField
                          control={form.control}
                          name="cppAmountSpouse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="cppAmountSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                What is the annual amount (before tax)?
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="cppAmountSpouse"
                                  placeholder="Enter amount"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>
                    )}
                  </tr>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      Old Age Security (OAS)
                    </td>
                    {calculateForSpouse && <td className="px-6 py-4"></td>}
                  </tr>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="oasAgeSelf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="oasAgeSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              At what age have you/will you receive these
                              payments?
                            </FormLabel>
                            <FormControl>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="oasAgeSelf"
                                  placeholder="Enter age"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined
                                    )
                                  }
                                />
                              </FormControl>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    {calculateForSpouse && (
                      <td className="px-6 py-4">
                        <FormField
                          control={form.control}
                          name="oasAgeSpouse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="oasAgeSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                At what age have you/will you receive these
                                payments?
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="oasAgeSpouse"
                                  placeholder="Enter age"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>
                    )}
                  </tr>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="oasAmountSelf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="oasAmountSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              What is the annual amount (before tax)?
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                id="oasAmountSelf"
                                placeholder="Enter amount"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    {calculateForSpouse && (
                      <td className="px-6 py-4">
                        <FormField
                          control={form.control}
                          name="oasAmountSpouse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="oasAmountSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                What is the annual amount (before tax)?
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="oasAmountSpouse"
                                  placeholder="Enter amount"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>
                    )}
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      Defined Benefit Pension
                    </td>
                    {calculateForSpouse && <td className="px-6 py-4"></td>}
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="dbPensionAgeSelf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="dbPensionAgeSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              At what age have you/will you receive these
                              payments?
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                id="dbPensionAgeSelf"
                                placeholder="Enter age"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    {calculateForSpouse && (
                      <td className="px-6 py-4">
                        <FormField
                          control={form.control}
                          name="dbPensionAgeSpouse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="dbPensionAgeSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                At what age have you/will you receive these
                                payments?
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="dbPensionAgeSpouse"
                                  placeholder="Enter age"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>
                    )}
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="dbPensionAmountSelf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="dbPensionAmountSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              What is the annual amount (before tax)?
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                id="dbPensionAmountSelf"
                                placeholder="Enter amount"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    {calculateForSpouse && (
                      <td className="px-6 py-4">
                        <FormField
                          control={form.control}
                          name="dbPensionAmountSpouse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="dbPensionAmountSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                What is the annual amount (before tax)?
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="dbPensionAmountSpouse"
                                  placeholder="Enter amount"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>
                    )}
                  </tr>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="dbPensionIndexedSelf"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel className="text-gray-500 dark:text-gray-400">
                                Is this indexed to inflation?
                              </FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-label="Toggle if pension is indexed to inflation"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>
                    {calculateForSpouse && (
                      <td className="px-6 py-4">
                        <FormField
                          control={form.control}
                          name="dbPensionIndexedSpouse"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel className="text-gray-500 dark:text-gray-400">
                                  Is this indexed to inflation?
                                </FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  aria-label="Toggle if pension is indexed to inflation"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                    )}
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <th scope="row" className="px-6 py-4 font-medium">
                      Other Incomes
                    </th>
                    <td className="px-6 py-4"></td>
                    {calculateForSpouse && <td className="px-6 py-4"></td>}
                  </tr>
                  {form.watch("otherIncomes")?.map((income, index) => (
                    <React.Fragment key={income.id}>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name={`otherIncomes.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor={`otherIncomes.${index}.description`}
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Description
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    id={`otherIncomes.${index}.description`}
                                    placeholder="Enter description"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name={`otherIncomes.${index}.isAnnuity`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-gray-500 dark:text-gray-400">
                                    Is this an annuity?
                                  </FormLabel>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-label="Toggle if income is an annuity"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        {calculateForSpouse && <td className="px-6 py-4"></td>}
                      </tr>
                      <tr className="bg-gray-100 dark:bg-gray-900">
                        <td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name={`otherIncomes.${index}.amount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor={`otherIncomes.${index}.amount`}
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Annual amount (before tax)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id={`otherIncomes.${index}.amount`}
                                    placeholder="Enter amount"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? parseInt(e.target.value)
                                          : undefined
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name={`otherIncomes.${index}.year`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor={`otherIncomes.${index}.year`}
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Year
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id={`otherIncomes.${index}.year`}
                                    placeholder="Enter year"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? parseInt(e.target.value)
                                          : undefined
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        {calculateForSpouse && <td className="px-6 py-4"></td>}
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name={`otherIncomes.${index}.startDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor={`otherIncomes.${index}.startDate`}
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Start Date
                                </FormLabel>
                                <FormControl>
                                  <DatePicker
                                    date={field.value}
                                    setDate={(date) => field.onChange(date)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name={`otherIncomes.${index}.endDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor={`otherIncomes.${index}.endDate`}
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  End Date
                                </FormLabel>
                                <FormControl>
                                  <DatePicker
                                    date={field.value}
                                    setDate={(date) => field.onChange(date)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        {calculateForSpouse && <td className="px-6 py-4"></td>}
                      </tr>
                      <tr className="bg-gray-100 dark:bg-gray-900">
                        <td colSpan={calculateForSpouse ? 3 : 2}>
                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              onClick={() => handleRemoveOtherIncome(income.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                  <tr className="bg-white dark:bg-gray-800">
                    <td colSpan={calculateForSpouse ? 3 : 2}>
                      <Button variant="outline" onClick={handleAddOtherIncome}>
                        Add Other Income
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default IncomeCard;
