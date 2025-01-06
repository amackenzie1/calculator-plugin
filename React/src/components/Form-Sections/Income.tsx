import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'
import * as z from 'zod'
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range'
import { Switch } from '@/components/ui/switch'
import { DatePicker } from '@/components/ui/date-picker'
import React from 'react'

// Receive the form object as a prop
interface IncomeCardProps {
  form: UseFormReturn<z.infer<typeof CalculatorSchema>>
}

// No need to redefine CalculatorSchema here

const IncomeCard = ({ form }: IncomeCardProps) => {
  // --- Helper Functions ---

  const handleAddOtherIncome = () => {
    form.setValue('otherIncomes', [
      ...(form.getValues('otherIncomes') || []),
      {
        id: Date.now(),
        description: '', // Now a string
        isAnnuity: false,
        amount: undefined,
        year: undefined,
        startDate: undefined,
        endDate: undefined,
      },
    ])
  }

  const handleRemoveOtherIncome = (id: number) => {
    form.setValue(
      'otherIncomes',
      form.getValues('otherIncomes').filter((income) => income.id !== id),
    )
  }

  /**
   * Calculates the equivalent constant yearly income based on a linear growth projection,
   * followed by a period of constant maximum income.
   *
   * This function performs the following steps:
   * 1. Calculates the present worth of the growing income phase using the gradient series present worth factor (P/G).
   * 2. Calculates the present worth of the constant income phase using the uniform series present worth factor (P/A),
   *    discounted to the present using the single payment present worth factor (P/F).
   * 3. Sums the present worths of both phases.
   * 4. Converts the total present worth to an equivalent annual income over the entire career duration using the
   *    capital recovery factor (A/P).
   *
   * @param {number} startingYearlyIncome - The initial yearly income (A1).
   * @param {number} currentYearlyIncome - The current yearly income (not directly used in calculations, only for display).
   * @param {number} maxYearlyIncome - The projected maximum yearly income (Amax).
   * @param {number} yearsToReachMax - The number of years it takes to reach the maximum income (N).
   * @param {number} totalCareerYears - The total duration of the career, including both growth and constant phases (T).
   * @param {number} growthRate - The assumed average annual growth/inflation rate (i).
   * @returns {number | undefined} The equivalent constant yearly income, or undefined if inputs are invalid.
   */
  const calculateEquivalentAnnualIncome = (
    startingYearlyIncome: number | undefined,
    currentYearlyIncome: number | undefined,
    maxYearlyIncome: number | undefined,
    yearsToReachMax: number | undefined,
    totalCareerYears: number | undefined,
    growthRate: number = 0.03,
  ): number | undefined => {
    // Input validation
    if (
      startingYearlyIncome === undefined ||
      currentYearlyIncome === undefined ||
      maxYearlyIncome === undefined ||
      yearsToReachMax === undefined ||
      totalCareerYears === undefined ||
      yearsToReachMax <= 0 ||
      totalCareerYears <= 0 ||
      totalCareerYears <= yearsToReachMax
    ) {
      return undefined
    }

    // Define variables for clarity
    const A1 = startingYearlyIncome
    const Amax = maxYearlyIncome
    const N = yearsToReachMax
    const T = totalCareerYears
    const i = growthRate

    // --- Calculations for the Growth Phase ---

    // Calculate the gradient (G)
    const G = (Amax - A1) / N

    // Calculate the present worth of the gradient series (P_gradient)
    const PG_factor = (1 / i ** 2) * ((1 + i) ** N - i * N - 1)
    const P_gradient = G * PG_factor

    // Calculate the present worth of the initial income (P_A1)
    const PA_factor_N = ((1 + i) ** N - 1) / (i * (1 + i) ** N)
    const P_A1 = A1 * PA_factor_N

    // Total present worth of the growth phase
    const P_growth = P_gradient + P_A1

    // --- Calculations for the Constant Income Phase ---

    // Calculate the duration of the constant income phase (N_constant)
    const N_constant = T - N

    // Calculate the present worth of the constant income phase as if it started immediately (P_constant_intermediate)
    const PA_factor_N_constant =
      ((1 + i) ** N_constant - 1) / (i * (1 + i) ** N_constant)
    const P_constant_intermediate = Amax * PA_factor_N_constant

    // Discount the present worth of the constant income phase to the true present (P_constant)
    const PF_factor = 1 / (1 + i) ** N
    const P_constant = P_constant_intermediate * PF_factor

    // --- Total Present Worth and Conversion to Annuity ---

    // Calculate the total present worth (P_total)
    const P_total = P_growth + P_constant

    // Convert the total present worth to an equivalent annual income over the entire career duration (A_total)
    const AP_factor = (i * (1 + i) ** T) / ((1 + i) ** T - 1)
    const A_total = P_total * AP_factor

    return A_total
  }

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
                  <tr className="bg-white dark:bg-gray-800">
                    <th scope="row" className="px-6 py-4 font-medium">
                      Advanced Mode
                    </th>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="advancedMode"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                id="advancedMode"
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked)
                                  // Reset advanced mode fields when unchecked
                                  if (!checked) {
                                    form.setValue(
                                      'startingYearlyRevenueSelf',
                                      undefined,
                                    )
                                    form.setValue(
                                      'currentYearlyRevenueSelf',
                                      undefined,
                                    )
                                    form.setValue(
                                      'projectedMaxYearlyRevenueSelf',
                                      undefined,
                                    )
                                    form.setValue(
                                      'yearsToReachMaxRevenueSelf',
                                      undefined,
                                    )
                                    form.setValue(
                                      'totalCareerYearsSelf',
                                      undefined,
                                    )
                                    form.setValue(
                                      'convertedYearlyIncomeSelf',
                                      undefined,
                                    )
                                    if (form.getValues('calculateForSpouse')) {
                                      form.setValue(
                                        'startingYearlyRevenueSpouse',
                                        undefined,
                                      )
                                      form.setValue(
                                        'currentYearlyRevenueSpouse',
                                        undefined,
                                      )
                                      form.setValue(
                                        'projectedMaxYearlyRevenueSpouse',
                                        undefined,
                                      )
                                      form.setValue(
                                        'yearsToReachMaxRevenueSpouse',
                                        undefined,
                                      )
                                      form.setValue(
                                        'totalCareerYearsSpouse',
                                        undefined,
                                      )
                                      form.setValue(
                                        'convertedYearlyIncomeSpouse',
                                        undefined,
                                      )
                                    }
                                  }
                                }}
                                aria-label="Enable Advanced Mode"
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor="advancedMode"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              Enable Advanced Mode
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </td>
                    {form.watch('calculateForSpouse') && (
                      <td className="px-6 py-4"></td>
                    )}
                  </tr>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium"
                      rowSpan={form.watch('advancedMode') ? 7 : 2}
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
                                      : undefined,
                                  )
                                  // Update yearlyAnnuitySelf when employmentIncomeSelf changes
                                  if (!form.watch('advancedMode')) {
                                    form.setValue(
                                      'yearlyAnnuitySelf',
                                      e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined,
                                    )
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    {form.watch('calculateForSpouse') && (
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
                                        : undefined,
                                    )
                                    // Update yearlyAnnuitySpouse when employmentIncomeSpouse changes
                                    if (!form.watch('advancedMode')) {
                                      form.setValue(
                                        'yearlyAnnuitySpouse',
                                        e.target.value
                                          ? parseInt(e.target.value)
                                          : undefined,
                                      )
                                    }
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
                    {form.watch('calculateForSpouse') && (
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
                  {form.watch('advancedMode') && (
                    <>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name="startingYearlyRevenueSelf"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor="startingYearlyRevenueSelf"
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Starting yearly revenue
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id="startingYearlyRevenueSelf"
                                    placeholder="Enter starting revenue"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? parseInt(e.target.value)
                                          : undefined,
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        {form.watch('calculateForSpouse') && (
                          <td className="px-6 py-4">
                            <FormField
                              control={form.control}
                              name="startingYearlyRevenueSpouse"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor="startingYearlyRevenueSpouse"
                                    className="text-gray-500 dark:text-gray-400"
                                  >
                                    Starting yearly revenue
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      id="startingYearlyRevenueSpouse"
                                      placeholder="Enter starting revenue"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value
                                            ? parseInt(e.target.value)
                                            : undefined,
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
                            name="currentYearlyRevenueSelf"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor="currentYearlyRevenueSelf"
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Current yearly revenue
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id="currentYearlyRevenueSelf"
                                    placeholder="Enter current revenue"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? parseInt(e.target.value)
                                          : undefined,
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        {form.watch('calculateForSpouse') && (
                          <td className="px-6 py-4">
                            <FormField
                              control={form.control}
                              name="currentYearlyRevenueSpouse"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor="currentYearlyRevenueSpouse"
                                    className="text-gray-500 dark:text-gray-400"
                                  >
                                    Current yearly revenue
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      id="currentYearlyRevenueSpouse"
                                      placeholder="Enter current revenue"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value
                                            ? parseInt(e.target.value)
                                            : undefined,
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
                            name="projectedMaxYearlyRevenueSelf"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor="projectedMaxYearlyRevenueSelf"
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Projected max yearly revenue
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id="projectedMaxYearlyRevenueSelf"
                                    placeholder="Enter projected max revenue"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? parseInt(e.target.value)
                                          : undefined,
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        {form.watch('calculateForSpouse') && (
                          <td className="px-6 py-4">
                            <FormField
                              control={form.control}
                              name="projectedMaxYearlyRevenueSpouse"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor="projectedMaxYearlyRevenueSpouse"
                                    className="text-gray-500 dark:text-gray-400"
                                  >
                                    Projected max yearly revenue
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      id="projectedMaxYearlyRevenueSpouse"
                                      placeholder="Enter projected max revenue"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value
                                            ? parseInt(e.target.value)
                                            : undefined,
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
                            name="yearsToReachMaxRevenueSelf"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor="yearsToReachMaxRevenueSelf"
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Years to reach projected max revenue
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id="yearsToReachMaxRevenueSelf"
                                    placeholder="Enter years"
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
                        {form.watch('calculateForSpouse') && (
                          <td className="px-6 py-4">
                            <FormField
                              control={form.control}
                              name="yearsToReachMaxRevenueSpouse"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor="yearsToReachMaxRevenueSpouse"
                                    className="text-gray-500 dark:text-gray-400"
                                  >
                                    Years to reach projected max revenue
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      id="yearsToReachMaxRevenueSpouse"
                                      placeholder="Enter years"
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
                            name="totalCareerYearsSelf"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor="totalCareerYearsSelf"
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Total years in career
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id="totalCareerYearsSelf"
                                    placeholder="Enter total years"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(
                                        e.target.value
                                          ? parseInt(e.target.value)
                                          : undefined
                                      )
                                      // Calculate and set the converted yearly income when totalCareerYearsSelf changes
                                      const starting = form.getValues(
                                        'startingYearlyRevenueSelf',
                                      )
                                      const current = form.getValues(
                                        'currentYearlyRevenueSelf',
                                      )
                                      const max = form.getValues(
                                        'projectedMaxYearlyRevenueSelf',
                                      )
                                      const yearsToMax = form.getValues(
                                        'yearsToReachMaxRevenueSelf',
                                      )
                                      const converted =
                                        calculateEquivalentAnnualIncome(
                                          starting,
                                          current,
                                          max,
                                          yearsToMax,
                                          e.target.value
                                            ? parseInt(e.target.value)
                                            : undefined,
                                        )
                                      form.setValue(
                                        'convertedYearlyIncomeSelf',
                                        converted,
                                      )
                                      // Update yearlyAnnuitySelf with the converted value
                                      form.setValue(
                                        'yearlyAnnuitySelf',
                                        converted,
                                      )
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        {form.watch('calculateForSpouse') && (
                          <td className="px-6 py-4">
                            <FormField
                              control={form.control}
                              name="totalCareerYearsSpouse"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor="totalCareerYearsSpouse"
                                    className="text-gray-500 dark:text-gray-400"
                                  >
                                    Total years in career
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      id="totalCareerYearsSpouse"
                                      placeholder="Enter total years"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(
                                          e.target.value
                                            ? parseInt(e.target.value)
                                            : undefined
                                        )
                                        // Calculate and set the converted yearly income when totalCareerYearsSpouse changes
                                        const starting = form.getValues(
                                          'startingYearlyRevenueSpouse',
                                        )
                                        const current = form.getValues(
                                          'currentYearlyRevenueSpouse',
                                        )
                                        const max = form.getValues(
                                          'projectedMaxYearlyRevenueSpouse',
                                        )
                                        const yearsToMax = form.getValues(
                                          'yearsToReachMaxRevenueSpouse',
                                        )
                                        const converted =
                                          calculateEquivalentAnnualIncome(
                                            starting,
                                            current,
                                            max,
                                            yearsToMax,
                                            e.target.value
                                              ? parseInt(e.target.value)
                                              : undefined,
                                          )
                                        form.setValue(
                                          'convertedYearlyIncomeSpouse',
                                          converted,
                                        )
                                        // Update yearlyAnnuitySpouse with the converted value
                                        form.setValue(
                                          'yearlyAnnuitySpouse',
                                          converted,
                                        )
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
                            name="convertedYearlyIncomeSelf"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor="convertedYearlyIncomeSelf"
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Converted Yearly Income (Annuity)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id="convertedYearlyIncomeSelf"
                                    placeholder="Calculated Annuity"
                                    disabled
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        {form.watch('calculateForSpouse') && (
                          <td className="px-6 py-4">
                            <FormField
                              control={form.control}
                              name="convertedYearlyIncomeSpouse"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor="convertedYearlyIncomeSpouse"
                                    className="text-gray-500 dark:text-gray-400"
                                  >
                                    Converted Yearly Income (Annuity)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      id="convertedYearlyIncomeSpouse"
                                      placeholder="Calculated Annuity"
                                      disabled
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>
                        )}
                      </tr>
                    </>
                  )}
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
                    {form.watch('calculateForSpouse') && (
                      <td className="px-6 py-4"></td>
                    )}
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
                                      : undefined,
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    {form.watch('calculateForSpouse') && (
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
                                        : undefined,
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
                                      : undefined,
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    {form.watch('calculateForSpouse') && (
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
                                        : undefined,
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
                    {form.watch('calculateForSpouse') && (
                      <td className="px-6 py-4"></td>
                    )}
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
                                      : undefined,
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    {form.watch('calculateForSpouse') && (
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
                                        : undefined,
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
                                      : undefined,
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    {form.watch('calculateForSpouse') && (
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
                                        : undefined,
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
                    {form.watch('calculateForSpouse') && (
                      <td className="px-6 py-4"></td>
                    )}
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
                                      : undefined,
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    {form.watch('calculateForSpouse') && (
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
                                        : undefined,
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
                                      : undefined,
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    {form.watch('calculateForSpouse') && (
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
                                        : undefined,
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
                    {form.watch('calculateForSpouse') && (
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
                    {form.watch('calculateForSpouse') && (
                      <td className="px-6 py-4"></td>
                    )}
                  </tr>
                  {form.watch('otherIncomes')?.map((income, index) => (
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
                        {form.watch('calculateForSpouse') && (
                          <td className="px-6 py-4"></td>
                        )}
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
                                          : undefined,
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
                                          : undefined,
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        {form.watch('calculateForSpouse') && (
                          <td className="px-6 py-4"></td>
                        )}
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
                        {form.watch('calculateForSpouse') && (
                          <td className="px-6 py-4"></td>
                        )}
                      </tr>
                      <tr className="bg-gray-100 dark:bg-gray-900">
                        <td colSpan={form.watch('calculateForSpouse') ? 3 : 2}>
                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              onClick={() =>
                                handleRemoveOtherIncome(income.id)
                              }
                            >
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                  <tr className="bg-white dark:bg-gray-800">
                    <td colSpan={form.watch('calculateForSpouse') ? 3 : 2}>
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
  )
}

export default IncomeCard