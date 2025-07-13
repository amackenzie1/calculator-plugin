import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

interface NumberInputProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  placeholder?: string
  type?: 'integer' | 'decimal'
  onBlur?: () => void
  disabled?: boolean
}

export function NumberInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Enter value',
  type = 'integer',
  onBlur,
  disabled = false,
}: NumberInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              step={type === 'decimal' ? '0.01' : undefined}
              placeholder={placeholder}
              disabled={disabled}
              value={field.value == null ? '' : field.value.toString()}
              onChange={(e) => {
                const value = e.target.value
                if (type === 'decimal') {
                  field.onChange(value ? parseFloat(value) : null)
                } else {
                  field.onChange(value ? parseInt(value) : null)
                }
              }}
              onBlur={() => {
                field.onBlur()
                onBlur?.()
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}