"use client";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CalculatorSchema } from "../Schema";

// Receive the form object as a prop
interface IncomeCardProps {
  form: UseFormReturn<z.infer<typeof CalculatorSchema>>;
  calculateForSpouse: boolean;
  birthYearSelf: number | undefined;
  birthYearSpouse: number | undefined;
  yearFromBirthYearAndTargetAge: (
    birthYear: number,
    targetAge: number
  ) => number;
}

const IncomeCard = ({
  form,
  calculateForSpouse,
  birthYearSelf,
  birthYearSpouse,
  yearFromBirthYearAndTargetAge,
}: IncomeCardProps) => {
  // --- Helper Functions ---

  const handleAddOtherIncome = (personType: "self" | "spouse") => {
    const currentOtherIncomes = form.getValues("otherIncomes") || [];
    const newOtherIncome = {
      id: Date.now(),
      personType: personType,
      description: "",
      amount: undefined,
      Year: undefined,
    };

    form.setValue("otherIncomes", [...currentOtherIncomes, newOtherIncome]);
  };

  const handleRemoveOtherIncome = (id: number) => {
    const updatedOtherIncomes = form
      .getValues("otherIncomes")
      .filter((income) => income.id !== id);
    form.setValue("otherIncomes", updatedOtherIncomes);
  };

  const handlePrimaryIncomeAgeBlur = (personType: "self" | "spouse") => {
    const startAge = form.getValues(
      `persons.${personType === "spouse" ? 1 : 0}.incomeStartAge`
    );
    const endAge = form.getValues(
      `persons.${personType === "spouse" ? 1 : 0}.incomeEndAge`
    );
    const birthYear = personType === "self" ? birthYearSelf : birthYearSpouse;

    if (startAge && birthYear) {
      const startYear = yearFromBirthYearAndTargetAge(birthYear, startAge);
      form.setValue(
        `persons.${personType === "spouse" ? 1 : 0}.incomeYearStart`,
        startYear
      );
    }

    if (endAge && birthYear) {
      const endYear = yearFromBirthYearAndTargetAge(birthYear, endAge);
      form.setValue(
        `persons.${personType === "spouse" ? 1 : 0}.incomeYearEnd`,
        endYear
      );
    }
  };

  const handlePensionAgeBlur = (
    personType: "self" | "spouse",
    fieldPrefix: string
  ) => {
    const values = form.getValues();
    const age = values.persons?.[personType === "spouse" ? 1 : 0]?.[`${fieldPrefix}StartAge` as keyof typeof values.persons[0]];
    const birthYear = personType === "self" ? birthYearSelf : birthYearSpouse;

    if (age && birthYear) {
      const year = yearFromBirthYearAndTargetAge(birthYear, Number(age));
      form.setValue(
        `persons.${personType === "spouse" ? 1 : 0}.${fieldPrefix}StartYear` as any,
        year
      );
    }
  };

  return (
    <Card className="mx-auto w-full max-w-3xl border-blue-500">
      <CardHeader className="text-center">
        <CardTitle className="text-blue-500 text-3xl underline">
          Income
        </CardTitle>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Provide your income details below.
        </span>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <tbody>
                  <tr>
                    <td colSpan={calculateForSpouse ? 3 : 2}>
                    <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                          <h2 className="text-xl font-semibold mb-2 underline relative inline-block">
                       Primary Yearly Income 
                       <span className="ml-1 cursor-pointer text-gray-500 dark:text-gray-400 text-xs no-underline absolute top-0 right-[-20px]">
                              (?)
                            </span>
                      </h2>
                          </TooltipTrigger>
                          <TooltipContent className="custom-tooltip-content">
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
                      Annual income (before tax)
                    </th>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name={`persons.0.primaryYearlyIncome`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
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
                          name={`persons.1.primaryYearlyIncome`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
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
                    <th scope="row" className="px-6 py-4 font-medium">
                      Between what ages will you receive this income?
                    </th>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <FormField
                          control={form.control}
                          name={`persons.0.incomeStartAge`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="incomeStartAgeSelf"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                Start Age
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="incomeStartAgeSelf"
                                  placeholder="Age"
                                  {...field}
                                  onBlur={() =>
                                    handlePrimaryIncomeAgeBlur("self")
                                  }
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
                        <span className="mt-6">-</span>
                        <FormField
                          control={form.control}
                          name={`persons.0.incomeEndAge`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="incomeEndAgeSelf"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                End Age
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="incomeEndAgeSelf"
                                  placeholder="Age"
                                  {...field}
                                  onBlur={() =>
                                    handlePrimaryIncomeAgeBlur("self")
                                  }
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
                            name={`persons.1.incomeStartAge`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor="incomeStartAgeSpouse"
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Start Age
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id="incomeStartAgeSpouse"
                                    placeholder="Age"
                                    {...field}
                                    onBlur={() =>
                                      handlePrimaryIncomeAgeBlur("spouse")
                                    }
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
                          <span className="mt-6">-</span>
                          <FormField
                            control={form.control}
                            name={`persons.1.incomeEndAge`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor="incomeEndAgeSpouse"
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  End Age
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id="incomeEndAgeSpouse"
                                    placeholder="Age"
                                    {...field}
                                    onBlur={() =>
                                      handlePrimaryIncomeAgeBlur("spouse")
                                    }
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
                  <tr>
                    <td colSpan={calculateForSpouse ? 3 : 2}>
                    <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                          <h2 className="text-xl font-semibold mb-2 underline relative inline-block">
                       Pension Income 
                       <span className="ml-1 cursor-pointer text-gray-500 dark:text-gray-400 text-xs no-underline absolute top-0 right-[-20px]">
                              (?)
                            </span>
                      </h2>
                          </TooltipTrigger>
                          <TooltipContent className="custom-tooltip-content">
                            <p>
                            Include income from government pensions (CPP/QPP,
                              OAS) and defined benefit pensions.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>

                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      Canada Pension Plan (CPP) or Quebec Pension Plan (QPP)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 cursor-pointer text-gray-500 dark:text-gray-400">
                              (?)
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="custom-tooltip-content"> 
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
                    
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name={`persons.0.cppStartAge`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="cppStartAgeSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              At what age have you/will you receive these
                              payments?
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                id="cppStartAgeSelf"
                                placeholder="Enter age"
                                {...field}
                                onBlur={() =>
                                  handlePensionAgeBlur("self", "cpp")
                                }
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
                          name={`persons.1.cppStartAge`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="cppStartAgeSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                At what age have you/will you receive these
                                payments?
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="cppStartAgeSpouse"
                                  placeholder="Enter age"
                                  {...field}
                                  onBlur={() =>
                                    handlePensionAgeBlur("spouse", "cpp")
                                  }
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

                    </td>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name={`persons.0.cppAmount`}
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
                          name={`persons.1.cppAmount`}
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
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name={`persons.0.oasStartAge`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="oasStartAgeSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              At what age have you/will you receive these
                              payments?
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                id="oasStartAgeSelf"
                                placeholder="Enter age"
                                {...field}
                                onBlur={() =>
                                  handlePensionAgeBlur("self", "oas")
                                }
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
                          name={`persons.1.oasStartAge`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="oasStartAgeSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                At what age have you/will you receive these
                                payments?
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="oasStartAgeSpouse"
                                  placeholder="Enter age"
                                  {...field}
                                  onBlur={() =>
                                    handlePensionAgeBlur("spouse", "oas")
                                  }
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

                    </td>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name={`persons.0.oasAmount`}
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
                          name={`persons.1.oasAmount`}
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
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name={`persons.0.definedBenefitPensionStartAge`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="definedBenefitPensionStartAgeSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              At what age have you/will you receive these
                              payments?
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                id="definedBenefitPensionStartAgeSelf"
                                placeholder="Enter age"
                                {...field}
                                onBlur={() =>
                                  handlePensionAgeBlur(
                                    "self",
                                    "definedBenefitPension"
                                  )
                                }
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
                          name={`persons.1.definedBenefitPensionStartAge`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="definedBenefitPensionStartAgeSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                At what age have you/will you receive these
                                payments?
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="definedBenefitPensionStartAgeSpouse"
                                  placeholder="Enter age"
                                  {...field}
                                  onBlur={() =>
                                    handlePensionAgeBlur(
                                      "spouse",
                                      "definedBenefitPension"
                                    )
                                  }
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

                    </td>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name={`persons.0.definedBenefitPensionAmount`}
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
                          name={`persons.1.definedBenefitPensionAmount`}
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
                  <tr className="bg-white dark:bg-gray-800">
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">

                    </td>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name={`persons.0.definedBenefitPensionIndexedToInflation`}
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
                          name={`persons.1.definedBenefitPensionIndexedToInflation`}
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
                  <tr>
                    <td colSpan={calculateForSpouse ? 3 : 2}>
                    <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                          <h2 className="text-xl font-semibold mb-2 underline relative inline-block">
                       Other Incomes
                       <span className="ml-1 cursor-pointer text-gray-500 dark:text-gray-400 text-xs no-underline absolute top-0 right-[-20px]">
                              (?)
                            </span>
                      </h2>
                          </TooltipTrigger>
                          <TooltipContent className="custom-tooltip-content">
                            <p>
                            Include income from rental properties, lump-sum
                              payments, inheritances, annuities, or other
                              sources. Do not include investment income, pension
                              income, RRSP, or RRIF withdrawals.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                    </td>
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
                        {calculateForSpouse && (
                          <td className="px-6 py-4">
                            {/* Placeholder for alignment */}
                          </td>
                        )}
                      </tr>
                      <tr className="bg-gray-100 dark:bg-gray-900">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <FormField
                              control={form.control}
                              name={`otherIncomes.${index}.startYear`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor={`otherIncomes.${index}.startYear`}
                                    className="text-gray-500 dark:text-gray-400"
                                  >
                                    Start Year
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      id={`otherIncomes.${index}.startYear`}
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
                              name={`otherIncomes.${index}.endYear`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor={`otherIncomes.${index}.endYear`}
                                    className="text-gray-500 dark:text-gray-400"
                                  >
                                    End Year
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      id={`otherIncomes.${index}.endYear`}
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
                      <tr className="bg-white dark:bg-gray-800">
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
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    </td>
                    <td colSpan={calculateForSpouse ? 3 : 2}>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddOtherIncome("self")}
                        className="mr-4 ml-5 mt-6" 
                      >
                        Add Other Income (Self)
                      </Button>
                      {calculateForSpouse && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleAddOtherIncome("spouse")}
                          className="ml-10"
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
