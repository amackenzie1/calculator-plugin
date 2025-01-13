"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import React from "react";
import { CalculatorSchema } from "../Schema";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AssetsCardProps {
  form: UseFormReturn<z.infer<typeof CalculatorSchema>>;
}

const AssetsCard = ({ form }: AssetsCardProps) => {
  const calculateForSpouse = form.watch("calculateForSpouse");
  const primaryResidenceSell = form.watch("primaryResidenceSell");

  const handleAddRegisteredInvestment = (personType: "self" | "spouse") => {
    const currentPersons = form.getValues("persons");
    const updatedPersons = currentPersons.map((person) => {
      if (person.personType === personType) {
        return {
          ...person,
          registeredInvestments: [
            ...(person.registeredInvestments || []),
            {
              id: Date.now(),
              accountType: undefined,
              currentValue: undefined,
            },
          ],
        };
      }
      return person;
    });
    form.setValue("persons", updatedPersons);
  };

  const handleRemoveRegisteredInvestment = (
    personType: "self" | "spouse",
    id: number
  ) => {
    const currentPersons = form.getValues("persons");
    const updatedPersons = currentPersons.map((person) => {
      if (person.personType === personType) {
        return {
          ...person,
          registeredInvestments: person.registeredInvestments?.filter(
            (investment) => investment.id !== id
          ),
        };
      }
      return person;
    });
    form.setValue("persons", updatedPersons);
  };

  const registeredInvestmentOptions = [
    { value: "TFSA", label: "TFSA" },
    { value: "RRSP", label: "RRSP" },
    { value: "RRIF", label: "RRIF" },
    { value: "LIRA", label: "LIRA" },
    { value: "LIF", label: "LIF" },
  ];

  return (
    <Card className="mx-auto w-full max-w-3xl border-green-500">
      <CardHeader className="text-center">
        <CardTitle className="text-green-500 underline text-center text-3xl">Assets</CardTitle>
        <CardDescription>Provide details about your assets.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <tbody>
                  {form.getValues("persons").map((person, personIndex) => (
                    <React.Fragment key={personIndex}>
                      <tr className="bg-white dark:bg-gray-800">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium"
                          colSpan={calculateForSpouse ? 3 : 2}
                        >
                          Registered Investments
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="ml-1 text-gray-500 dark:text-gray-400 cursor-pointer">
                                  (?)
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="custom-tooltip-content">
                                <p>
                                  Tax-Free Savings Account(TFSA): When money is
                                  withdrawn from your TSFA it is not taxable.
                                  <br /> Registered Retirement Savings Plan
                                  (RRSP): When money is withdrawn from your RRSP
                                  account it is taxable. At age 71 your RRSP
                                  account, if you have one, will automatically
                                  convert into a RRIF account. <br /> Registered
                                  Retirement Income Fund (RRIF): At age 71 RRSPs
                                  must be converted to a RRIF. We will calculate
                                  the withdrawal amount for your income each
                                  year. <br />
                                  Locked-in Retirement Account (LIRA): If you
                                  have contributed to a Defined Contribution
                                  Pension Plan you may have a LIRA. At age 71 we
                                  will automatically convert your LIRA account
                                  into a LIF account. <br /> Life Income Fund
                                  (LIF): Use this if you have a LIRA account
                                  that has been converted to a LIF (Life Income
                                  Fund). We will calculate the withdrawal amount
                                  for your income each year. <br />
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </th>
                      </tr>
                      {person.registeredInvestments?.map(
                        (investment, index) => (
                          <React.Fragment key={investment.id}>
                            <tr className="bg-gray-100 dark:bg-gray-900">
                              <td className="px-6 py-4" rowSpan={2}>
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-medium">
                                    Investment {index + 1}
                                  </h4>
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
                              </td>
                              <td className="px-6 py-4">
                                <FormField
                                  control={form.control}
                                  name={`persons.${personIndex}.registeredInvestments.${index}.accountType`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <FormLabel
                                              htmlFor={`persons.${personIndex}.registeredInvestments.${index}.accountType`}
                                              className="text-gray-500 dark:text-gray-400 cursor-pointer"
                                            >
                                              Please select any account(s) you
                                              have?
                                              <span className="ml-1 text-gray-500 dark:text-gray-400">
                                                (?)
                                              </span>
                                            </FormLabel>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>
                                              Select the type of registered
                                              investment account.
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <FormControl>
                                        <Select
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                        >
                                          <SelectTrigger
                                            id={`persons.${personIndex}.registeredInvestments.${index}.accountType`}
                                          >
                                            <SelectValue placeholder="Select account type" />
                                          </SelectTrigger>
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
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </td>
                              {calculateForSpouse && (
                                <td className="px-6 py-4"></td>
                              )}
                            </tr>
                            <tr className="bg-white dark:bg-gray-800">
                              <td className="px-6 py-4">
                                <FormField
                                  control={form.control}
                                  name={`persons.${personIndex}.registeredInvestments.${index}.currentValue`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <FormLabel
                                              htmlFor={`persons.${personIndex}.registeredInvestments.${index}.currentValue`}
                                              className="text-gray-500 dark:text-gray-400 cursor-pointer"
                                            >
                                              What is the current value in this
                                              account? (CAD)
                                              <span className="ml-1 text-gray-500 dark:text-gray-400">
                                                (?)
                                              </span>
                                            </FormLabel>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>
                                              Enter the current value of the
                                              registered investment account.
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          id={`persons.${personIndex}.registeredInvestments.${index}.currentValue`}
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
                            </tr>
                          </React.Fragment>
                        )
                      )}
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="px-6 py-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              handleAddRegisteredInvestment(person.personType)
                            }
                          >
                            Add Registered Investment Account
                          </Button>
                        </td>
                        <td className="px-6 py-4"></td>
                        {calculateForSpouse && <td className="px-6 py-4"></td>}
                      </tr>
                    </React.Fragment>
                  ))}
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium"
                      colSpan={calculateForSpouse ? 3 : 2}
                    >
                      Non-Registered Investments
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 text-gray-500 dark:text-gray-400 cursor-pointer">
                              (?)
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="custom-tooltip-content">
                            <p>
                              This represents all assets and investments
                              excluding your primary residence (on which there
                              is no tax on the capital gain) and registered
                              assets such as RRSPs, RRIFs, TSFAs etc. Use this
                              section if you have a cottage, a rental property,
                              non-registered investment account(s),
                              non-registered bank account(s), the value of a
                              holding company, an art collection or any other
                              valuable asset.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </th>
                  </tr>
                  {form.getValues("persons").map((person, personIndex) => (
                    <React.Fragment key={personIndex}>
                      <tr className="bg-white dark:bg-gray-800">
                        <th scope="row" className="px-6 py-4 font-medium"></th>
                        <td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name={`persons.${personIndex}.nonRegisteredInvestmentValue`}
                            render={({ field }) => (
                              <FormItem>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <FormLabel
                                        htmlFor={`persons.${personIndex}.nonRegisteredInvestmentValue`}
                                        className="text-gray-500 dark:text-gray-400 cursor-pointer"
                                      >
                                        What is the current value (CAD)?
                                        <span className="ml-1 text-gray-500 dark:text-gray-400">
                                          (?)
                                        </span>
                                      </FormLabel>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        Enter the total current market value of
                                        all or your non-registered investments.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id={`persons.${personIndex}.nonRegisteredInvestmentValue`}
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
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <th scope="row" className="px-6 py-4 font-medium"></th>
                        <td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name={`persons.${personIndex}.nonRegisteredInvestmentOpeningYear`}
                            render={({ field }) => (
                              <FormItem>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <FormLabel
                                        htmlFor={`persons.${personIndex}.nonRegisteredInvestmentOpeningYear`}
                                        className="text-gray-500 dark:text-gray-400 cursor-pointer"
                                      >
                                        What was the opening year?
                                        <span className="ml-1 text-gray-500 dark:text-gray-400">
                                          (?)
                                        </span>
                                      </FormLabel>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        Enter the year you acquired the
                                        non-registered investment.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id={`persons.${personIndex}.nonRegisteredInvestmentOpeningYear`}
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
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <th scope="row" className="px-6 py-4 font-medium"></th>
                        <td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name={`persons.${personIndex}.nonRegisteredInvestmentBookValue`}
                            render={({ field }) => (
                              <FormItem>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <FormLabel
                                        htmlFor={`persons.${personIndex}.nonRegisteredInvestmentBookValue`}
                                        className="text-gray-500 dark:text-gray-400 cursor-pointer"
                                      >
                                        What is the book value (CAD)?
                                        <span className="ml-1 text-gray-500 dark:text-gray-400">
                                          (?)
                                        </span>
                                      </FormLabel>
                                    </TooltipTrigger>
                                    <TooltipContent className="custom-tooltip-content">
                                      <p>
                                        Enter the total cost or book value of
                                        all of your non-registered investments
                                        listed above. The difference between the
                                        total value of your non-registered
                                        investments and the total cost of your
                                        non-registered investments represents a
                                        capital gain. 50 % of the capital gain
                                        will be taxable when the asset is sold.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id={`persons.${personIndex}.nonRegisteredInvestmentBookValue`}
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
                      </tr>
                    </React.Fragment>
                  ))}
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium"
                      colSpan={calculateForSpouse ? 3 : 2}
                    >
                      Life Insurance
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 text-gray-500 dark:text-gray-400 cursor-pointer">
                              (?)
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="custom-tooltip-content">
                            <p>
                              Use this section if you have universal or whole
                              life insurance and indicate the face value of the
                              policy that your spouse or immediate family will
                              receive at death. This amount will form part of
                              your surplus capital. If you have universal or
                              whole life insurance and someone outside of your
                              immediate family is the beneficiary, please don’t
                              enter any life insurance value here for this
                              section because we don’t want to include the value
                              and inflate your total net estate projection.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </th>
                  </tr>
                  {form.getValues("persons").map((person, personIndex) => (
                    <React.Fragment key={personIndex}>
                      <tr className="bg-white dark:bg-gray-800">
                        <th scope="row" className="px-6 py-4 font-medium"></th>
                        <td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name={`persons.${personIndex}.lifeInsuranceDeathBenefit`}
                            render={({ field }) => (
                              <FormItem>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <FormLabel
                                        htmlFor={`persons.${personIndex}.lifeInsuranceDeathBenefit`}
                                        className="text-gray-500 dark:text-gray-400 cursor-pointer"
                                      >
                                        What will be the death benefit left to
                                        your estate?
                                        <span className="ml-1 text-gray-500 dark:text-gray-400">
                                          (?)
                                        </span>
                                      </FormLabel>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        Enter the amount of life insurance death
                                        benefit you expect to receive.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id={`persons.${personIndex}.lifeInsuranceDeathBenefit`}
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
                      </tr>
                    </React.Fragment>
                  ))}
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium"
                      colSpan={calculateForSpouse ? 3 : 2}
                    >
                      Primary Residence
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 text-gray-500 dark:text-gray-400 cursor-pointer">
                              (?)
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              We will assume your home increases at your chosen
                              inflation rate and when the home is eventually
                              sold the gain is considered to be a tax-free
                              capital gain.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </th>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <th scope="row" className="px-6 py-4 font-medium"></th>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="primaryResidenceValue"
                        render={({ field }) => (
                          <FormItem>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FormLabel
                                    htmlFor="primaryResidenceValue"
                                    className="text-gray-500 dark:text-gray-400 cursor-pointer"
                                  >
                                    What is the current market value of your
                                    home?
                                    <span className="ml-1 text-gray-500 dark:text-gray-400">
                                      (?)
                                    </span>
                                  </FormLabel>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Enter the current market value of your
                                    primary residence.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <FormControl>
                              <Input
                                type="number"
                                id="primaryResidenceValue"
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
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <th scope="row" className="px-6 py-4 font-medium"></th>
                    <td className="px-6 py-4 flex items-center">
                      <FormField
                        control={form.control}
                        name="primaryResidenceSell"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <FormLabel className="text-gray-500 dark:text-gray-400 cursor-pointer">
                                      Do you plan to sell your home in the
                                      future?
                                      <span className="ml-1 text-gray-500 dark:text-gray-400">
                                        (?)
                                      </span>
                                    </FormLabel>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Indicate whether you plan to sell your
                                      primary residence in the future.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-label="Do you plan to sell your home in the future?"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>
                  </tr>
                  {primaryResidenceSell && (
                    <tr className="bg-white dark:bg-gray-800">
                      <th scope="row" className="px-6 py-4 font-medium"></th>
                      <td className="px-6 py-4">
                        <FormField
                          control={form.control}
                          name="primaryResidenceSellYear"
                          render={({ field }) => (
                            <FormItem>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <FormLabel
                                      htmlFor="primaryResidenceSellYear"
                                      className="text-gray-500 dark:text-gray-400 cursor-pointer"
                                    >
                                      When would you like to sell?
                                      <span className="ml-1 text-gray-500 dark:text-gray-400">
                                        (?)
                                      </span>
                                    </FormLabel>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Enter the year when you plan to sell your
                                      primary residence.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="primaryResidenceSellYear"
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
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AssetsCard;
