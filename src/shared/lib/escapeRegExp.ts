/** Escapes characters that have a special meaning in regular expressions. */
export const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
