import { describe, expect, it } from 'vitest'
import { formatInteger } from './formatNumber'

describe('formatInteger', () => {
  it('groups thousands and drops leading zeros', () => {
    expect(formatInteger('0012500')).toBe('12,500')
  })

  it('keeps every digit of values beyond Number.MAX_SAFE_INTEGER', () => {
    expect(formatInteger('12345678901234567890')).toBe('12,345,678,901,234,567,890')
  })
})
