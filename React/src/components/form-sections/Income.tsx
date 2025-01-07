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
import { Switch } from "@/components/ui/switch";
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalculatorSchema } from "../Schema";

// Receive the form object as a prop
interface IncomeCardProps {
  form: UseFormReturn<z.infer<typeof CalculatorSchema>>;
  calculateForSpouse: boolean;
}

const IncomeCard = ({ form, calculateForSpouse }: IncomeCardProps) => {
  // --- Helper Functions ---

  const handleAddOtherIncome = (personType: "self" | "spouse") => {
    const currentOtherIncomes = form.getValues("otherIncomes") || [];
    const newOtherIncome = {
      id: Date.now(),
      personType: personType,
      description: "",
      isAnnuity: false,
      amount: undefined,
      year: undefined,
      startDate: undefined,
      endDate: undefined,
    };

    form.setValue("otherIncomes", [...currentOtherIncomes, newOtherIncome]);
  };

  const handleRemoveOtherIncome = (id: number) => {
    const updatedOtherIncomes = form
      .getValues("otherIncomes")
      .filter((income) => income.id !== id);
    form.setValue("otherIncomes", updatedOtherIncomes);
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 cursor-pointer text-gray-500 dark:text-gray-400">
                              (?)
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Enter your annual employment income (before tax).
                              Include income from employment, consulting, small
                              business, or other sources. Do not include
                              investment income, pension income, RRSP, or RRIF
                              withdrawals.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </th>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="primaryYearlyIncomeSelf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="primaryYearlyIncomeSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              Annual income (before tax)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                id="primaryYearlyIncomeSelf"
                                placeholder="Enter income"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(
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
                          name="primaryYearlyIncomeSpouse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="primaryYearlyIncomeSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                Annual income (before tax)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="primaryYearlyIncomeSpouse"
                                  placeholder="Enter income"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(
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
                      <div className="flex items-center space-x-2">
                        <FormField
                          control={form.control}
                          name="incomeDateRangeSelf.from"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="incomeYearStartSelf"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                Start Year
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="incomeYearStartSelf"
                                  placeholder="Year"
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
                        <span>-</span>
                        <FormField
                          control={form.control}
                          name="incomeDateRangeSelf.to"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="incomeYearEndSelf"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                End Year
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="incomeYearEndSelf"
                                  placeholder="Year"
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
                      </div>
                    </td>
                    {calculateForSpouse && (
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <FormField
                            control={form.control}
                            name="incomeDateRangeSpouse.from"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor="incomeYearStartSpouse"
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Start Year
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id="incomeYearStartSpouse"
                                    placeholder="Year"
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
                          <span>-</span>
                          <FormField
                            control={form.control}
                            name="incomeDateRangeSpouse.to"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor="incomeYearEndSpouse"
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  End Year
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id="incomeYearEndSpouse"
                                    placeholder="Year"
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
                        </div>
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 cursor-pointer text-gray-500 dark:text-gray-400">
                              (?)
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Include income from government pensions (CPP/QPP,
                              OAS) and defined benefit pensions.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </th>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      Canada Pension Plan (CPP) or Quebec Pension Plan (QPP)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 cursor-pointer text-gray-500 dark:text-gray-400">
                              (?)
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              The age you start your pension, how long you
                              contributed, and your average earnings throughout
                              your life determine how much CPP or QPP you
                              receive. In 2023 the maximum annual pension for
                              someone retiring at age 65 is $15,678.84
                              ($1,306.57 per month).
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    {calculateForSpouse && <td className="px-6 py-4"></td>}
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="cppStartDateSelf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="cppStartDateSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              At what age have you/will you receive these
                              payments?
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                id="cppStartDateSelf"
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
                          name="cppStartDateSpouse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="cppStartDateSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                At what age have you/will you receive these
                                payments?
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="cppStartDateSpouse"
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 cursor-pointer text-gray-500 dark:text-gray-400">
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
                    </td>
                    {calculateForSpouse && <td className="px-6 py-4"></td>}
                  </tr>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="oasStartDateSelf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="oasStartDateSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              At what age have you/will you receive these
                              payments?
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                id="oasStartDateSelf"
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
                          name="oasStartDateSpouse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="oasStartDateSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                At what age have you/will you receive these
                                payments?
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="oasStartDateSpouse"
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 cursor-pointer text-gray-500 dark:text-gray-400">
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
                    </td>
                    {calculateForSpouse && <td className="px-6 py-4"></td>}
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="definedBenefitPensionStartDateSelf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="definedBenefitPensionStartDateSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              At what age have you/will you receive these
                              payments?
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                id="definedBenefitPensionStartDateSelf"
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
                          name="definedBenefitPensionStartDateSpouse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="definedBenefitPensionStartDateSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                At what age have you/will you receive these
                                payments?
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="definedBenefitPensionStartDateSpouse"
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
                        name="definedBenefitPensionAmountSelf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="definedBenefitPensionAmountSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              What is the annual amount (before tax)?
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                id="definedBenefitPensionAmountSelf"
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
                          name="definedBenefitPensionAmountSpouse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="definedBenefitPensionAmountSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                What is the annual amount (before tax)?
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="definedBenefitPensionAmountSpouse"
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
                        name="definedBenefitPensionIndexedToInflationSelf"
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
                          name="definedBenefitPensionIndexedToInflationSpouse"
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 cursor-pointer text-gray-500 dark:text-gray-400">
                              (?)
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Include income from rental properties, lump-sum
                              payments, inheritances, annuities, or other
                              sources. Do not include investment income, pension
                              income, RRSP, or RRIF withdrawals.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
                        {calculateForSpouse && (
                          <td className="px-6 py-4">
                            {/* Placeholder for alignment */}
                          </td>
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
                        {calculateForSpouse && (
                          <td className="px-6 py-4">
                            {/* Placeholder for alignment */}
                          </td>
                        )}
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <FormField
                              control={form.control}
                              name={`otherIncomes.${index}.startDate`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor={`otherIncomes.${index}.startDate`}
                                    className="text-gray-500 dark:text-gray-400"
                                  >
                                    Start Year
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      id={`otherIncomes.${index}.startDate`}
                                      placeholder="Year"
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
                            <span>-</span>
                            <FormField
                              control={form.control}
                              name={`otherIncomes.${index}.endDate`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor={`otherIncomes.${index}.endDate`}
                                    className="text-gray-500 dark:text-gray-400"
                                  >
                                    End Year
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      id={`otherIncomes.${index}.endDate`}
                                      placeholder="Year"
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
                          </div>
                        </td>
                        {calculateForSpouse && (
                          <td className="px-6 py-4">
                            {/* Placeholder for alignment */}
                          </td>
                        )}
                      </tr>
                      <tr className="bg-gray-100 dark:bg-gray-900">
                        <td colSpan={calculateForSpouse ? 3 : 2}>
                          <div className="flex justify-end">
                            <Button
                              type="button"
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
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddOtherIncome("self")}
                      >
                        Add Other Income (Self)
                      </Button>
                      {calculateForSpouse && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleAddOtherIncome("spouse")}
                        >
                          Add Other Income (Spouse)
                        </Button>
                      )}
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