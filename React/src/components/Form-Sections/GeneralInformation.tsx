import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
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

  return (
    <Card className="mx-auto w-full max-w-3xl border-purple-500">
      <CardHeader>
        <CardTitle className="text-purple-500 underline">
          General Information
        </CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tell us a bit about yourself.
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
                      Calculate for spouse?
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
                      Date of Birth
                    </th>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="birthDateSelf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              htmlFor="birthDateSelf"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              Your Date of Birth
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
                    {form.watch("calculateForSpouse") && (
                      <td className="px-6 py-4">
                        <FormField
                          control={form.control}
                          name="birthDateSpouse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                htmlFor="birthDateSpouse"
                                className="text-gray-500 dark:text-gray-400"
                              >
                                Spouse's Date of Birth
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
                    )}
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <th scope="row" className="px-6 py-4 font-medium">
                      Life Expectancy Estimate
                    </th>
                    <td className="px-6 py-4">
                      <FormField
                        control={form.control}
                        name="lifeExpectancySelf"
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
                          name="lifeExpectancySpouse"
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
                      Province of Residence
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
                                  <SelectItem key={province} value={province}>
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GeneralInformationCard;
