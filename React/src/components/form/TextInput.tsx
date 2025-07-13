import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

interface TextInputProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  placeholder?: string
  onBlur?: () => void
  disabled?: boolean
}

export function TextInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Enter value',
  onBlur,
  disabled = false,
}: TextInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder={placeholder}
              disabled={disabled}
              value={field.value || ''}
              onChange={field.onChange}
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