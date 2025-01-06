import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { DatePicker } from "@/components/ui/date-picker";

// Receive the form object as a prop
interface AssetsCardProps {
  form: UseFormReturn<z.infer<typeof CalculatorSchema>>;
}

// No need to redefine CalculatorSchema here

const AssetsCard = ({ form }: AssetsCardProps) => {
  // --- Helper Functions ---

  const handleAddRegisteredInvestment = () => {
    form.setValue("registeredInvestments", [
      ...(form.getValues("registeredInvestments") || []),
      {
        id: Date.now(),
        accountType: undefined,
        currentValueSelf: undefined,
        currentValueSpouse: undefined,
      },
    ]);
  };

  const handleRemoveRegisteredInvestment = (id: number) => {
    form.setValue(
      "registeredInvestments",
      form
        .getValues("registeredInvestments")
        .filter((investment) => investment.id !== id)
    );
  };

  /**
   * Calculates the estimated book value of a non-registered investment.
   *
   * This function uses the compound interest formula (P/F, i, N) - Present Value of a Single Sum
   * to approximate the growth of the investment from the opening year to the current year.
   * It assumes a constant average annual growth rate based on the historical average return
   * of the S&P 500 index (approximately 10.5% before inflation adjustments).
   *
   * Note: This is a simplified approximation and should be replaced
   *
   * This calculation is intended for estimation purposes only and should not be
   * considered precise financial advice.
   *
   * @param {number} currentValue - The current market value of the investment.
   * @param {Date} openingYear - The year the investment account was opened.
   * @returns {number | undefined} The estimated book value, or undefined if inputs are invalid.
   */
  const calculateEstimatedBookValue = (
    currentValue: number | undefined,
    openingYear: Date | undefined
  ): number | undefined => {
    if (currentValue === undefined || openingYear === undefined) {
      return undefined;
    }

    const today = new Date();
    const numYears = today.getFullYear() - openingYear.getFullYear();

    if (numYears < 0) {
      return undefined; // Invalid: opening year is in the future
    }

    const growthRate = 0.105; // Approximate average annual return of S&P 500
    const estimatedBookValue =
      currentValue / Math.pow(1 + growthRate, numYears);

    return estimatedBookValue;
  };

  // --- Options for Registered Investment Select ---
  const registeredInvestmentOptions = [
    { value: "tfsa", label: "TFSA" },
    { value: "rrsp", label: "RRSP" },
    { value: "lif", label: "LIF" },
    { value: "lira", label: "LIRA" },
    { value: "rrif", label: "RRIF" },
  ];

  return (
    <Card className="mx-auto w-full max-w-3xl border-purple-500">
      <CardHeader>
        <CardTitle className="text-purple-500 underline">Assets</CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Provide details about your assets.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <tbody>
                  <tr className="bg-white dark:bg-gray-800">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium"
                      colSpan={form.watch("calculateForSpouse") ? 3 : 2}
                    >
                      Registered Investments
                    </th>
                  </tr>
                  {form
                    .watch("registeredInvestments")
                    .map((investment, index) => (
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
                              name={`registeredInvestments.${index}.accountType`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor={`registeredInvestments.${index}.accountType`}
                                    className="text-gray-500 dark:text-gray-400"
                                  >
                                    Please select any account(s) you have?
                                  </FormLabel>
                                  <FormControl>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <SelectTrigger
                                        id={`registeredInvestments.${index}.accountType`}
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
                          {form.watch("calculateForSpouse") && (
                            <td className="px-6 py-4"></td>
                          )}
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                          <td className="px-6 py-4">
                            <FormField
                              control={form.control}
                              name={`registeredInvestments.${index}.currentValueSelf`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor={`registeredInvestments.${index}.currentValueSelf`}
                                    className="text-gray-500 dark:text-gray-400"
                                  >
                                    What is the current value in this account?
                                    (CAD)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      id={`registeredInvestments.${index}.currentValueSelf`}
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
                          {form.watch("calculateForSpouse") && (
                            <td className="px-6 py-4">
                              <FormField
                                control={form.control}
                                name={`registeredInvestments.${index}.currentValueSpouse`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel
                                      htmlFor={`registeredInvestments.${index}.currentValueSpouse`}
                                      className="text-gray-500 dark:text-gray-400"
                                    >
                                      What is the current value in this account?
                                      (CAD)
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        id={`registeredInvestments.${index}.currentValueSpouse`}
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
                      </React.Fragment>
                    ))}
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddRegisteredInvestment}
                      >
                        Add Registered Investment Account
                      </Button>
                    </td>
                    <td className="px-6 py-4"></td>
                    {form.watch("calculateForSpouse") && (
                      <td className="px-6 py-4"></td>
                    )}
                  </tr>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium"
                      colSpan={form.watch("calculateForSpouse") ? 3 : 2}
                    >
                      Non-Registered Investments
                    </th>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <th scope="row" className="px-6 py-4 font-medium"></th>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="nonRegisteredInvestmentValueSelf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="nonRegisteredInvestmentValueSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              What is the current value (CAD)?
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                id="nonRegisteredInvestmentValueSelf"
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
                    {form.watch("calculateForSpouse") && (
                      <td className="px-6 py-4">
                        <FormField
                          control={form.control}
                          name="nonRegisteredInvestmentValueSpouse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="nonRegisteredInvestmentValueSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                What is the current value (CAD)?
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="nonRegisteredInvestmentValueSpouse"
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
                    <th scope="row" className="px-6 py-4 font-medium"></th>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="nonRegisteredInvestmentOpeningYearSelf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="nonRegisteredInvestmentOpeningYearSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              Which year was this account opened?
                            </FormLabel>
                            <FormControl>
                              <DatePicker
                                selected={field.value}
                                onSelect={(date) => field.onChange(date)}
                                showYearDropdown
                                dateFormat="yyyy"
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
                          name="nonRegisteredInvestmentOpeningYearSpouse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="nonRegisteredInvestmentOpeningYearSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                Which year was this account opened?
                              </FormLabel>
                              <FormControl>
                                <DatePicker
                                  selected={field.value}
                                  onSelect={(date) => field.onChange(date)}
                                  showYearDropdown
                                  dateFormat="yyyy"
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
                    <th scope="row" className="px-6 py-4 font-medium"></th>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="nonRegisteredInvestmentBookValueSelf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="nonRegisteredInvestmentBookValueSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              Estimated book value
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                id="nonRegisteredInvestmentBookValueSelf"
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
                      <FormField
                        control={form.control}
                        name="calculateNonRegisteredBookValueSelf"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                id="calculateNonRegisteredBookValueSelf"
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  if (checked) {
                                    const estimatedValue =
                                      calculateEstimatedBookValue(
                                        form.getValues(
                                          "nonRegisteredInvestmentValueSelf"
                                        ),
                                        form.getValues(
                                          "nonRegisteredInvestmentOpeningYearSelf"
                                        )
                                      );
                                    form.setValue(
                                      "nonRegisteredInvestmentBookValueSelf",
                                      estimatedValue
                                    );
                                  } else {
                                    form.setValue(
                                      "nonRegisteredInvestmentBookValueSelf",
                                      undefined
                                    );
                                  }
                                }}
                                aria-label="Calculate for me"
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor="calculateNonRegisteredBookValueSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              Calculate for me
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </td>
                    {form.watch("calculateForSpouse") && (
                      <td className="px-6 py-4">
                        <FormField
                          control={form.control}
                          name="nonRegisteredInvestmentBookValueSpouse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="nonRegisteredInvestmentBookValueSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                Estimated book value
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="nonRegisteredInvestmentBookValueSpouse"
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
                        <FormField
                          control={form.control}
                          name="calculateNonRegisteredBookValueSpouse"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  id="calculateNonRegisteredBookValueSpouse"
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked);
                                    if (checked) {
                                      const estimatedValue =
                                        calculateEstimatedBookValue(
                                          form.getValues(
                                            "nonRegisteredInvestmentValueSpouse"
                                          ),
                                          form.getValues(
                                            "nonRegisteredInvestmentOpeningYearSpouse"
                                          )
                                        );
                                      form.setValue(
                                        "nonRegisteredInvestmentBookValueSpouse",
                                        estimatedValue
                                      );
                                    } else {
                                      form.setValue(
                                        "nonRegisteredInvestmentBookValueSpouse",
                                        undefined
                                      );
                                    }
                                  }}
                                  aria-label="Calculate for me"
                                />
                              </FormControl>
                              <FormLabel
                                htmlFor="calculateNonRegisteredBookValueSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                Calculate for me
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </td>
                    )}
                  </tr>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium"
                      colSpan={form.watch("calculateForSpouse") ? 3 : 2}
                    >
                      Life Insurance
                    </th>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <th scope="row" className="px-6 py-4 font-medium"></th>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="lifeInsuranceDeathBenefitSelf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="lifeInsuranceDeathBenefitSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              What will be the death benefit left to your
                              estate?
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                id="lifeInsuranceDeathBenefitSelf"
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
                    {form.watch("calculateForSpouse") && (
                      <td className="px-6 py-4">
                        <FormField
                          control={form.control}
                          name="lifeInsuranceDeathBenefitSpouse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="lifeInsuranceDeathBenefitSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                What will be the death benefit left to your
                                estate?
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  id="lifeInsuranceDeathBenefitSpouse"
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
