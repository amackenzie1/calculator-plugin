"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UseFormReturn } from "react-hook-form";
import { CalculatorSchema } from "@/schema";
import * as z from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { Switch } from "@/components/ui/switch";

interface ExpensesCardProps {
  form: UseFormReturn<z.infer<typeof CalculatorSchema>>;
  calculateForSpouse?: boolean;
}

const ExpensesCard: React.FC<ExpensesCardProps> = ({
  form,
  calculateForSpouse,
}) => {
  const [oneOffExpenseIdCounter, setOneOffExpenseIdCounter] = useState(0);
  const [charitableDonationIdCounter, setCharitableDonationIdCounter] =
    useState(0);

  const expensesChangeForEachStage = form.watch(
    "expensesChangeForEachStage"
  );
  const expensesChangeForEachStageSpouse = form.watch(
    "expensesChangeForEachStageSpouse"
  );

  const handleAddOneOffExpense = () => {
    setOneOffExpenseIdCounter((prev) => prev + 1);
    form.setValue(`oneOffExpenses.${oneOffExpenseIdCounter}`, {
      id: oneOffExpenseIdCounter,
      personType: "self",
      description: "",
      amount: undefined,
      year: undefined,
    });
  };

  const handleAddCharitableDonation = () => {
    setCharitableDonationIdCounter((prev) => prev + 1);
    form.setValue(`charitableDonations.${charitableDonationIdCounter}`, {
      id: charitableDonationIdCounter,
      personType: "self",
      amount: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-blue-500">
        <CardTitle className="text-white flex items-center">
          <span className="underline">Expenses</span>
        </CardTitle>
        <CardDescription className="text-white">
          Enter your estimated expenses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-6">
            {/* Retirement Expenses */}
            <Card className="border-blue-500">
              <CardHeader>
                <CardTitle className="text-blue-500 flex items-center">
                  Retirement Expenses
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="ml-2 cursor-pointer">
                          <PlusIcon className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Enter the expected annual cost of essential items for
                          the lifestyle you desire throughout your retirement
                          years. Note: If you’re a Surplus member you have
                          access to a comprehensive expenses worksheet to help
                          give you a more accurate estimate of all of your
                          expenses e.g., discretionary, non-discretionary,
                          health care, one-off items.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
                <CardDescription>
                  Enter your estimated annual expenses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <FormField
                      control={form.control}
                      name="persons.0.annualRetirementExpenses"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>
                            Annual expenses:
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="ml-2 cursor-pointer">
                                    <PlusIcon className="h-4 w-4" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Enter a rounded estimate of the annual cost
                                    for the lifestyle you desire throughout your
                                    retirement years.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter amount"
                              {...field}
                              onBlur={(e) => {
                                field.onBlur();
                                form.setValue(
                                  "persons.0.annualRetirementExpenses",
                                  Number(e.target.value)
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {calculateForSpouse && (
                      <FormField
                        control={form.control}
                        name="persons.1.annualRetirementExpenses"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Spouse annual expenses:</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter amount"
                                {...field}
                                onBlur={(e) => {
                                  field.onBlur();
                                  form.setValue(
                                    "persons.1.annualRetirementExpenses",
                                    Number(e.target.value)
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <FormField
                      control={form.control}
                      name="persons.0.healthCareExpenses"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>
                            Annual health care expenses:
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="ml-2 cursor-pointer">
                                    <PlusIcon className="h-4 w-4" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Enter a rounded estimate of the annual cost
                                    of health care throughout your retirement
                                    years.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter amount"
                              {...field}
                              onBlur={(e) => {
                                field.onBlur();
                                form.setValue(
                                  "persons.0.healthCareExpenses",
                                  Number(e.target.value)
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {calculateForSpouse && (
                      <FormField
                        control={form.control}
                        name="persons.1.healthCareExpenses"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Spouse health care expenses:</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter amount"
                                {...field}
                                onBlur={(e) => {
                                  field.onBlur();
                                  form.setValue(
                                    "persons.1.healthCareExpenses",
                                    Number(e.target.value)
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <FormField
                      control={form.control}
                      name="expensesChangeForEachStage"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1">
                          <div className="space-y-0.5">
                            <FormLabel>
                              Specify expenses through each stage of retirement?
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="ml-2 cursor-pointer">
                                      <PlusIcon className="h-4 w-4" />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Your spending priorities will likely
                                      change with each decade in retirement.
                                      Selecting yes will help you break down your
                                      expenses and health care for each decade
                                      giving you a more accurate estimate.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </FormLabel>
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
                    {calculateForSpouse && (
                      <FormField
                        control={form.control}
                        name="expensesChangeForEachStageSpouse"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1">
                            <div className="space-y-0.5">
                              <FormLabel>
                                Spouse specify expenses through each stage of
                                retirement?
                              </FormLabel>
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
                    )}
                  </div>

                  {expensesChangeForEachStage && (
                    <>
                      {/* Retirement Stage 1 */}
                      <Card className="border-orange-500">
                        <CardHeader>
                          <CardTitle className="text-orange-500 flex items-center">
                            Retirement Stage 1: Current Age to 75
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="ml-2 cursor-pointer">
                                    <PlusIcon className="h-4 w-4" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    People usually spend 15%-25% less on
                                    discretionary and non-discretionary expenses
                                    approaching the age of 75. <br />
                                    Experts estimate between $40,000 to $70,000
                                    to cover the annual spending needs for most
                                    single retired Canadians. For a retired
                                    couple, the range might be between $50,000
                                    to $80,000. <br />
                                    As a precaution, you could increase your
                                    health spending estimates by 15%-25% nearing
                                    the age of 75.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                              <FormField
                                control={form.control}
                                name="persons.0.annualRetirementExpensesStage2"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>
                                      Annual expenses from current age to 75:
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="Enter amount"
                                        {...field}
                                        onBlur={(e) => {
                                          field.onBlur();
                                          form.setValue(
                                            "persons.0.annualRetirementExpensesStage2",
                                            Number(e.target.value)
                                          );
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {calculateForSpouse && (
                                <FormField
                                  control={form.control}
                                  name="persons.1.annualRetirementExpensesStage2"
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormLabel>
                                        Spouse annual expenses from current age
                                        to 75:
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="Enter amount"
                                          {...field}
                                          onBlur={(e) => {
                                            field.onBlur();
                                            form.setValue(
                                              "persons.1.annualRetirementExpensesStage2",
                                              Number(e.target.value)
                                            );
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                            <div className="flex items-center space-x-4">
                              <FormField
                                control={form.control}
                                name="persons.0.healthCareExpensesStage2"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>
                                      Annual health care expenses from current
                                      age to 75:
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="Enter amount"
                                        {...field}
                                        onBlur={(e) => {
                                          field.onBlur();
                                          form.setValue(
                                            "persons.0.healthCareExpensesStage2",
                                            Number(e.target.value)
                                          );
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {calculateForSpouse && (
                                <FormField
                                  control={form.control}
                                  name="persons.1.healthCareExpensesStage2"
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormLabel>
                                        Spouse annual health care expenses from
                                        current age to 75:
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="Enter amount"
                                          {...field}
                                          onBlur={(e) => {
                                            field.onBlur();
                                            form.setValue(
                                              "persons.1.healthCareExpensesStage2",
                                              Number(e.target.value)
                                            );
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
                        </CardContent>
                      </Card>

                      {/* Retirement Stage 2 */}
                      <Card className="border-orange-500">
                        <CardHeader>
                          <CardTitle className="text-orange-500 flex items-center">
                            Retirement Stage 2: Ages 76 to 85
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="ml-2 cursor-pointer">
                                    <PlusIcon className="h-4 w-4" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Expect to reduce spending by a further
                                    15%-25% on discretionary and
                                    non-discretionary expenses by the age of 85.
                                    You may spend less on travel, clothes,
                                    drinking, dining, etc. <br />
                                    Depending on your situation, health care
                                    expenses may increase by a further 15%-25%
                                    nearing the age of 85.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                              <FormField
                                control={form.control}
                                name="persons.0.annualRetirementExpensesStage3"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>
                                      Annual expenses from age 76 to 85:
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="Enter amount"
                                        {...field}
                                        onBlur={(e) => {
                                          field.onBlur();
                                          form.setValue(
                                            "persons.0.annualRetirementExpensesStage3",
                                            Number(e.target.value)
                                          );
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {calculateForSpouse && (
                                <FormField
                                  control={form.control}
                                  name="persons.1.annualRetirementExpensesStage3"
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormLabel>
                                        Spouse annual expenses from age 76 to 85:
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="Enter amount"
                                          {...field}
                                          onBlur={(e) => {
                                            field.onBlur();
                                            form.setValue(
                                              "persons.1.annualRetirementExpensesStage3",
                                              Number(e.target.value)
                                            );
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                            <div className="flex items-center space-x-4">
                              <FormField
                                control={form.control}
                                name="persons.0.healthCareExpensesStage3"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>
                                      Annual health care expenses from ages 76
                                      to 85:
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="Enter amount"
                                        {...field}
                                        onBlur={(e) => {
                                          field.onBlur();
                                          form.setValue(
                                            "persons.0.healthCareExpensesStage3",
                                            Number(e.target.value)
                                          );
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {calculateForSpouse && (
                                <FormField
                                  control={form.control}
                                  name="persons.1.healthCareExpensesStage3"
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormLabel>
                                        Spouse annual health care expenses from
                                        ages 76 to 85:
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="Enter amount"
                                          {...field}
                                          onBlur={(e) => {
                                            field.onBlur();
                                            form.setValue(
                                              "persons.1.healthCareExpensesStage3",
                                              Number(e.target.value)
                                            );
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
                        </CardContent>
                      </Card>

                      {/* Retirement Stage 3 */}
                      <Card className="border-orange-500">
                        <CardHeader>
                          <CardTitle className="text-orange-500 flex items-center">
                            Retirement Stage 3: Ages 86 to Life Expectancy
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="ml-2 cursor-pointer">
                                    <PlusIcon className="h-4 w-4" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Keep in mind that maintaining your health
                                    will likely take full priority during this
                                    period, so expect to allocate just a small
                                    amount towards non-discretionary expenses
                                    while most of it will go towards health
                                    care. <br />
                                    Experts estimate annual health costs ranging
                                    from $60,000 to $100,000 for single
                                    Canadians.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                              <FormField
                                control={form.control}
                                name="persons.0.annualRetirementExpensesStage4"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>
                                      Annual expenses from age 86 to life
                                      expectancy:
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="Enter amount"
                                        {...field}
                                        onBlur={(e) => {
                                          field.onBlur();
                                          form.setValue(
                                            "persons.0.annualRetirementExpensesStage4",
                                            Number(e.target.value)
                                          );
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {calculateForSpouse && (
                                <FormField
                                  control={form.control}
                                  name="persons.1.annualRetirementExpensesStage4"
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormLabel>
                                        Spouse annual expenses from age 86 to
                                        life expectancy:
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="Enter amount"
                                          {...field}
                                          onBlur={(e) => {
                                            field.onBlur();
                                            form.setValue(
                                              "persons.1.annualRetirementExpensesStage4",
                                              Number(e.target.value)
                                            );
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                            <div className="flex items-center space-x-4">
                              <FormField
                                control={form.control}
                                name="persons.0.healthCareExpensesStage4"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>
                                      Annual health care expenses from age 86 to
                                      life expectancy:
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="Enter amount"
                                        {...field}
                                        onBlur={(e) => {
                                          field.onBlur();
                                          form.setValue(
                                            "persons.0.healthCareExpensesStage4",
                                            Number(e.target.value)
                                          );
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {calculateForSpouse && (
                                <FormField
                                  control={form.control}
                                  name="persons.1.healthCareExpensesStage4"
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormLabel>
                                        Spouse annual health care expenses from
                                        age 86 to life expectancy:
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="Enter amount"
                                          {...field}
                                          onBlur={(e) => {
                                            field.onBlur();
                                            form.setValue(
                                              "persons.1.healthCareExpensesStage4",
                                              Number(e.target.value)
                                            );
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
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* One-Off Expenses */}
            <Card className="border-orange-500">
              <CardHeader>
                <CardTitle className="text-orange-500 flex items-center">
                  One‐off Expenses
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="ml-2 cursor-pointer">
                          <PlusIcon className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Enter any one-off items you anticipate in the future.
                          One-off expenses could include travel and vacations,
                          any big-ticket items, gifting, and helping children
                          with downpayments or weddings. Note: If you’re a
                          Surplus member, you can access the comprehensive
                          expenses worksheet to help you.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
                <CardDescription>
                  Enter any anticipated one-off expenses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {form.watch("oneOffExpenses").map((expense, index) => (
                    <div key={expense.id} className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <FormField
                          control={form.control}
                          name={`oneOffExpenses.${index}.amount`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>
                                One-off expense amount:
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter amount"
                                  {...field}
                                  onBlur={(e) => {
                                    field.onBlur();
                                    form.setValue(
                                      `oneOffExpenses.${index}.amount`,
                                      Number(e.target.value)
                                    );
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {calculateForSpouse && (
                          <FormField
                            control={form.control}
                            name={`oneOffExpenses.${index}.personType`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Person:</FormLabel>
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
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <FormField
                          control={form.control}
                          name={`oneOffExpenses.${index}.year`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>
                                When will this one-off expense occur?
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Year"
                                  {...field}
                                  onBlur={(e) => {
                                    field.onBlur();
                                    form.setValue(
                                      `oneOffExpenses.${index}.year`,
                                      Number(e.target.value)
                                    );
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
                    onClick={handleAddOneOffExpense}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" /> Add One-Off Expense
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Charitable Donations */}
            <Card className="border-orange-500">
              <CardHeader>
                <CardTitle className="text-orange-500 flex items-center">
                  Charitable Donations
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="ml-2 cursor-pointer">
                          <PlusIcon className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Use this section if you will make a one-time donation
                          or any annual donations in the future. We will record
                          this as a use of funds and will calculate the income
                          tax reduction from any donations you make.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
                <CardDescription>
                  Enter any planned charitable donations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {form.watch("charitableDonations").map((donation, index) => (
                    <div key={donation.id} className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <FormField
                          control={form.control}
                          name={`charitableDonations.${index}.amount`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Annual donations:</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter amount"
                                  {...field}
                                  onBlur={(e) => {
                                    field.onBlur();
                                    form.setValue(
                                      `charitableDonations.${index}.amount`,
                                      Number(e.target.value)
                                    );
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {calculateForSpouse && (
                          <FormField
                            control={form.control}
                            name={`charitableDonations.${index}.personType`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Person:</FormLabel>
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
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <FormField
                          control={form.control}
                          name={`charitableDonations.${index}.startDate`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Start Year:</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Start Year"
                                  {...field}
                                  onBlur={(e) => {
                                    field.onBlur();
                                    form.setValue(
                                      `charitableDonations.${index}.startDate`,
                                      Number(e.target.value)
                                    );
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`charitableDonations.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>End Year:</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="End Year"
                                  {...field}
                                  onBlur={(e) => {
                                    field.onBlur();
                                    form.setValue(
                                      `charitableDonations.${index}.endDate`,
                                      Number(e.target.value)
                                    );
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
                    onClick={handleAddCharitableDonation}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" /> Add Charitable Donation
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Desired Estate */}
            <Card className="border-green-500">
              <CardHeader>
                <CardTitle className="text-green-500 flex items-center">
                  Desired Estate (to be left to heirs)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="ml-2 cursor-pointer">
                          <PlusIcon className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Please state your desired estate amount (if any) you’d
                          like to leave behind to your family, heirs, and
                          charities at your life expectancy age. Stating this
                          amount will help determine whether you have a surplus
                          by excluding the amount from the projections in your
                          retirement years. The amount is then added back into
                          your net estate at life expectancy. Note: Keep in mind
                          that if you have included a life insurance policy as
                          part of your calculations, the death benefit of the
                          policy will also be added to your total net estate at
                          life expectancy. <br />
                          If you have included a spouse as part of your
                          calculations, please use the desired estate amount as
                          a combined total for both of you.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
                <CardDescription>
                  How much would you like to leave behind?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="desiredEstateValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Desired estate amount:
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="ml-2 cursor-pointer">
                                  <PlusIcon className="h-4 w-4" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  There are 3 possible answers to consider:
                                  <br />
                                  <br />
                                  1. The minimum - You know your heirs the best,
                                  so you should decide on the minimum amount you
                                  consider to be an appropriate inheritance. If
                                  you are conservative in your assumptions,
                                  i.e., planning to live to age 100, planning
                                  for higher than expected living expenses, and
                                  lower than expected revenues, then the estate
                                  will probably be higher than the minimum
                                  amount considered to be appropriate. But by
                                  entering the minimum acceptable amount it is
                                  possible to determine if you have a surplus –
                                  even if you spend more than expected and live
                                  to age 100.
                                  <br />
                                  <br />
                                  2. Whatever is left over - If you are not
                                  concerned about leaving an estate then you
                                  should enter a nominal amount to cover funeral
                                  and estate costs. By entering this amount you
                                  will be able to determine if you currently
                                  have a surplus that could be used for a better
                                  lifestyle, to help heirs now, or to support
                                  some cause that is important to you.
                                  <br />
                                  <br />
                                  3. Leaving as much as possible it will not be
                                  possible to calculate a ‘surplus’ because all
                                  of your capital is necessary to achieve the
                                  ‘as much as possible’ goal. We suggest
                                  spending less and purchasing whole life
                                  insurance to achieve the ‘as much as possible’
                                  goal. The calculator will still be useful in
                                  that it will show you how large the estate is
                                  likely to be based on current spending and how
                                  much larger it could be if you reduce
                                  spending.
                                  <br />
                                  <br />
                                  Note: If you’re a Surplus member, you can
                                  access the desired estate worksheet to help
                                  you calculate this.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            {...field}
                            onBlur={(e) => {
                              field.onBlur();
                              form.setValue(
                                "desiredEstateValue",
                                Number(e.target.value)
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ExpensesCard;