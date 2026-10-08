import { describe, expect, it } from 'vitest'
import { createResourceSchema } from './schemas'

const validate = (resourceName: string) =>
  createResourceSchema.safeParse({ resourceName })

describe('createResourceSchema', () => {
  it('accepts letters, numbers, spaces and hyphens and trims the value', () => {
    expect(validate('  Team-42 Alpha ')).toEqual({
      success: true,
      data: { resourceName: 'Team-42 Alpha' },
    })
  })

  it.each([
    ['an empty name', '   ', 'Resource name is required'],
    ['special characters', 'Alpha_1!', 'Resource name can contain only letters'],
    ['a name over 255 characters', 'a'.repeat(256), 'at most 255 characters'],
  ])('rejects %s', (_case, resourceName, message) => {
    const result = validate(resourceName)
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toContain(message)
  })
})
