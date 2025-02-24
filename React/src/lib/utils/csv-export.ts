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
    'Employment Income',
    'CPP Income',
    'OAS Income',
    'Pension Income',
    'Other Income',
    // Expenses
    'Annual Expenses',
    'Tax Paid',
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
    
    // Insert spouse income details after total income
    headers.splice(5, 0, 'Employment Income (Spouse)')
    headers.splice(7, 0, 'CPP Income (Spouse)')
    headers.splice(9, 0, 'OAS Income (Spouse)')
    headers.splice(11, 0, 'Pension Income (Spouse)')
    headers.splice(13, 0, 'Other Income (Spouse)')
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
    
    // Add financial data
    rowData.push(
      formatCurrency(investmentsNetWorth), // Net Worth (just investments)
      formatCurrency(totalIncome),
      formatCurrency(selfIncome.employment),
    )
    
    // Add spouse employment income if applicable
    if (data.calculateForSpouse) {
      rowData.push(formatCurrency(spouseIncome.employment))
    }
    
    rowData.push(formatCurrency(selfIncome.cpp))
    
    // Add spouse CPP if applicable
    if (data.calculateForSpouse) {
      rowData.push(formatCurrency(spouseIncome.cpp))
    }
    
    rowData.push(formatCurrency(selfIncome.oas))
    
    // Add spouse OAS if applicable
    if (data.calculateForSpouse) {
      rowData.push(formatCurrency(spouseIncome.oas))
    }
    
    rowData.push(formatCurrency(selfIncome.pension))
    
    // Add spouse pension if applicable
    if (data.calculateForSpouse) {
      rowData.push(formatCurrency(spouseIncome.pension))
    }
    
    rowData.push(formatCurrency(selfIncome.other))
    
    // Add spouse other income if applicable
    if (data.calculateForSpouse) {
      rowData.push(formatCurrency(spouseIncome.other))
    }
    
    // Add remaining financial data
    rowData.push(
      formatCurrency(state.expenses),
      formatCurrency(state.taxPaid),
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
