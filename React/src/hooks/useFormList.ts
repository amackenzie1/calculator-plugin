import { UseFormReturn, Path, PathValue } from 'react-hook-form'

interface FormListItem {
  id: number
  [key: string]: unknown
}

export function useFormList<
  TFieldValues extends Record<string, unknown>,
  TFieldName extends Path<TFieldValues>
>(
  form: UseFormReturn<TFieldValues>,
  fieldName: TFieldName
) {
  const handleAdd = (newItem: FormListItem) => {
    const currentItems = (form.getValues(fieldName) || []) as FormListItem[]
    form.setValue(
      fieldName,
      [...currentItems, newItem] as PathValue<TFieldValues, TFieldName>
    )
  }

  const handleRemove = (id: number) => {
    const currentItems = (form.getValues(fieldName) || []) as FormListItem[]
    const updatedItems = currentItems.filter((item) => item.id !== id)
    form.setValue(
      fieldName,
      updatedItems as PathValue<TFieldValues, TFieldName>
    )
  }

  return { handleAdd, handleRemove }
}