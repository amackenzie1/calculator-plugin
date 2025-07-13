import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  placeholder?: string
  options: SelectOption[]
  disabled?: boolean
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Select an option',
  options,
  disabled = false,
}: SelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || ''}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}