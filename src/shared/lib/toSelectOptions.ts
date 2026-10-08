import type { SelectOption } from '../../design-system'

/** Builds design-system Select options from allowed values and their labels. */
export const toSelectOptions = <T extends string>(
  values: readonly T[],
  labels: Record<T, string>,
  placeholder?: string,
): SelectOption[] => [
  ...(placeholder === undefined ? [] : [{ value: '', label: placeholder }]),
  ...values.map((value) => ({ value, label: labels[value] })),
]
