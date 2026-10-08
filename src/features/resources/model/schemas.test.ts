import { describe, expect, it } from 'vitest'
import { basicInfoSchema, createResourceSchema, projectDetailsSchema } from './schemas'

const firstIssue = (result: { error?: { issues: { message: string }[] } }) =>
  result.error?.issues[0]?.message

describe('createResourceSchema', () => {
  const validate = (resourceName: string) =>
    createResourceSchema.safeParse({ resourceName })

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
    expect(firstIssue(validate(resourceName))).toContain(message)
  })
})

describe('basicInfoSchema', () => {
  const validBasicInfo = {
    owner: ' Jane Doe ',
    email: 'jane@example.com',
    description: ' Internal tooling ',
    priority: 'high',
  }

  it('accepts valid values and trims text fields', () => {
    expect(basicInfoSchema.parse(validBasicInfo)).toEqual({
      owner: 'Jane Doe',
      email: 'jane@example.com',
      description: 'Internal tooling',
      priority: 'high',
    })
  })

  it.each([
    ['an owner with digits', { owner: 'Jane 2' }, 'only letters and spaces'],
    ['an owner with diacritics', { owner: 'Łukasz' }, 'only letters and spaces'],
    ['an invalid email', { email: 'jane@example' }, 'Enter a valid email address'],
    ['a description over 1000 characters', { description: 'a'.repeat(1001) }, '1000'],
    ['an empty priority', { priority: '' }, 'Select a priority'],
    ['an unknown priority', { priority: 'urgent' }, 'Select a priority'],
  ])('rejects %s', (_case, override, message) => {
    expect(
      firstIssue(basicInfoSchema.safeParse({ ...validBasicInfo, ...override })),
    ).toContain(message)
  })
})

describe('projectDetailsSchema', () => {
  const validProjectDetails = {
    projectName: 'Project X',
    budget: '25000',
    category: 'vendor',
    options: ['FE devs', 'Designer'],
  }

  it('accepts valid values', () => {
    expect(projectDetailsSchema.safeParse(validProjectDetails).success).toBe(true)
  })

  it.each([
    ['a decimal budget', { budget: '12.5' }, 'Budget must be a whole number'],
    ['a negative budget', { budget: '-5' }, 'Budget must be a whole number'],
    ['an empty category', { category: '' }, 'Select a category'],
    ['no team members', { options: [] }, 'Select at least one team member'],
    ['an unknown team member', { options: ['QA'] }, 'Invalid option'],
  ])('rejects %s', (_case, override, message) => {
    const result = projectDetailsSchema.safeParse({ ...validProjectDetails, ...override })
    expect(result.success).toBe(false)
    expect(firstIssue(result)).toContain(message)
  })
})
