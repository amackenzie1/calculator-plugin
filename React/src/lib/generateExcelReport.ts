import { CalculatorSchemaType } from "@/lib/schema/calculator";
import { YearState, getAllExpenses } from "@/lib/calculator/projection";
import { getCharitableDonationsForYear } from "@/lib/calculator/projection/tax";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // Utility to trigger browser download

// Helper for styling
const headerFill: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFC7CEEA" },
}; // Light blue
const sectionFill: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFFDE2B4" },
}; // Light orange
const cashSourceFill: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD5E8D4" },
}; // Light green
const cashUseFill: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFF8CECC" },
}; // Light red
const assetFill: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFDAE8FC" },
}; // Lighter blue
const liabilityFill: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFFFE1E0" },
}; // Lighter red
const totalFill: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFE6E6E6" },
}; // Light grey

const boldFont: Partial<ExcelJS.Font> = { bold: true };
const currencyFormat = "[$$-409]#,##0;[RED]-[$$-409]#,##0"; // Basic currency format

interface ReportRow {
  label: string;
  category?: string;
  subCategory?: string;
  getValue: (
    yearState: YearState,
    prevYearState: YearState | null,
    input: CalculatorSchemaType,
    personType?: "self" | "spouse"
  ) => number | string | null;
  isCurrency?: boolean;
  isBold?: boolean;
  fill?: ExcelJS.Fill;
  isSubTotal?: boolean;
  parentCategory?: string; // To help with subtotal calculations
}

export async function generateExcelReport(
  detailedProjectionStates: YearState[],
  input: CalculatorSchemaType,
  filename: string = "FinancialProjection.xlsx",
  returnWorkbook: boolean = false
): Promise<void | ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Financial Projection");

  if (detailedProjectionStates.length === 0) {
    console.error("No projection data to export.");
    return;
  }

  // Determine active registered accounts
  const activeRegisteredAccounts: {
    self: { [key: string]: boolean };
    spouse: { [key: string]: boolean };
  } = {
    self: { tfsa: false, rrsp: false, rrif: false, lira: false, lif: false },
    spouse: { tfsa: false, rrsp: false, rrif: false, lira: false, lif: false },
  };
  const accountTypes = ["tfsa", "rrsp", "rrif", "lira", "lif"] as const;
  detailedProjectionStates.forEach((yearState) => {
    yearState.persons.forEach((person) => {
      const personTypeKey = person.personType as "self" | "spouse";
      accountTypes.forEach((accType) => {
        if (person.accounts[accType]?.marketValue > 0) {
          activeRegisteredAccounts[personTypeKey][accType] = true;
        }
      });
    });
  });

  const dynamicallyAddedRegisteredRows: ReportRow[] = [];
  const accountTypeToLabelMap: { [key: string]: string } = {
    tfsa: "TFSA",
    rrsp: "RRSP",
    rrif: "RRIF",
    lira: "LIRA",
    lif: "LIF",
  };
  let anyRegisteredPortfolioActive = false;

  (["self", "spouse"] as const).forEach((personType) => {
    if (personType === "spouse" && !input.calculateForSpouse) return;

    let personHasActiveRegisteredAccount = false;
    accountTypes.forEach((accType) => {
      if (activeRegisteredAccounts[personType][accType]) {
        anyRegisteredPortfolioActive = true;
        personHasActiveRegisteredAccount = true;
      }
    });

    if (personHasActiveRegisteredAccount) {
      accountTypes.forEach((accType) => {
        if (activeRegisteredAccounts[personType][accType]) {
          dynamicallyAddedRegisteredRows.push({
            label: `${accountTypeToLabelMap[accType]} (${
              personType.charAt(0).toUpperCase() + personType.slice(1)
            })`,
            subCategory: "Registered Portfolios",
            getValue: (ys) =>
              ys.persons.find((p) => p.personType === personType)?.accounts[
                accType
              ].marketValue || 0,
            isCurrency: true,
            parentCategory: "Assets",
          });
        }
      });
    }
  });

  if (anyRegisteredPortfolioActive) {
    dynamicallyAddedRegisteredRows.unshift({
      label: "Registered Portfolios",
      category: "Assets",
      getValue: () => null,
      fill: assetFill,
    });
  }

  // Helper to DRY per-person row creation
  const perPersonRows = (
    baseLabel: string,
    subCategory: string,
    getValue: (ys: YearState, personType: "self" | "spouse") => number
  ): ReportRow[] => {
    const rows: ReportRow[] = [
      {
        label: `${baseLabel} (Self)`,
        subCategory,
        getValue: (ys) => getValue(ys, "self"),
        isCurrency: true,
        parentCategory: "Cash Sources",
      },
    ];
    if (input.calculateForSpouse) {
      rows.push({
        label: `${baseLabel} (Spouse)`,
        subCategory,
        getValue: (ys) => getValue(ys, "spouse"),
        isCurrency: true,
        parentCategory: "Cash Sources",
      });
    }
    return rows;
  };

  // --- Define Report Structure ---
  const reportRows: ReportRow[] = [
    // --- Cash Sources ---
    {
      label: "Cash Sources",
      isBold: true,
      fill: sectionFill,
      getValue: () => null,
    },
    {
      label: "Government Benefits",
      category: "Cash Sources",
      getValue: () => null,
      fill: cashSourceFill,
    },
    ...perPersonRows("CPP/QPP", "Government Benefits", (ys, type) =>
      ys.persons.find((p) => p.personType === type)?.income.cpp || 0
    ),
    ...perPersonRows("OAS", "Government Benefits", (ys, type) =>
      ys.persons.find((p) => p.personType === type)?.income.oas || 0
    ),
    // Employment & Pension income
    {
      label: "Employment & Pensions",
      category: "Cash Sources",
      getValue: () => null,
      fill: cashSourceFill,
    },
    ...perPersonRows("Employment", "Employment & Pensions", (ys, type) =>
      ys.persons.find((p) => p.personType === type)?.income.employment || 0
    ),
    ...perPersonRows(
      "Defined Benefit Pension",
      "Employment & Pensions",
      (ys, type) =>
        ys.persons.find((p) => p.personType === type)?.income.definedBenefit || 0
    ),
    ...perPersonRows(
      "Other Income",
      "Employment & Pensions",
      (ys, type) =>
        (ys.persons.find((p) => p.personType === type)?.income.other || []).reduce(
          (s, inc) => s + inc.amount,
          0
        )
    ),

    // Portfolio withdrawals (cash sources)
    {
      label: "Registered Withdrawals",
      category: "Cash Sources",
      getValue: () => null,
      fill: cashSourceFill,
    },
    ...perPersonRows("RRSP Withdrawals", "Registered Withdrawals", (ys, type) =>
      ys.persons.find((p) => p.personType === type)?.withdrawals.rrsp || 0
    ),
    ...perPersonRows("RRIF Withdrawals", "Registered Withdrawals", (ys, type) =>
      ys.persons.find((p) => p.personType === type)?.withdrawals.rrif || 0
    ),

    // Non-registered investment income
    {
      label: "Investment Income",
      category: "Cash Sources",
      getValue: () => null,
      fill: cashSourceFill,
    },
    ...perPersonRows("Interest", "Investment Income", (ys, type) =>
      ys.persons.find((p) => p.personType === type)?.income.interest || 0
    ),
    ...perPersonRows("Eligible Dividends", "Investment Income", (ys, type) =>
      ys.persons.find((p) => p.personType === type)?.income.eligibleDividends || 0
    ),
    ...perPersonRows("Realized Capital Gains", "Investment Income", (ys, type) =>
      ys.persons.find((p) => p.personType === type)?.realizedGains || 0
    ),
    // GIS, CPP Death Benefit not in current model - could be added if data exists
    // Only include Home Sales section if they plan to sell the house
    ...(input.primaryResidenceSell
      ? [
          {
            label: "Home Sales",
            category: "Cash Sources",
            getValue: () => null,
            fill: cashSourceFill,
          } as ReportRow,
          {
            label: "House Sale Proceeds",
            subCategory: "Home Sales",
            getValue: (ys: YearState, prevState: YearState | null, inp: CalculatorSchemaType) =>
              ys.year === inp.primaryResidenceSellYear && inp.primaryResidenceSell
                ? (prevState?.primaryResidenceValue || inp.primaryResidenceValue)
                : 0,
            isCurrency: true,
            parentCategory: "Cash Sources",
          } as ReportRow,
        ]
      : []),
    // Portfolio withdrawals removed from Cash Sources - they're not income
    {
      label: "Total Cash Sources",
      isBold: true,
      getValue: () => "",
      isCurrency: true,
      fill: totalFill,
      isSubTotal: true,
      parentCategory: "Cash Sources",
    }, // Calculated dynamically

    // --- Cash Uses ---
    {
      label: "Cash Uses",
      isBold: true,
      fill: sectionFill,
      getValue: () => null,
    },
    {
      label: "Income Taxes",
      category: "Cash Uses",
      getValue: () => null,
      fill: cashUseFill,
    },
    {
      label: "T1 General (Self)",
      subCategory: "Income Taxes",
      getValue: (ys) =>
        ys.persons.find((p) => p.personType === "self")?.taxPaid || 0,
      isCurrency: true,
      parentCategory: "Cash Uses",
    },
    ...(input.calculateForSpouse
      ? [
          {
            label: "T1 General (Spouse)",
            subCategory: "Income Taxes",
            getValue: (ys: YearState) =>
              ys.persons.find((p) => p.personType === "spouse")?.taxPaid || 0,
            isCurrency: true,
            parentCategory: "Cash Uses",
          } as ReportRow,
        ]
      : []),
    {
      label: "Lifestyle Expenses",
      category: "Cash Uses",
      getValue: () => null,
      fill: cashUseFill,
    },
    {
      label: "General Expenses",
      subCategory: "Lifestyle Expenses",
      getValue: (ys, _, inp) => getAllExpenses(ys, inp),
      isCurrency: true,
      parentCategory: "Cash Uses",
    },
    {
      label: "Charitable Donations",
      subCategory: "Lifestyle Expenses",
      getValue: (ys, _, inp) =>
        getCharitableDonationsForYear(
          inp.charitableDonations ?? [],
          ys.year
        ).reduce((sum, donation) => sum + (donation.amount ?? 0), 0),
      isCurrency: true,
      parentCategory: "Cash Uses",
    },
    {
      label: "Total Cash Uses",
      isBold: true,
      getValue: () => "",
      isCurrency: true,
      fill: totalFill,
      isSubTotal: true,
      parentCategory: "Cash Uses",
    }, // Calculated dynamically

    // --- Net Cash Flow ---
    {
      label: "Annual Net Cash Flow",
      isBold: true,
      getValue: () => "",
      isCurrency: true,
      fill: totalFill,
      category: "Net Cash Flow",
    }, // Calculated as Cash Sources - Cash Uses

    // --- Assets ---
    { label: "Assets", isBold: true, fill: sectionFill, getValue: () => null },
    // Only include house rows if planning to sell
    ...(input.primaryResidenceSell
      ? [
          {
            label: "Homes",
            category: "Assets",
            getValue: () => null,
            fill: assetFill,
          } as ReportRow,
          {
            label: "Primary Residence",
            subCategory: "Homes",
            getValue: (ys: YearState) => ys.primaryResidenceValue || 0,
            isCurrency: true,
            parentCategory: "Assets",
          } as ReportRow,
        ]
      : []),
    {
      label: "Non-Reg. Portfolios",
      category: "Assets",
      getValue: () => null,
      fill: assetFill,
    },
    {
      label: "Non-Reg. Portfolio (Self)",
      subCategory: "Non-Reg. Portfolios",
      getValue: (ys) =>
        ys.persons.find((p) => p.personType === "self")?.accounts.nonRegistered
          .marketValue || 0,
      isCurrency: true,
      parentCategory: "Assets",
    },
    ...(input.calculateForSpouse
      ? [
          {
            label: "Non-Reg. Portfolio (Spouse)",
            subCategory: "Non-Reg. Portfolios",
            getValue: (ys: YearState) =>
              ys.persons.find((p) => p.personType === "spouse")?.accounts
                .nonRegistered.marketValue || 0,
            isCurrency: true,
            parentCategory: "Assets",
          } as ReportRow,
        ]
      : []),
    // Add other account types (TFSA, RRSP etc.) here if desired
    ...dynamicallyAddedRegisteredRows,
    {
      label: "Total Assets",
      isBold: true,
      getValue: () => "",
      isCurrency: true,
      fill: totalFill,
      isSubTotal: true,
      parentCategory: "Assets",
    }, // Calculated dynamically

    // --- Net Worth ---
    {
      label: "Net Worth",
      isBold: true,
      getValue: (ys) => {
        let totalNetWorth = 0;
        ys.persons.forEach((person) => {
          Object.values(person.accounts).forEach(
            (acc) => (totalNetWorth += acc.marketValue)
          );
        });
        // Only add home value if they plan to sell it (consistent with graph)
        if (ys.primaryResidenceValue && input.primaryResidenceSell) {
          totalNetWorth += ys.primaryResidenceValue;
        }
        // Note: Life insurance is never included until someone dies
        return totalNetWorth;
      },
      isCurrency: true,
      fill: totalFill,
    },
  ];

  // --- Header Row (Years and Ages) ---
  const headerRow = sheet.addRow([]); // Placeholder for dynamic content
  headerRow.getCell(1).value = " "; // Empty for labels column
  headerRow.getCell(1).font = boldFont;
  headerRow.getCell(1).fill = headerFill;
  sheet.getColumn(1).width = 35; // Width for labels

  detailedProjectionStates.forEach((yearState, index) => {
    const self = input.persons.find((p) => p.personType === "self");
    const spouse = input.calculateForSpouse
      ? input.persons.find((p) => p.personType === "spouse")
      : null;
    const selfAge = self?.birthYear ? yearState.year - self.birthYear : "";
    const spouseAge = spouse?.birthYear
      ? yearState.year - spouse.birthYear
      : "";
    const ageString = `(${selfAge}${spouse ? ` / ${spouseAge}` : ""})`;
    const headerCell = headerRow.getCell(index + 2);
    headerCell.value = `${yearState.year} ${ageString}`;
    headerCell.font = boldFont;
    headerCell.alignment = { horizontal: "center" };
    headerCell.fill = headerFill;
    sheet.getColumn(index + 2).width = 20;
    sheet.getColumn(index + 2).numFmt = currencyFormat; // Default currency for year columns
  });

  // --- Data Rows ---
  const categorySubtotals: { [category: string]: { [year: number]: number } } =
    {};

  reportRows.forEach((rowConfig) => {
    const dataRow = sheet.addRow([]);
    const labelCell = dataRow.getCell(1);
    labelCell.value = rowConfig.subCategory
      ? `  ${rowConfig.label}`
      : rowConfig.label;
    if (rowConfig.isBold) labelCell.font = boldFont;

    let determinedFill: ExcelJS.Fill | undefined = undefined;
    if (rowConfig.fill) {
      determinedFill = rowConfig.fill;
    } else if (rowConfig.subCategory) {
      if (rowConfig.category === "Cash Sources") {
        determinedFill = cashSourceFill;
      } else if (rowConfig.category === "Cash Uses") {
        determinedFill = cashUseFill;
      } else if (rowConfig.category === "Assets") {
        determinedFill = assetFill;
      }
    } else if (rowConfig.category) {
      if (rowConfig.category === "Cash Sources") {
        determinedFill = cashSourceFill;
      } else if (rowConfig.category === "Cash Uses") {
        determinedFill = cashUseFill;
      } else if (rowConfig.category === "Assets") {
        determinedFill = assetFill;
      }
    }

    if (determinedFill) {
      labelCell.fill = determinedFill;
    }

    if (rowConfig.category && !categorySubtotals[rowConfig.category]) {
      categorySubtotals[rowConfig.category] = {};
    }

    detailedProjectionStates.forEach((yearState, index) => {
      const prevYearState =
        index > 0 ? detailedProjectionStates[index - 1] : null;
      const cell = dataRow.getCell(index + 2);
      let value: number | string | null = null;

      if (rowConfig.isSubTotal && rowConfig.parentCategory) {
        value = 0; // Placeholder, will be filled in the next loop
      } else if (rowConfig.label === "Annual Net Cash Flow") {
        value = 0; // Placeholder, will be filled in the next loop
      } else {
        value = rowConfig.getValue(yearState, prevYearState, input);
      }

      cell.value = value;
      if (rowConfig.isCurrency) cell.numFmt = currencyFormat;
      if (rowConfig.fill) cell.fill = rowConfig.fill;

      if (typeof value === "number" && rowConfig.parentCategory) {
        if (!categorySubtotals[rowConfig.parentCategory][yearState.year]) {
          categorySubtotals[rowConfig.parentCategory][yearState.year] = 0;
        }
        if (!rowConfig.isSubTotal) {
          categorySubtotals[rowConfig.parentCategory][yearState.year] += value;
        }
      }
    });
  });

  // --- Populate Subtotals and calculated rows ---
  sheet
    .getRows(headerRow.number + 1, reportRows.length)
    ?.forEach((dataRow: ExcelJS.Row, rowIndex: number) => {
      const rowConfig = reportRows[rowIndex];
      if (rowConfig.isSubTotal) {
        detailedProjectionStates.forEach((yearState, colIndex) => {
          const cell = dataRow.getCell(colIndex + 2);
          let calculatedValue: number | string = 0;

          if (
            rowConfig.isSubTotal &&
            rowConfig.parentCategory &&
            categorySubtotals[rowConfig.parentCategory]
          ) {
            calculatedValue =
              categorySubtotals[rowConfig.parentCategory][yearState.year] || 0;
          }

          cell.value = calculatedValue;
          cell.font = boldFont;
          cell.numFmt = currencyFormat;
          cell.fill = totalFill;
        });
      } else if (rowConfig.label === "Annual Net Cash Flow") {
        detailedProjectionStates.forEach((yearState, colIndex) => {
          const cell = dataRow.getCell(colIndex + 2);
          const cashSources = categorySubtotals["Cash Sources"]?.[yearState.year] || 0;
          const cashUses = categorySubtotals["Cash Uses"]?.[yearState.year] || 0;
          const netCashFlow = cashSources - cashUses;

          cell.value = netCashFlow;
          cell.font = boldFont;
          cell.numFmt = currencyFormat;
          cell.fill = totalFill;
        });
      }
    });

  // --- Return workbook for testing or trigger download ---
  if (returnWorkbook) {
    return workbook;
  }

  // --- Trigger Download ---
  try {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, filename);
  } catch (error) {
    console.error("Error writing excel buffer or saving file:", error);
    // Handle error - maybe show a toast to the user
  }
}
