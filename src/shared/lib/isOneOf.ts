/** Narrows a string (e.g. a `<select>` value) to one of the allowed literals. */
export const isOneOf = <T extends string>(
  values: readonly T[],
  value: string,
): value is T => (values as readonly string[]).includes(value)
