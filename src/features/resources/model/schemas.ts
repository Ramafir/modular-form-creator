import { z } from 'zod'
import { CATEGORIES, PRIORITIES, TEAM_MEMBERS } from './constants'
import { BASIC_INFO_FIELD_LABELS, PROJECT_DETAILS_FIELD_LABELS } from './labels'

// Rules mirror the backend validators in resource.service.ts, so users get
// feedback before a request is made.

export const NAME_MAX_LENGTH = 255
export const DESCRIPTION_MAX_LENGTH = 1000

const NAME_PATTERN = /^[A-Za-z0-9 -]+$/
const OWNER_PATTERN = /^[A-Za-z ]+$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INTEGER_PATTERN = /^\d+$/

const requiredText = (label: string) => z.string().trim().min(1, `${label} is required`)

const limitedText = (label: string, maxLength: number) =>
  requiredText(label).max(maxLength, `${label} must be at most ${maxLength} characters`)

const nameText = (label: string) =>
  limitedText(label, NAME_MAX_LENGTH).regex(
    NAME_PATTERN,
    `${label} can contain only letters, numbers, spaces and hyphens`,
  )

export const createResourceSchema = z.object({
  resourceName: nameText(BASIC_INFO_FIELD_LABELS.resourceName),
})

/** `resourceName` is immutable, so it is not part of the editable form. */
export const basicInfoSchema = z.object({
  owner: limitedText(BASIC_INFO_FIELD_LABELS.owner, NAME_MAX_LENGTH).regex(
    OWNER_PATTERN,
    'Owner can contain only letters and spaces',
  ),
  email: requiredText(BASIC_INFO_FIELD_LABELS.email).regex(
    EMAIL_PATTERN,
    'Enter a valid email address',
  ),
  description: limitedText(BASIC_INFO_FIELD_LABELS.description, DESCRIPTION_MAX_LENGTH),
  // Selects start empty, so accept any string and narrow it to the allowed values.
  priority: z.string().pipe(z.enum(PRIORITIES, { error: 'Select a priority' })),
})

export const projectDetailsSchema = z.object({
  projectName: nameText(PROJECT_DETAILS_FIELD_LABELS.projectName),
  budget: requiredText(PROJECT_DETAILS_FIELD_LABELS.budget).regex(
    INTEGER_PATTERN,
    'Budget must be a whole number',
  ),
  category: z.string().pipe(z.enum(CATEGORIES, { error: 'Select a category' })),
  options: z.array(z.enum(TEAM_MEMBERS)).min(1, 'Select at least one team member'),
})
