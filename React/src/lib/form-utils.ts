// Utility function for handling number input changes
export const handleNumberInputChange =
  (onChange: (value: number | undefined) => void) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const parsedValue = value === '' ? undefined : parseFloat(value)
    onChange(parsedValue)
  }

// Utility function for formatting number input values
export const formatNumberInputValue = (
  value: number | undefined,
  options?: { isPercentage?: boolean; isDecimal?: boolean }
) => {
  if (value === undefined) return ''
  if (options?.isPercentage) {
    return value.toFixed(2)
  }
  return value.toString()
}

// Utility function for creating a number input field
export const createNumberInput = (
  field: {
    value: number | undefined
    onChange: (value: number | undefined) => void
  },
  options?: {
    isPercentage?: boolean
    isDecimal?: boolean
    min?: number
    max?: number
  }
) => {
  // Initialize with the correct display value
  const initialDisplayValue =
    field.value !== undefined
      ? options?.isPercentage
        ? field.value.toFixed(2)
        : field.value.toString()
      : ''

  return {
    type: 'text' as const,
    inputMode: 'numeric' as const,
    value: initialDisplayValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (value === '') {
        field.onChange(undefined)
      } else {
        const num = parseFloat(value)
        if (!isNaN(num)) {
          field.onChange(num)
        }
      }
    },
  }
}
