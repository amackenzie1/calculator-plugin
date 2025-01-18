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
    <Card >
      <CardHeader >
        <CardTitle >
          Expenses
        </CardTitle>
        <span >
          Enter your estimated expenses below.
        </span>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form >
            <div >
              <table >
                <tbody>
                  {/* Retirement Expenses */}
                  <tr>
                    <td colSpan={calculateForSpouse ? 3 : 2}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <h2 >
                              Retirement Expenses
                              <span >
                                (?)
                              </span>
                            </h2>
                          </TooltipTrigger>
                          <TooltipContent >
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
                  <tr >
                    <th scope="row" >
                    </th>
                    <td >
                      <span >You</span>
                    </td>
                    {calculateForSpouse && (
                      <td >
                        <span >Spouse</span>
                      </td>
                    )}
                  </tr>
                  <tr >
                    <th scope="row" >
                      Annual Retirement Expenses
                    </th>
                    <td >
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
                      <td >
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
                  <tr >
                    <th scope="row" >
                      Annual Health Care Expenses
                    </th>
                    <td >
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
                      <td >
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
                  <tr >
                    <th scope="row" >
                      Specify Expenses Through Each Stage of Retirement?
                    </th>
                    <td >
                      <FormField
                        control={form.control}
                        name="expensesChangeForEachStage"
                        render={({ field }) => (
                          <FormItem >
                            <div >
                              <FormLabel >
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
        <Card >
          <CardHeader>
            <CardTitle >
              Retirement Stage 1: Current Age to 75
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div >
              <FormField
                control={form.control}
                name="persons.0.annualRetirementExpensesStage2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
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
                    <FormLabel >
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
        <Card >
          <CardHeader>
            <CardTitle >
              Retirement Stage 2: Ages 76 to 85
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div >
              <FormField
                control={form.control}
                name="persons.0.annualRetirementExpensesStage3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
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
                    <FormLabel >
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
        <Card >
          <CardHeader>
            <CardTitle >
              Retirement Stage 3: Ages 86 to Life Expectancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div >
              <FormField
                control={form.control}
                name="persons.0.annualRetirementExpensesStage4"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
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
                    <FormLabel >
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
                      <td >
                        <FormField
                          control={form.control}
                          name="expensesChangeForEachStageSpouse"
                          render={({ field }) => (
                            <FormItem >
                              <div >
                                <FormLabel >
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
        <Card >
          <CardHeader>
            <CardTitle >
              Retirement Stage 1: Current Age to 75
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div >
              <FormField
                control={form.control}
                name="persons.0.annualRetirementExpensesStage2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
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
                    <FormLabel >
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
        <Card >
          <CardHeader>
            <CardTitle >
              Retirement Stage 2: Ages 76 to 85
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div >
              <FormField
                control={form.control}
                name="persons.0.annualRetirementExpensesStage3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
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
                    <FormLabel >
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
        <Card >
          <CardHeader>
            <CardTitle >
              Retirement Stage 3: Ages 86 to Life Expectancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div >
              <FormField
                control={form.control}
                name="persons.0.annualRetirementExpensesStage4"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
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
                    <FormLabel >
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
                            <h2 >
                              One-Off Expenses
                              <span >
                                (?)
                              </span>
                            </h2>
                          </TooltipTrigger>
                          <TooltipContent >
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
                      <tr >
                        <td >
                          <FormField
                            control={form.control}
                            name={`oneOffExpenses.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor={`oneOffExpenses.${index}.description`}
                                  
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
                        <td >
                          <FormField
                            control={form.control}
                            name={`oneOffExpenses.${index}.amount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor={`oneOffExpenses.${index}.amount`}
                                  
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
                          <td >
                            <FormField
                              control={form.control}
                              name={`oneOffExpenses.${index}.personType`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel htmlFor={`oneOffExpenses.${index}.personType`}
                                    
                                  >
                                    Person
                                  </FormLabel>
                                  <FormControl>
                                    <select {...field}
                                      
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

<td >
                          <FormField
                            control={form.control}
                            name={`oneOffExpenses.${index}.year`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor={`oneOffExpenses.${index}.year`}
                                  
                                >
                                  Year
                                </FormLabel>
                                <FormControl>
                                  <Input type="number"
                                    id={`oneOffExpenses.${index}.year`}
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
                          <td >
                            {/* Placeholder for alignment */}
                          </td>
                        )}
                      </tr>
                 
                      <tr >
                        <td colSpan={calculateForSpouse ? 3 : 2}>
                          <div >
                            <Button 
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
                  <tr >
  <td ></td>
  <td colSpan={calculateForSpouse ? 3 : 2}>
    <div >
      <Button 
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
                            <h2 >
                              Charitable Donations
                              <span >
                                (?)
                              </span>
                            </h2>
                          </TooltipTrigger>
                          <TooltipContent >
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
                      <tr >
                        <td >
                          <FormField
                            control={form.control}
                            name={`charitableDonations.${index}.amount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor={`charitableDonations.${index}.amount`}
                                  
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
                        <td >
                          <FormField
                            control={form.control}
                            name={`charitableDonations.${index}.startYear`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor={`charitableDonations.${index}.startYear`}
                                  
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
                        <td >
                          <FormField
                            control={form.control}
                            name={`charitableDonations.${index}.endYear`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor={`charitableDonations.${index}.endYear`}
                                  
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
                          <td >
                            {/* Placeholder for alignment */}
                          </td>
                        )}

                      </tr>

                      <tr >
                        <td colSpan={calculateForSpouse ? 3 : 2}>
                          <div >
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
                  <tr >
  <td ></td>
  <td colSpan={calculateForSpouse ? 3 : 2}>
    <div >
      <Button 
        type="button"
        variant="outline"
        onClick={() => handleAddCharitableDonation("self")}
      >
        Add Charitable Donation (Self)
      </Button>
      {calculateForSpouse && (
        <Button 
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
                            <h2 >
                              Desired Estate (to be left to heirs)
                              <span >
                                (?)
                              </span>
                            </h2>
                          </TooltipTrigger>
                          <TooltipContent >
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
                  <tr >
                    <th scope="row" >
                      Desired Estate Amount
                    </th>
                    <td >
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
                      <td >
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