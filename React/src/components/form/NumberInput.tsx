import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Control, FieldPath, FieldValues, ControllerRenderProps } from 'react-hook-form'
import { useState, useEffect } from 'react'

interface NumberInputProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  placeholder?: string
  type?: 'integer' | 'decimal'
  onBlur?: () => void
  disabled?: boolean
  skipFormatting?: boolean
}

const formatNumber = (value: string, isDecimal: boolean, skipFormatting: boolean): string => {
  const cleaned = value.replace(/[^0-9.-]/g, '')
  
  if (cleaned === '' || cleaned === '-') return cleaned
  
  // Skip formatting if requested (e.g., for year fields)
  if (skipFormatting) {
    return cleaned.split('.')[0] // Years should be integers
  }
  
  const parts = cleaned.split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1]
  
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  
  if (isDecimal && parts.length > 1) {
    return `${formattedInteger}.${decimalPart.slice(0, 2)}`
  }
  
  return formattedInteger
}

const parseFormattedNumber = (value: string): number | null => {
  if (!value) return null
  const cleaned = value.replace(/,/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? null : parsed
}

interface NumberFieldProps<T extends FieldValues> {
  field: ControllerRenderProps<T, FieldPath<T>>
  placeholder?: string
  type?: 'integer' | 'decimal'
  onBlur?: () => void
  disabled?: boolean
  skipFormatting?: boolean
}

function NumberFieldInput<T extends FieldValues>({
  field,
  placeholder = 'Enter value',
  type = 'integer',
  onBlur,
  disabled = false,
  skipFormatting = false,
}: NumberFieldProps<T>) {
  const [displayValue, setDisplayValue] = useState('')
  
  useEffect(() => {
    if (field.value == null) {
      setDisplayValue('')
    } else {
      setDisplayValue(formatNumber(field.value.toString(), type === 'decimal', skipFormatting))
    }
  }, [field.value, type, skipFormatting])
  
  return (
    <Input
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      disabled={disabled}
      value={displayValue}
      onChange={(e) => {
        const input = e.target.value
        const formatted = formatNumber(input, type === 'decimal', skipFormatting)
        setDisplayValue(formatted)
        
        const numericValue = parseFormattedNumber(formatted)
        if (type === 'decimal') {
          field.onChange(numericValue)
        } else {
          field.onChange(numericValue !== null ? Math.floor(numericValue) : null)
        }
      }}
      onBlur={() => {
        field.onBlur()
        onBlur?.()
      }}
    />
  )
}

export function NumberInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Enter value',
  type = 'integer',
  onBlur,
  disabled = false,
  skipFormatting = false,
}: NumberInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <NumberFieldInput
              field={field}
              placeholder={placeholder}
              type={type}
              onBlur={onBlur}
              disabled={disabled}
              skipFormatting={skipFormatting}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}