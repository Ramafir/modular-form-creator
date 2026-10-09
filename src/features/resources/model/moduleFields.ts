import { formatInteger } from '../../../shared/lib/formatNumber'
import {
  BASIC_INFO_FIELD_LABELS,
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  PROJECT_DETAILS_FIELD_LABELS,
} from './labels'
import type { ModuleKey, ModuleUpdate, Resource } from './types'

export type FieldValue = string | readonly string[]

interface ModuleField {
  key: string
  label: string
  /** Value as stored by the API; used to detect changes. */
  value: FieldValue
  /** Human-readable value; empty while the field is not filled in. */
  display: FieldValue
}

export interface FieldChange {
  key: string
  label: string
  before: FieldValue
  after: FieldValue
}

const field = (
  key: string,
  label: string,
  value: FieldValue,
  display: FieldValue = value,
): ModuleField => ({ key, label, value, display })

/** Field definitions shared by the details summary and the review of pending changes. */
export function getModuleFields(update: ModuleUpdate): ModuleField[] {
  switch (update.moduleKey) {
    case 'basicInfo': {
      const { resourceName, owner, email, priority, description } = update.data
      const labels = BASIC_INFO_FIELD_LABELS
      return [
        field('resourceName', labels.resourceName, resourceName),
        field('owner', labels.owner, owner),
        field('email', labels.email, email),
        field(
          'priority',
          labels.priority,
          priority,
          priority && PRIORITY_LABELS[priority],
        ),
        field('description', labels.description, description),
      ]
    }
    case 'projectDetails': {
      const { projectName, budget, category, options } = update.data
      const labels = PROJECT_DETAILS_FIELD_LABELS
      return [
        field('projectName', labels.projectName, projectName),
        field('budget', labels.budget, budget, budget && formatInteger(budget)),
        field(
          'category',
          labels.category,
          category,
          category && CATEGORY_LABELS[category],
        ),
        field('options', labels.options, options),
      ]
    }
  }
}

export const getModuleUpdate = (
  resource: Resource,
  moduleKey: ModuleKey,
): ModuleUpdate =>
  moduleKey === 'basicInfo'
    ? { moduleKey, data: resource.basicInfo }
    : { moduleKey, data: resource.projectDetails }

// Team members are a set, so their order does not matter.
const isSameValue = (a: FieldValue, b: FieldValue) =>
  typeof a === 'string' || typeof b === 'string'
    ? a === b
    : a.length === b.length && a.every((item) => b.includes(item))

/** Fields of `update` that differ from the saved module data of `resource`. */
export const getChangedFields = (
  resource: Resource,
  update: ModuleUpdate,
): FieldChange[] => {
  const savedFields = getModuleFields(getModuleUpdate(resource, update.moduleKey))

  return getModuleFields(update).flatMap(({ key, label, value, display }) => {
    const saved = savedFields.find((savedField) => savedField.key === key)
    return saved && !isSameValue(saved.value, value)
      ? [{ key, label, before: saved.display, after: display }]
      : []
  })
}
