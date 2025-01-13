"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetsCard from "./form-sections/Assets";
// import OnboardingCard from "./form-sections/GeneralInformation";
import ExpensesCard from "./form-sections/Expenses";
import OnboardingCard from "./form-sections/Onboarding";
import IncomeCard from "./form-sections/Income";
import { CalculatorSchema } from "./Schema";

// Helper Functions (in Calculator.tsx)
const currentYear = new Date().getFullYear();

// Calculates the year in which a person will reach a certain age, based on their birth year
const yearFromBirthYearAndTargetAge = (
  birthYear: number,
  targetAge: number
): number => {
  return birthYear + targetAge;
};

const Calculator = () => {
  const form = useForm<z.infer<typeof CalculatorSchema>>({
    resolver: zodResolver(CalculatorSchema),
    defaultValues: {
      calculateForSpouse: false,
      persons: [
        {
          personType: "self",
          birthYear: undefined,
          lifeExpectancy: 100,
          primaryYearlyIncome: undefined,
          incomeYearStart: undefined, // Only years in the state
          incomeYearEnd: undefined, // Only years in the state
          cppStartYear: undefined, // Only years in the state
          cppAmount: undefined,
          oasStartYear: undefined, // Only years in the state
          oasAmount: undefined,
          definedBenefitPensionStartYear: undefined, // Only years in the state
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
        },
      ],
      province: undefined,
      otherIncomes: [],
      charitableDonations: [],
      oneOffExpenses: [],
    },
  });

  const calculateForSpouse = form.watch("calculateForSpouse");

  // Load state from local storage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem("calculatorState");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      form.reset(parsedData);
    }
  }, []);

  // Save state to local storage whenever form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem("calculatorState", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // --- Placeholder for future API call ---
  const onSubmit = (data: z.infer<typeof CalculatorSchema>) => {
    const apiRequestBody = {
      // Shared variables:
      calculateForSpouse: data.calculateForSpouse,
      province: data.province,
      investorProfile: data.investorProfile,
      inflationRate: data.inflationRate,
      investmentReturnRate: data.investmentReturnRate,
      specifyReturn: data.specifyReturn,
      primaryResidenceValue: data.primaryResidenceValue,
      primaryResidenceSell: data.primaryResidenceSell,
      desiredEstateValue: data.desiredEstateValue,
      expensesChangeForEachStage: data.expensesChangeForEachStage,
      expensesChangeForEachStageSpouse: data.expensesChangeForEachStageSpouse,

      // Map the persons array:
      persons: data.persons.map((person) => ({
        personType: person.personType,
        birthYear: person.birthYear,
        lifeExpectancy: person.lifeExpectancy,
        primaryYearlyIncome: person.primaryYearlyIncome,
        incomeYearStart: person.incomeYearStart,
        incomeYearEnd: person.incomeYearEnd,
        cppStartYear: person.cppStartYear,
        cppAmount: person.cppAmount,
        oasStartYear: person.oasStartYear,
        oasAmount: person.oasAmount,
        definedBenefitPensionStartYear: person.definedBenefitPensionStartYear,
        definedBenefitPensionAmount: person.definedBenefitPensionAmount,
        definedBenefitPensionIndexedToInflation:
          person.definedBenefitPensionIndexedToInflation,
        registeredInvestments: person.registeredInvestments?.map(
          (investment) => ({
            accountType: investment.accountType,
            currentValue: investment.currentValue,
          })
        ),
        nonRegisteredInvestmentValue: person.nonRegisteredInvestmentValue,
        nonRegisteredInvestmentOpeningYear:
          person.nonRegisteredInvestmentOpeningYear,
        nonRegisteredInvestmentBookValue:
          person.nonRegisteredInvestmentBookValue,
        lifeInsuranceDeathBenefit: person.lifeInsuranceDeathBenefit,
        annualRetirementExpenses: person.annualRetirementExpenses,
        healthCareExpenses: person.healthCareExpenses,
        annualRetirementExpensesStage2: person.annualRetirementExpensesStage2,
        healthCareExpensesStage2: person.healthCareExpensesStage2,
        annualRetirementExpensesStage3: person.annualRetirementExpensesStage3,
        healthCareExpensesStage3: person.healthCareExpensesStage3,
      })),

      // Map otherIncomes, charitableDonations, oneOffExpenses (similar to persons mapping)
      otherIncomes: data.otherIncomes.map((income) => ({
        personType: income.personType,
        description: income.description,
        amount: income.amount,
        startDate: income.startYear,
        endDate: income.endYear,
      })),
      charitableDonations: data.charitableDonations.map((donation) => ({
        personType: donation.personType,
        amount: donation.amount,
        startDate: donation.startYear,
        endDate: donation.endYear,
      })),
      oneOffExpenses: data.oneOffExpenses.map((expense) => ({
        personType: expense.personType,
        description: expense.description,
        amount: expense.amount,
        year: expense.year,
      })),
    };

    console.log("Data to be sent to backend:", apiRequestBody);
  };

  const birthYearSelf = form.watch("persons.0.birthYear");
  const birthYearSpouse = calculateForSpouse
    ? form.watch("persons.1.birthYear")
    : undefined;

  return (
    <div className="p-6 space-y-8 w-full">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General Information</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <OnboardingCard form={form} />
        </TabsContent>
        <TabsContent value="income">
          <IncomeCard
            form={form}
            calculateForSpouse={calculateForSpouse}
            birthYearSelf={birthYearSelf}
            birthYearSpouse={birthYearSpouse}
            yearFromBirthYearAndTargetAge={yearFromBirthYearAndTargetAge}
          />
        </TabsContent>
        <TabsContent value="assets">
          <AssetsCard form={form} />
        </TabsContent>
        <TabsContent value="expenses">
          <ExpensesCard form={form} />
        </TabsContent>
      </Tabs>
      <Button onClick={form.handleSubmit(onSubmit)}>Submit</Button>
    </div>
  );
};

export default Calculator;
