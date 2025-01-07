"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect } from "react";
import { CalculatorSchema } from "../Schema";

interface GeneralInformationCardProps {
  form: UseFormReturn<z.infer<typeof CalculatorSchema>>;
}

const GeneralInformationCard = ({ form }: GeneralInformationCardProps) => {
  // --- Canadian Provinces ---
  const canadianProvinces = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Nova Scotia",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Northwest Territories",
    "Nunavut",
    "Yukon",
  ];

  const investorProfiles = [
    { label: "Risk Averse", value: "risk_averse", rate: 0.03 },
    { label: "Conservative", value: "conservative", rate: 0.04 },
    { label: "Moderate", value: "moderate", rate: 0.05 },
    { label: "Aggressive", value: "aggressive", rate: 0.06 },
    { label: "Speculative", value: "speculative", rate: 0.07 },
    { label: "Custom", value: "custom" },
  ];

  // Calculate investmentReturnRate
  useEffect(() => {
    const calculateInvestmentReturnRate = () => {
      const investorProfile = form.getValues("investorProfile");
      const specifyReturn = form.getValues("specifyReturn");

      if (investorProfile && investorProfile !== "custom") {
        const selectedProfile = investorProfiles.find(
          (profile) => profile.value === investorProfile
        );
        return selectedProfile ? selectedProfile.rate : 0;
      } else if (specifyReturn) {
        return 0;
      } else {
        return 0;
      }
    };

    const newInvestmentReturnRate = calculateInvestmentReturnRate();
    form.setValue("investmentReturnRate", newInvestmentReturnRate);
  }, [form.watch("investorProfile"), form.watch("specifyReturn")]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.calculateForSpouse) {
        if (!value.persons.some((p) => p.personType === "spouse")) {
          form.setValue("persons.1", {
            personType: "spouse",
            age: undefined,
            birthYear: undefined,
            lifeExpectancy: 100,
            primaryYearlyIncome: undefined,
            incomeDateRange: {
              from: undefined,
              to: undefined,
            },
            cppStartDate: undefined,
            cppAmount: undefined,
            oasStartDate: undefined,
            oasAmount: undefined,
            definedBenefitPensionStartDate: undefined,
            definedBenefitPensionAmount: undefined,
            definedBenefitPensionIndexedToInflation: undefined,
            registeredInvestments: [],
            nonRegisteredInvestmentValue: undefined,
            nonRegisteredInvestmentOpeningYear: undefined,
            nonRegisteredInvestmentBookValue: undefined,
            lifeInsuranceDeathBenefit: undefined,
            annualRetirementExpenses: undefined,
            healthCareExpenses: undefined,
            annualRetirementExpensesStage2: undefined,
            healthCareExpensesStage2: undefined,
            annualRetirementExpensesStage3: undefined,
            healthCareExpensesStage3: undefined,
          });
        }
      } else {
        form.setValue("persons", [form.getValues("persons")[0]]);
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch("calculateForSpouse")]);

  return (
    <TooltipProvider>
      <Card className="mx-auto w-full max-w-3xl border-purple-500">
        <CardHeader>
          <CardTitle className="text-purple-500 underline">
            General Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              {/* --- Onboarding Subsection --- */}
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">
                  Onboarding: General Information
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  To discover your Essential and Surplus Capital, let’s start
                  with some general questions.
                </p>
                <div className="relative overflow-x-auto mt-4">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <tbody>
                      <tr className="bg-white dark:bg-gray-800">
                        <th scope="row" className="px-6 py-4 font-medium">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                Calculate for spouse?{" "}
                                <span className="text-gray-400 cursor-pointer">
                                  (?)
                                </span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Select 'yes' if you want to include your spouse
                                in the calculations.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </th>
                        <td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name="calculateForSpouse"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    id="calculateForSpouse"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-label="Calculate for spouse"
                                  />
                                </FormControl>
                                <FormLabel
                                  htmlFor="calculateForSpouse"
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Yes
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="px-6 py-4"></td>
                      </tr>
                      <tr className="bg-gray-100 dark:bg-gray-900">
                        <th scope="row" className="px-6 py-4 font-medium">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                Birth Year{" "}
                                <span className="text-gray-400 cursor-pointer">
                                  (?)
                                </span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Enter the year you were born. We will use this
                                to calculate your age.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </th>
                        <td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name="persons[0].birthYear"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor="birthYearSelf"
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Your Birth Year
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id="birthYearSelf"
                                    placeholder="Enter your birth year"
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
                        {form.watch("calculateForSpouse") && (
                          <td className="px-6 py-4">
                            <FormField
                              control={form.control}
                              name="persons[1].birthYear"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor="birthYearSpouse"
                                    className="text-gray-500 dark:text-gray-400"
                                  >
                                    Spouse's Birth Year
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      id="birthYearSpouse"
                                      placeholder="Enter spouse's birth year"
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
                        <th scope="row" className="px-6 py-4 font-medium">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                Life Expectancy Estimate{" "}
                                <span className="text-gray-400 cursor-pointer">
                                  (?)
                                </span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Enter the age by which you will likely have
                                passed away. You can be conservative with your
                                estimate to start with and adjust it after if
                                necessary to assess its impact on your finances.
                                Most retirement calculators recommend age 91,
                                but we suggest entering age 100 at first to be
                                safe.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </th>
                        <td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name="persons[0].lifeExpectancy"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor="lifeExpectancySelf"
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Your Life Expectancy
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id="lifeExpectancySelf"
                                    placeholder="Enter your life expectancy"
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
                        {form.watch("calculateForSpouse") && (
                          <td className="px-6 py-4">
                            <FormField
                              control={form.control}
                              name="persons[1].lifeExpectancy"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor="lifeExpectancySpouse"
                                    className="text-gray-500 dark:text-gray-400"
                                  >
                                    Spouse's Life Expectancy
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      id="lifeExpectancySpouse"
                                      placeholder="Enter spouse's life expectancy"
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
                        <th scope="row" className="px-6 py-4 font-medium">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                Province of Residence{" "}
                                <span className="text-gray-400 cursor-pointer">
                                  (?)
                                </span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Select your province of residence.</p>
                            </TooltipContent>
                          </Tooltip>
                        </th>
                        <td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name="province"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor="province"
                                  className="text-gray-500 dark:text-gray-400"
                                >
                                  Select Province
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger id="province">
                                      <SelectValue placeholder="Select province" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {canadianProvinces.map((province) => (
                                      <SelectItem
                                        key={province}
                                        value={province}
                                      >
                                        {province}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        {form.watch("calculateForSpouse") && (
                          <td className="px-6 py-4"></td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* --- Investor Profile Subsection --- */}
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Investor Profile</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This determines the rate at which your wealth grows throughout
                  your life. This section assumes you and your spouse are the
                  same type of investor.
                </p>
                <div className="relative overflow-x-auto mt-4">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <tbody>
                      <tr className="bg-white dark:bg-gray-800">
                        <th scope="row" className="px-6 py-4 font-medium">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                What type of Investor are you?{" "}
                                <span className="text-gray-400 cursor-pointer">
                                  (?)
                                </span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Each investor profile selection is designated a
                                rate of return percentage to be applied to your
                                assets and investments. Choose the appropriate
                                option ranging from low-risk i.e., risk averse,
                                to high-risk i.e., speculative, that best fits
                                your investment outlook. Please note that the
                                investor profile type you select will also be
                                applied to your spouse if you have included them
                                in your calculations. Investor Profile Options:
                                Risk Averse 3%, Conservative 4%, Moderate 5%,
                                Aggressive 6%, Speculative 7%
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </th>
                        <td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name="investorProfile"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    if (value === "custom") {
                                      form.setValue("specifyReturn", true);
                                    } else {
                                      form.setValue("specifyReturn", false);
                                      const selectedProfile =
                                        investorProfiles.find(
                                          (profile) => profile.value === value
                                        );
                                      form.setValue(
                                        "investmentReturnRate",
                                        selectedProfile
                                          ? selectedProfile.rate
                                          : 0
                                      );
                                    }
                                  }}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger id="investorProfile">
                                      <SelectValue placeholder="Select investor profile" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {investorProfiles.map((profile) => (
                                      <SelectItem
                                        key={profile.value}
                                        value={profile.value}
                                      >
                                        {profile.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                      </tr>
                      <tr className="bg-gray-100 dark:bg-gray-900">
                        <th scope="row" className="px-6 py-4 font-medium">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                Inflation rate (%)
                                <span className="text-gray-400 cursor-pointer">
                                  (?)
                                </span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Enter the average rate of inflation that you
                                think will apply during the rest of your life.
                                This is the rate of inflation that will apply to
                                all your assets and your cost of living. The
                                historical rate of inflation in Canada and the
                                USA has been 2-3%.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </th>
                        <td className="px-6 py-4">
                          <FormField
                            control={form.control}
                            name="inflationRate"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id="inflationRate"
                                    placeholder="Enter inflation rate (default 2.5%)"
                                    {...field}
                                    value={
                                      field.value === undefined
                                        ? ""
                                        : (field.value * 100).toFixed(2)
                                    }
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (value === "") {
                                        field.onChange(undefined);
                                      } else {
                                        const numericValue = parseFloat(value);
                                        if (!isNaN(numericValue)) {
                                          field.onChange(numericValue / 100);
                                        }
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                      </tr>
                      {form.watch("specifyReturn") && (
                        <>
                          <tr className="bg-white dark:bg-gray-800">
                            <th scope="row" className="px-6 py-4 font-medium">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    Income rate (%)
                                    <span className="text-gray-400 cursor-pointer">
                                      (?)
                                    </span>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    This is the average rate of interest income
                                    and/or dividend income that you expect to
                                    earn on your investments. Income earned on
                                    non-registered investments is taxed in the
                                    year it is earned regardless of whether or
                                    not you receive the income or allow it to
                                    accumulate.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </th>
                            <td className="px-6 py-4">
                              <FormField
                                control={form.control}
                                name="incomeReturnRate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        id="incomeReturnRate"
                                        placeholder="Enter income rate"
                                        {...field}
                                        value={""}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (value === "") {
                                            field.onChange(0);
                                          } else {
                                            const numericValue =
                                              parseFloat(value);
                                            if (!isNaN(numericValue)) {
                                              field.onChange(
                                                numericValue / 100
                                              );
                                            }
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </td>
                          </tr>
                          <tr className="bg-gray-100 dark:bg-gray-900">
                            <th scope="row" className="px-6 py-4 font-medium">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    Growth rate (%)
                                    <span className="text-gray-400 cursor-pointer">
                                      (?)
                                    </span>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    This is the capital gain appreciation you
                                    expect from investments. Total income from
                                    investments may consist of interest and
                                    dividends and capital gains. Enter only the
                                    capital gains you expect. (In Canada only
                                    50% of Capital gains are taxable and the tax
                                    is paid when the asset is sold). We will
                                    calculate investment income based on the
                                    growth rate and the size of the investment
                                    portfolio. For example, if you assumed a
                                    growth rate of 3% and an income/dividend
                                    rate of 2%, and you had a $1,000,000 non-
                                    registered investment portfolio, we will
                                    calculate and show that your investment
                                    income for the year is $50,000.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </th>
                            <td className="px-6 py-4">
                              <FormField
                                control={form.control}
                                name="growthReturnRate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        id="growthReturnRate"
                                        placeholder="Enter growth rate"
                                        {...field}
                                        value={""}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (value === "") {
                                            field.onChange(0);
                                          } else {
                                            const numericValue =
                                              parseFloat(value);
                                            if (!isNaN(numericValue)) {
                                              field.onChange(
                                                numericValue / 100
                                              );
                                            }
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default GeneralInformationCard;
