// Utility function for handling number input changes
export const handleNumberInputChange =
  (
    onChange: (value: number | undefined) => void,
    options?: { isPercentage?: boolean; isDecimal?: boolean }
  ) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      onChange(undefined)
      return
    }
    const numValue = options?.isPercentage
      ? parseFloat(value) / 100
      : options?.isDecimal
      ? parseFloat(value)
      : parseInt(value)
    onChange(numValue)
  }

// Utility function for formatting number input values
export const formatNumberInputValue = (
  value: number | undefined,
  options?: { isPercentage?: boolean; isDecimal?: boolean }
) => {
  if (value === undefined) return ''
  if (options?.isPercentage) {
    return (value * 100).toFixed(2)
  }
  return value.toString()
}

// Utility function for creating a number input field
export const createNumberInput = (
  field: {
    value: number | undefined
    onChange: (value: number | undefined) => void
  },
  options?: { isPercentage?: boolean; isDecimal?: boolean }
) => ({
  type: 'number' as const,
  value: formatNumberInputValue(field.value, options),
  onChange: handleNumberInputChange(field.onChange, options),
})
