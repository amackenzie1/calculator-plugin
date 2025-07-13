import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

interface SwitchFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  description?: string
}

export function SwitchField<T extends FieldValues>({
  control,
  name,
  label,
  description,
}: SwitchFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel>{label}</FormLabel>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <FormControl>
            <Switch
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}