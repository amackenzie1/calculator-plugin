import { CalculatorSchemaType } from '@/components/Schema'
import { projectRetirement } from '../calculator/projection'

/**
 * Generates a detailed CSV string from projection data
 * @param data The calculator input data
 * @returns CSV string with detailed projection information
 */
export function generateProjectionCSV(data: CalculatorSchemaType): string {
  // Get the detailed projection data
  const projectionStates = projectRetirement(data)

  // Define CSV headers based on what information we want to include
  const headers = [
    'Year',
    'Age (Self)',
    'Net Worth',
    // Income breakdown
    'Total Income',
    'Total Income (Self)',
    // Self income details
    'Employment Income (Self)',
    'CPP Income (Self)',
    'OAS Income (Self)',
    'Pension Income (Self)',
    'Other Income (Self)',
    // Expenses
    'Annual Expenses',
    'Tax Paid',
    'Tax Paid (Self)',
    // Account values
    'TFSA Value',
    'RRSP Value',
    'RRIF Value',
    'Non-Registered Value',
    // Withdrawals
    'TFSA Withdrawals',
    'RRSP Withdrawals',
    'RRIF Withdrawals',
    'Non-Registered Withdrawals',
    'Realized Capital Gains',
  ]

  // Add spouse headers if applicable
  if (data.calculateForSpouse) {
    // Insert spouse age after self age
    headers.splice(2, 0, 'Age (Spouse)')
    
    // Insert spouse total income after self total income
    headers.splice(6, 0, 'Total Income (Spouse)')
    
    // Insert spouse income details after self income details
    headers.splice(12, 0, 'Employment Income (Spouse)')
    headers.splice(13, 0, 'CPP Income (Spouse)')
    headers.splice(14, 0, 'OAS Income (Spouse)')
    headers.splice(15, 0, 'Pension Income (Spouse)')
    headers.splice(16, 0, 'Other Income (Spouse)')
    
    // Insert spouse tax paid after self tax paid
    headers.splice(19, 0, 'Tax Paid (Spouse)')
  }

  // Create CSV content
  let csvContent = headers.join(',') + '\n'

  // Add data rows
  projectionStates.forEach((state) => {
    const selfPerson = state.persons.self
    const spousePerson = state.persons.spouse

    // Calculate total income for each person
    const selfIncome = {
      employment: selfPerson.income.employment,
      cpp: selfPerson.income.cpp,
      oas: selfPerson.income.oas,
      pension: selfPerson.income.definedBenefit,
      other: selfPerson.income.other.reduce((sum, inc) => sum + inc.amount, 0),
      total: 0
    }
    selfIncome.total = selfIncome.employment + selfIncome.cpp + selfIncome.oas + 
                       selfIncome.pension + selfIncome.other
    
    let spouseIncome = {
      employment: 0,
      cpp: 0,
      oas: 0,
      pension: 0,
      other: 0,
      total: 0
    }
    
    if (spousePerson) {
      spouseIncome = {
        employment: spousePerson.income.employment,
        cpp: spousePerson.income.cpp,
        oas: spousePerson.income.oas,
        pension: spousePerson.income.definedBenefit,
        other: spousePerson.income.other.reduce((sum, inc) => sum + inc.amount, 0),
        total: 0
      }
      spouseIncome.total = spouseIncome.employment + spouseIncome.cpp + spouseIncome.oas + 
                          spouseIncome.pension + spouseIncome.other
    }
    
    const totalIncome = selfIncome.total + spouseIncome.total
    
    // Calculate total investment values
    const tfsaValue = Object.values(state.persons).reduce(
      (sum, person) => sum + person.accounts.tfsa.marketValue,
      0
    )
    const rrspValue = Object.values(state.persons).reduce(
      (sum, person) => sum + person.accounts.rrsp.marketValue,
      0
    )
    const rrifValue = Object.values(state.persons).reduce(
      (sum, person) => sum + person.accounts.rrif.marketValue,
      0
    )
    const nonRegisteredValue = Object.values(state.persons).reduce(
      (sum, person) => sum + person.accounts.nonRegistered.marketValue,
      0
    )
    
    // Calculate total net worth (investments only)
    const investmentsNetWorth = tfsaValue + rrspValue + rrifValue + nonRegisteredValue
    
    // Format values for CSV
    const formatCurrency = (value: number) => Math.round(value).toString()
    
    // Create row data
    const rowData = [
      state.year.toString(),
      selfPerson.age.toString(),
    ]
    
    // Add spouse age if applicable
    if (data.calculateForSpouse && spousePerson) {
      rowData.push(spousePerson.age.toString())
    }
    
    // Add total income data
    rowData.push(
      formatCurrency(investmentsNetWorth), // Net Worth (just investments)
      formatCurrency(totalIncome),
      formatCurrency(selfIncome.total)
    )
    
    // Add spouse total income if applicable
    if (data.calculateForSpouse) {
      rowData.push(formatCurrency(spouseIncome.total))
    }
    
    // Add self income details
    rowData.push(
      formatCurrency(selfIncome.employment),
      formatCurrency(selfIncome.cpp),
      formatCurrency(selfIncome.oas),
      formatCurrency(selfIncome.pension),
      formatCurrency(selfIncome.other)
    )
    
    // Add spouse income details if applicable
    if (data.calculateForSpouse) {
      rowData.push(
        formatCurrency(spouseIncome.employment),
        formatCurrency(spouseIncome.cpp),
        formatCurrency(spouseIncome.oas),
        formatCurrency(spouseIncome.pension),
        formatCurrency(spouseIncome.other)
      )
    }
    
    // Add remaining financial data
    rowData.push(
      formatCurrency(state.expenses),
      formatCurrency(state.taxPaid),
      formatCurrency(state.taxPaidByPerson?.self || 0)
    )
    
    // Add spouse tax paid if applicable
    if (data.calculateForSpouse) {
      rowData.push(formatCurrency(state.taxPaidByPerson?.spouse || 0))
    }
    
    // Add account values and withdrawals
    rowData.push(
      formatCurrency(tfsaValue),
      formatCurrency(rrspValue),
      formatCurrency(rrifValue),
      formatCurrency(nonRegisteredValue),
      formatCurrency(state.withdrawals.tfsa),
      formatCurrency(state.withdrawals.rrsp),
      formatCurrency(state.withdrawals.rrif),
      formatCurrency(state.withdrawals.nonRegistered),
      formatCurrency(state.realizedGains)
    )
    
    csvContent += rowData.join(',') + '\n'
  })

  return csvContent
}

/**
 * Triggers a download of a CSV file
 * @param csvContent The CSV content as a string
 * @param filename The name of the file to download
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Create a blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

  // Create a download link
  const link = document.createElement('a')

  // Create a URL for the blob
  const url = URL.createObjectURL(blob)

  // Set link properties
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  // Add to document, click to download, and remove
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
