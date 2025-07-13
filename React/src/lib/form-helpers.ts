import { Path } from 'react-hook-form'

/**
 * Helper to create properly typed field paths for dynamic form fields
 * This is needed when constructing paths at runtime (e.g., with array indices)
 */
export function fieldPath<T>(path: string): Path<T> {
  return path as Path<T>
}