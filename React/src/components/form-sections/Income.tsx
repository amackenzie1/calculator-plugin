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
    <Card >
      <CardHeader >
        <CardTitle >
          Income
        </CardTitle>
        <span >
          Provide your income details below.
        </span>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form >
            <div >
              <table >
                <tbody>
                  <tr>
                    <td colSpan={calculateForSpouse ? 3 : 2}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <h2 >
                              Primary Yearly Income
                            </h2>
                          </TooltipTrigger>
                          <TooltipContent >
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
                  <tr >
                    <th scope="row" ></th>
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
                      Annual income (before tax)
                    </th>
                    <td >
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
                      <td >
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
                  <tr >
                    <th scope="row" >
                      Between what ages will you receive this income?
                    </th>
                    <td >
                      <div >
                        <FormField
                          control={form.control}
                          name={`persons.0.incomeStartAge`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor="incomeStartAgeSelf"
                                
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
                        <span >-</span>
                        <FormField
                          control={form.control}
                          name={`persons.0.incomeEndAge`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor="incomeEndAgeSelf"
                                
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
                      <td >
                        <div >
                          <FormField
                            control={form.control}
                            name={`persons.1.incomeStartAge`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="incomeStartAgeSpouse"
                                  
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
                          <span >-</span>
                          <FormField
                            control={form.control}
                            name={`persons.1.incomeEndAge`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="incomeEndAgeSpouse"
                                  
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
                            <h2 >
                              Pension Income
                              <span >
                                (?)
                              </span>
                            </h2>
                          </TooltipTrigger>
                          <TooltipContent >
                            <p>
                              Include income from government pensions (CPP/QPP,
                              OAS) and defined benefit pensions.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                  </tr>
                  <tr >
                    <td >
                      Canada Pension Plan (CPP) or Quebec Pension Plan (QPP)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span >
                              (?)
                            </span>
                          </TooltipTrigger>
                          <TooltipContent >
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

                    <td >
                      <FormField
                        control={form.control}
                        name={`persons.0.cppStartAge`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="cppStartAgeSelf"
                              
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
                      <td >
                        <FormField
                          control={form.control}
                          name={`persons.1.cppStartAge`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor="cppStartAgeSpouse"
                                
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

                  <tr >
                    <td ></td>
                    <td >
                      <FormField
                        control={form.control}
                        name={`persons.0.cppAmount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="cppAmountSelf"
                              
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
                      <td >
                        <FormField
                          control={form.control}
                          name={`persons.1.cppAmount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor="cppAmountSpouse"
                                
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

                  <tr >
                    <td >
                      Old Age Security (OAS)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span >
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
                    <td >
                      <FormField
                        control={form.control}
                        name={`persons.0.oasStartAge`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="oasStartAgeSelf"
                              
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
                      <td >
                        <FormField
                          control={form.control}
                          name={`persons.1.oasStartAge`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor="oasStartAgeSpouse"
                                
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
                  <tr >
                    <td ></td>
                    <td >
                      <FormField
                        control={form.control}
                        name={`persons.0.oasAmount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="oasAmountSelf"
                              
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
                      <td >
                        <FormField
                          control={form.control}
                          name={`persons.1.oasAmount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor="oasAmountSpouse"
                                
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

                  <tr >
                    <td >
                      Defined Benefit Pension
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span >
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
                    <td >
                      <FormField
                        control={form.control}
                        name={`persons.0.definedBenefitPensionStartAge`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="definedBenefitPensionStartAgeSelf"
                              
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
                      <td >
                        <FormField
                          control={form.control}
                          name={`persons.1.definedBenefitPensionStartAge`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor="definedBenefitPensionStartAgeSpouse"
                                
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
                  <tr >
                    <td ></td>
                    <td >
                      <FormField
                        control={form.control}
                        name={`persons.0.definedBenefitPensionAmount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="definedBenefitPensionAmountSelf"
                              
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
                      <td >
                        <FormField
                          control={form.control}
                          name={`persons.1.definedBenefitPensionAmount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor="definedBenefitPensionAmountSpouse"
                                
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
                  <tr >
                    <td ></td>
                    <td >
                      <FormField
                        control={form.control}
                        name={`persons.0.definedBenefitPensionIndexedToInflation`}
                        render={({ field }) => (
                          <FormItem >
                            <div >
                              <FormLabel >
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
                      <td >
                        <FormField
                          control={form.control}
                          name={`persons.1.definedBenefitPensionIndexedToInflation`}
                          render={({ field }) => (
                            <FormItem >
                              <div >
                                <FormLabel >
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
                            <h2 >
                              Other Incomes
                              <span >
                                (?)
                              </span>
                            </h2>
                          </TooltipTrigger>
                          <TooltipContent >
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
                      <tr >
                        <td >
                          <FormField
                            control={form.control}
                            name={`otherIncomes.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor={`otherIncomes.${index}.description`}
                                  
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
                        <td >
                          <FormField
                            control={form.control}
                            name={`otherIncomes.${index}.amount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor={`otherIncomes.${index}.amount`}
                                  
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
                          <td >
                            {/* Placeholder for alignment */}
                          </td>
                        )}
                      </tr>
                      <tr >
                        <td >
                          <div >
                            <FormField
                              control={form.control}
                              name={`otherIncomes.${index}.startYear`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel htmlFor={`otherIncomes.${index}.startYear`}
                                    
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
                                  <FormLabel htmlFor={`otherIncomes.${index}.endYear`}
                                    
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
                              onClick={() => handleRemoveOtherIncome(income.id)}
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
