import { z } from 'zod'

// Rules mirror the backend validators in resource.service.ts, so users get
// feedback before a request is made.

export const NAME_MAX_LENGTH = 255
const NAME_PATTERN = /^[A-Za-z0-9 -]+$/

const requiredText = (label: string, maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(maxLength, `${label} must be at most ${maxLength} characters`)

const nameText = (label: string) =>
  requiredText(label, NAME_MAX_LENGTH).regex(
    NAME_PATTERN,
    `${label} can contain only letters, numbers, spaces and hyphens`,
  )

export const createResourceSchema = z.object({
  resourceName: nameText('Resource name'),
})

export type CreateResourceValues = z.infer<typeof createResourceSchema>
