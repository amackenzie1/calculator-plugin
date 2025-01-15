"use client";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CalculatorSchema } from "../Schema";
import { PlusIcon } from "@radix-ui/react-icons";

interface ExpensesCardProps {
  form: UseFormReturn<z.infer<typeof CalculatorSchema>>;
  calculateForSpouse: boolean;
}

const ExpensesCard: React.FC<ExpensesCardProps> = ({
  form,
  calculateForSpouse,
 
}) => {
  const [oneOffExpenseIdCounter, setOneOffExpenseIdCounter] = useState(0);
  const [charitableDonationIdCounter, setCharitableDonationIdCounter] = useState(0);

  const expensesChangeForEachStage = form.watch("expensesChangeForEachStage");
  const expensesChangeForEachStageSpouse = form.watch("expensesChangeForEachStageSpouse");

  const handleAddOneOffExpense = (personType: "self" | "spouse") => {
    setOneOffExpenseIdCounter((prev) => prev + 1);
    form.setValue(`oneOffExpenses.${oneOffExpenseIdCounter}`, {
      id: oneOffExpenseIdCounter,
      personType: personType, // Use the passed personType
      description: "",
      amount: undefined,
      year: undefined,
    });
  };
  
  const handleAddCharitableDonation = (personType: "self" | "spouse") => {
    setCharitableDonationIdCounter((prev) => prev + 1);
    form.setValue(`charitableDonations.${charitableDonationIdCounter}`, {
      id: charitableDonationIdCounter,
      personType: personType, // Use the passed personType
      amount: undefined,
      startYear: undefined,
      endYear: undefined,
    });
  };

  const handleRemoveOneOffExpense = (id: number) => {
    const updatedExpenses = form
      .getValues("oneOffExpenses")
      .filter((expense) => expense.id !== id);
    form.setValue("oneOffExpenses", updatedExpenses, { shouldDirty: true });
  };



  const handleRemoveCharitableDonation = (id: number) => {
    const updatedDonations = form
      .getValues("charitableDonations")
      .filter((donation) => donation.id !== id);
    form.setValue("charitableDonations", updatedDonations, { shouldDirty: true });
  };
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form values:", value); // Log the entire form state
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Card className="mx-auto w-full max-w-3xl border-orange-500">
      <CardHeader className="text-center">
        <CardTitle className="text-orange-500 text-3xl underline">
          Expenses
        </CardTitle>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Enter your estimated expenses below.
        </span>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <tbody>
                  {/* Retirement Expenses */}
                  <tr>
                    <td colSpan={calculateForSpouse ? 3 : 2}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <h2 className="text-xl font-semibold mb-2 underline relative inline-block">
                              Retirement Expenses
                              <span className="ml-1 cursor-pointer text-gray-500 dark:text-gray-400 text-xs no-underline absolute top-0 right-[-20px]">
                                (?)
                              </span>
                            </h2>
                          </TooltipTrigger>
                          <TooltipContent className="custom-tooltip-content">
                            <p>
                              Enter the expected annual cost of essential items for
                              the lifestyle you desire throughout your retirement
                              years. Note: If you’re a Surplus member, you have
                              access to a comprehensive expenses worksheet to help
                              give you a more accurate estimate of all of your
                              expenses e.g., discretionary, non-discretionary,
                              health care, one-off items.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                  </tr>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <th scope="row" className="px-6 py-4 font-medium">
                    </th>
                    <td className="px-6 py-4">
                      <span className="font-semibold">You</span>
                    </td>
                    {calculateForSpouse && (
                      <td className="px-6 py-4">
                        <span className="font-semibold">Spouse</span>
                      </td>
                    )}
                  </tr>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <th scope="row" className="px-6 py-4 font-medium">
                      Annual Retirement Expenses
                    </th>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name={`persons.0.annualRetirementExpenses`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter amount"
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
                          name={`persons.1.annualRetirementExpenses`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter amount"
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
                    <th scope="row" className="px-6 py-4 font-medium">
                      Annual Health Care Expenses
                    </th>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name={`persons.0.healthCareExpenses`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter amount"
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
                          name={`persons.1.healthCareExpenses`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter amount"
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
                    <th scope="row" className="px-6 py-4 font-medium">
                      Specify Expenses Through Each Stage of Retirement?
                    </th>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="expensesChangeForEachStage"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel className="text-gray-500 dark:text-gray-400">
                                Specify expenses through each stage of retirement?
                              </FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                    field.onChange(checked); // Update the form state
                                    console.log("expensesChangeForEachStage:", checked); // Debugging
                                  }}
                                aria-label="Toggle if expenses change for each stage"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                    {expensesChangeForEachStage && (
  <>
    {/* Retirement Stage 1: Current Age to 75 */}
    <tr>
      <td colSpan={calculateForSpouse ? 3 : 2}>
        <Card className="border-orange-500">
          <CardHeader>
            <CardTitle className="text-orange-500">
              Retirement Stage 1: Current Age to 75
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="persons.0.annualRetirementExpensesStage2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500 dark:text-gray-400">
                      Annual Expenses (Current Age to 75)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : undefined
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
                name="persons.0.healthCareExpensesStage2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500 dark:text-gray-400">
                      Annual Health Care Expenses (Current Age to 75)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </td>
    </tr>

    {/* Retirement Stage 2: Ages 76 to 85 */}
    <tr>
      <td colSpan={calculateForSpouse ? 3 : 2}>
        <Card className="border-orange-500">
          <CardHeader>
            <CardTitle className="text-orange-500">
              Retirement Stage 2: Ages 76 to 85
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="persons.0.annualRetirementExpensesStage3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500 dark:text-gray-400">
                      Annual Expenses (Ages 76 to 85)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : undefined
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
                name="persons.0.healthCareExpensesStage3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500 dark:text-gray-400">
                      Annual Health Care Expenses (Ages 76 to 85)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </td>
    </tr>

    {/* Retirement Stage 3: Ages 86 to Life Expectancy */}
    <tr>
      <td colSpan={calculateForSpouse ? 3 : 2}>
        <Card className="border-orange-500">
          <CardHeader>
            <CardTitle className="text-orange-500">
              Retirement Stage 3: Ages 86 to Life Expectancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="persons.0.annualRetirementExpensesStage4"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500 dark:text-gray-400">
                      Annual Expenses (Ages 86 to Life Expectancy)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : undefined
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
                name="persons.0.healthCareExpensesStage4"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500 dark:text-gray-400">
                      Annual Health Care Expenses (Ages 86 to Life Expectancy)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </td>
    </tr>
  </>
)} 
                    </td>
                    {calculateForSpouse && (
                      <td className="px-6 py-4">
                        <FormField
                          control={form.control}
                          name="expensesChangeForEachStageSpouse"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel className="text-gray-500 dark:text-gray-400">
                                  Spouse specify expenses through each stage of retirement?
                                </FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked); // Update the form state
                                    console.log("expensesChangeForEachStageSpouse:", checked); // Debugging
                                  }}
                                  aria-label="Toggle if expenses change for each stage"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {expensesChangeForEachStageSpouse && (
  <>
    {/* Retirement Stage 1: Current Age to 75 */}
    <tr>
      <td colSpan={calculateForSpouse ? 3 : 2}>
        <Card className="border-orange-500">
          <CardHeader>
            <CardTitle className="text-orange-500">
              Retirement Stage 1: Current Age to 75
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="persons.0.annualRetirementExpensesStage2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500 dark:text-gray-400">
                      Annual Expenses (Current Age to 75)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : undefined
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
                name="persons.0.healthCareExpensesStage2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500 dark:text-gray-400">
                      Annual Health Care Expenses (Current Age to 75)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </td>
    </tr>

    {/* Retirement Stage 2: Ages 76 to 85 */}
    <tr>
      <td colSpan={calculateForSpouse ? 3 : 2}>
        <Card className="border-orange-500">
          <CardHeader>
            <CardTitle className="text-orange-500">
              Retirement Stage 2: Ages 76 to 85
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="persons.0.annualRetirementExpensesStage3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500 dark:text-gray-400">
                      Annual Expenses (Ages 76 to 85)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : undefined
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
                name="persons.0.healthCareExpensesStage3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500 dark:text-gray-400">
                      Annual Health Care Expenses (Ages 76 to 85)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </td>
    </tr>

    {/* Retirement Stage 3: Ages 86 to Life Expectancy */}
    <tr>
      <td colSpan={calculateForSpouse ? 3 : 2}>
        <Card className="border-orange-500">
          <CardHeader>
            <CardTitle className="text-orange-500">
              Retirement Stage 3: Ages 86 to Life Expectancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="persons.0.annualRetirementExpensesStage4"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500 dark:text-gray-400">
                      Annual Expenses (Ages 86 to Life Expectancy)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : undefined
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
                name="persons.0.healthCareExpensesStage4"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500 dark:text-gray-400">
                      Annual Health Care Expenses (Ages 86 to Life Expectancy)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </td>
    </tr>
  </>
)}
                      </td>
                    )}
                  </tr>

                  {/* One-Off Expenses */}
                  <tr>
                    <td colSpan={calculateForSpouse ? 3 : 2}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <h2 className="text-xl font-semibold mb-2 underline relative inline-block">
                              One-Off Expenses
                              <span className="ml-1 cursor-pointer text-gray-500 dark:text-gray-400 text-xs no-underline absolute top-0 right-[-20px]">
                                (?)
                              </span>
                            </h2>
                          </TooltipTrigger>
                          <TooltipContent className="custom-tooltip-content">
                            <p>
                              Enter any one-off items you anticipate in the future.
                              One-off expenses could include travel and vacations,
                              any big-ticket items, gifting, and helping children
                              with downpayments or weddings.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                  </tr>
                  {form.watch("oneOffExpenses")?.map((expense, index) => (
                    <React.Fragment key={expense.id}>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="px-6 py-4 w-2/3">
                          <FormField
                            control={form.control}
                            name={`oneOffExpenses.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor={`oneOffExpenses.${index}.description`}
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Description
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    id={`oneOffExpenses.${index}.description`}
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
                            name={`oneOffExpenses.${index}.amount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor={`oneOffExpenses.${index}.amount`}
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Amount
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id={`oneOffExpenses.${index}.amount`}
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
                        {/* {calculateForSpouse && (
                          <td className="px-6 py-4">
                            <FormField
                              control={form.control}
                              name={`oneOffExpenses.${index}.personType`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor={`oneOffExpenses.${index}.personType`}
                                    className="text-gray-500 dark:text-gray-400"
                                  >
                                    Person
                                  </FormLabel>
                                  <FormControl>
                                    <select
                                      {...field}
                                      className="bg-white border border-gray-300 px-3 py-2 rounded-md w-full"
                                    >
                                      <option value="self">Self</option>
                                      <option value="spouse">Spouse</option>
                                    </select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>
                        )} */}

<td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name={`oneOffExpenses.${index}.year`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor={`oneOffExpenses.${index}.year`}
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Year
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id={`oneOffExpenses.${index}.year`}
                                    placeholder="Enter year"
                                    className="w-full"
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
                        <td colSpan={calculateForSpouse ? 3 : 2}>
                          <div className="flex justify-end">
                            <Button
                            className="mr-4"
                              type="button"
                              variant="outline"
                              onClick={() => handleRemoveOneOffExpense(expense.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                  <tr className="bg-white dark:bg-gray-800">
  <td className="px-6 py-4 text-gray-500 dark:text-gray-400"></td>
  <td colSpan={calculateForSpouse ? 3 : 2}>
    <div className="flex justify-start space-x-14 ml-8">
      <Button
      className="mb-5"
        type="button"
        variant="outline"
        onClick={() => handleAddOneOffExpense("self")}
      >
        Add One-Off Expense (Self)
      </Button>
      {calculateForSpouse && (
        <Button
          type="button"
          variant="outline"
          onClick={() => handleAddOneOffExpense("spouse")}
        >
          Add One-Off Expense (Spouse)
        </Button>
      )}
    </div>
  </td>
</tr>

                  {/* Charitable Donations */}
                  <tr>
                    <td colSpan={calculateForSpouse ? 3 : 2}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <h2 className="text-xl font-semibold mb-2 underline relative inline-block">
                              Charitable Donations
                              <span className="ml-1 cursor-pointer text-gray-500 dark:text-gray-400 text-xs no-underline absolute top-0 right-[-20px]">
                                (?)
                              </span>
                            </h2>
                          </TooltipTrigger>
                          <TooltipContent className="custom-tooltip-content">
                            <p>
                              Use this section if you will make a one-time donation
                              or any annual donations in the future. We will record
                              this as a use of funds and will calculate the income
                              tax reduction from any donations you make.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                  </tr>
                  {form.watch("charitableDonations")?.map((donation, index) => (
                    <React.Fragment key={donation.id}>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name={`charitableDonations.${index}.amount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor={`charitableDonations.${index}.amount`}
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Annual Donations
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id={`charitableDonations.${index}.amount`}
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
                            name={`charitableDonations.${index}.startYear`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor={`charitableDonations.${index}.startYear`}
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Start Year
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id={`charitableDonations.${index}.startYear`}
                                    placeholder="Enter start year"
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
                            name={`charitableDonations.${index}.endYear`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor={`charitableDonations.${index}.endYear`}
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  End Year
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id={`charitableDonations.${index}.endYear`}
                                    placeholder="Enter end year"
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
                        <td colSpan={calculateForSpouse ? 3 : 2}>
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleRemoveCharitableDonation(donation.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                  <tr className="bg-white dark:bg-gray-800">
  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 ml-8"></td>
  <td colSpan={calculateForSpouse ? 3 : 2}>
    <div className="flex justify-start space-x-9 ml-8">
      <Button
      className="mb-4"
        type="button"
        variant="outline"
        onClick={() => handleAddCharitableDonation("self")}
      >
        Add Charitable Donation (Self)
      </Button>
      {calculateForSpouse && (
        <Button
        className="mb-4"
          type="button"
          variant="outline"
          onClick={() => handleAddCharitableDonation("spouse")}
        >
          Add Charitable Donation (Spouse)
        </Button>
      )}
    </div>
  </td>
</tr>

                  {/* Desired Estate */}
                  <tr>
                    <td colSpan={calculateForSpouse ? 3 : 2}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <h2 className="text-xl font-semibold mb-2 underline relative inline-block">
                              Desired Estate (to be left to heirs)
                              <span className="ml-1 cursor-pointer text-gray-500 dark:text-gray-400 text-xs no-underline absolute top-0 right-[-20px]">
                                (?)
                              </span>
                            </h2>
                          </TooltipTrigger>
                          <TooltipContent className="custom-tooltip-content">
                            <p>
                              Please state your desired estate amount (if any) you’d
                              like to leave behind to your family, heirs, and
                              charities at your life expectancy age. Stating this
                              amount will help determine whether you have a surplus
                              by excluding the amount from the projections in your
                              retirement years. The amount is then added back into
                              your net estate at life expectancy.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                  </tr>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <th scope="row" className="px-6 py-4 font-medium">
                      Desired Estate Amount
                    </th>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="desiredEstateValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter amount"
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
                        {/* Placeholder for alignment */}
                      </td>
                    )}
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

export default ExpensesCard;