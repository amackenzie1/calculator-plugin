"use client";

import { useState, useEffect } from "react";
import GeneralInformationCard from "./Form-Sections/GeneralInformation";
import IncomeCard from "./Form-Sections/Income";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import CalculatorSchema from "./Schema";

const Calculator = () => {
  const form = useForm<z.infer<typeof CalculatorSchema>>({
    resolver: zodResolver(CalculatorSchema),
    defaultValues: {
      calculateForSpouse: false, // Only this is needed as default value
    },
  });

  // Load state from local storage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem("calculatorState");
    if (storedData) {
      const parsedData = JSON.parse(storedData);

      // Convert date strings to Date objects
      if (parsedData.birthDateSelf) {
        parsedData.birthDateSelf = new Date(parsedData.birthDateSelf);
      }
      if (parsedData.birthDateSpouse) {
        parsedData.birthDateSpouse = new Date(parsedData.birthDateSpouse);
      }
      if (parsedData.incomeDateRangeSelf) {
        parsedData.incomeDateRangeSelf.from = new Date(
          parsedData.incomeDateRangeSelf.from
        );
        parsedData.incomeDateRangeSelf.to = new Date(
          parsedData.incomeDateRangeSelf.to
        );
      }
      if (parsedData.incomeDateRangeSpouse) {
        parsedData.incomeDateRangeSpouse.from = new Date(
          parsedData.incomeDateRangeSpouse.from
        );
        parsedData.incomeDateRangeSpouse.to = new Date(
          parsedData.incomeDateRangeSpouse.to
        );
      }
      if (parsedData.otherIncomes) {
        parsedData.otherIncomes = parsedData.otherIncomes.map(
          (income: any) => ({
            ...income,
            startDate: income.startDate
              ? new Date(income.startDate)
              : undefined,
            endDate: income.endDate ? new Date(income.endDate) : undefined,
          })
        );
      }

      form.reset(parsedData); // Reset the form with data from local storage
    }
  }, []);

  // Save state to local storage whenever form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Convert Date objects to strings for local storage
      const valueToStore = {
        ...value,
        birthDateSelf: value.birthDateSelf
          ? format(value.birthDateSelf, "yyyy-MM-dd")
          : undefined,
        birthDateSpouse: value.birthDateSpouse
          ? format(value.birthDateSpouse, "yyyy-MM-dd")
          : undefined,
        incomeDateRangeSelf: value.incomeDateRangeSelf
          ? {
              from: value.incomeDateRangeSelf.from
                ? format(value.incomeDateRangeSelf.from, "yyyy-MM-dd")
                : undefined,
              to: value.incomeDateRangeSelf.to
                ? format(value.incomeDateRangeSelf.to, "yyyy-MM-dd")
                : undefined,
            }
          : undefined,
        incomeDateRangeSpouse: value.incomeDateRangeSpouse
          ? {
              from: value.incomeDateRangeSpouse.from
                ? format(value.incomeDateRangeSpouse.from, "yyyy-MM-dd")
                : undefined,
              to: value.incomeDateRangeSpouse.to
                ? format(value.incomeDateRangeSpouse.to, "yyyy-MM-dd")
                : undefined,
            }
          : undefined,
        otherIncomes: value.otherIncomes.map((income) => ({
          ...income,
          startDate: income.startDate
            ? format(income.startDate, "yyyy-MM-dd")
            : undefined,
          endDate: income.endDate
            ? format(income.endDate, "yyyy-MM-dd")
            : undefined,
        })),
      };

      localStorage.setItem("calculatorState", JSON.stringify(valueToStore));
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // --- Placeholder for future API call ---
  const onSubmit = (data: z.infer<typeof CalculatorSchema>) => {
    // In the future, this function will send data to the backend
    console.log("Data to be sent to backend:", data);

    // Backend Endpoint Strategy (Reasoning):
    // I'd recommend a single calculation endpoint for now (e.g., /api/calculate).
    // This endpoint can handle both cases (with and without a spouse) based on the `calculateForSpouse` flag.
    // Using a single endpoint simplifies the frontend logic and reduces the number of API routes to manage.
    // We can always add more specific endpoints later if needed for optimization or different calculation types.
  };

  return (
    <div className="p-6 space-y-8">
      {/* Pass the form object down to child components */}
      <GeneralInformationCard form={form} />
      <IncomeCard form={form} />
      <Button onClick={form.handleSubmit(onSubmit)}>Submit</Button>
    </div>
  );
};

export default Calculator;
