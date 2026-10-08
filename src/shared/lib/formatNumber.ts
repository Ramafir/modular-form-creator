const integerFormat = new Intl.NumberFormat('en-GB')

/** Formats a digit string with BigInt, so long values keep every digit. */
export const formatInteger = (digits: string) => integerFormat.format(BigInt(digits))
