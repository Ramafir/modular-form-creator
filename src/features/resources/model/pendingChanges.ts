import { getChangedFields, type FieldChange } from './moduleFields'
import type {
  ModuleKey,
  ModuleUpdate,
  Resource,
  ResourceModules,
  ResourceReplacePayload,
} from './types'

/** Module edits of a completed resource that have not been submitted yet. */
export type PendingChanges = Partial<ResourceModules>

/** Keyed by the resource `_id`, because the backend reuses numeric `resourceId`s. */
export type PendingChangesState = Partial<Record<string, PendingChanges>>

export type PendingChangesAction =
  | { type: 'stage'; resource: Resource; update: ModuleUpdate }
  | { type: 'discard'; resourceKey: string }

const withModule = (changes: PendingChanges, update: ModuleUpdate): PendingChanges => {
  switch (update.moduleKey) {
    case 'basicInfo':
      return { ...changes, basicInfo: update.data }
    case 'projectDetails':
      return { ...changes, projectDetails: update.data }
  }
}

const withoutModule = (changes: PendingChanges, moduleKey: ModuleKey) => {
  const next = { ...changes }
  delete next[moduleKey]
  return next
}

const withoutResource = (state: PendingChangesState, resourceKey: string) => {
  const next = { ...state }
  delete next[resourceKey]
  return next
}

export function pendingChangesReducer(
  state: PendingChangesState,
  action: PendingChangesAction,
): PendingChangesState {
  switch (action.type) {
    case 'stage': {
      const { resource, update } = action
      const current = state[resource._id] ?? {}
      // Edits that match the saved data are not pending changes.
      const changes =
        getChangedFields(resource, update).length > 0
          ? withModule(current, update)
          : withoutModule(current, update.moduleKey)

      return Object.keys(changes).length > 0
        ? { ...state, [resource._id]: changes }
        : withoutResource(state, resource._id)
    }
    case 'discard':
      return withoutResource(state, action.resourceKey)
  }
}

export interface ModuleChange {
  moduleKey: ModuleKey
  fields: FieldChange[]
}

/** Changed fields per module, compared with the latest saved data. */
export const getModuleChanges = (
  resource: Resource,
  changes: PendingChanges,
): ModuleChange[] => {
  const updates: ModuleUpdate[] = []
  if (changes.basicInfo) updates.push({ moduleKey: 'basicInfo', data: changes.basicInfo })
  if (changes.projectDetails) {
    updates.push({ moduleKey: 'projectDetails', data: changes.projectDetails })
  }

  return updates
    .map((update) => ({
      moduleKey: update.moduleKey,
      fields: getChangedFields(resource, update),
    }))
    .filter(({ fields }) => fields.length > 0)
}

/** Full `PUT` body: buffered modules replace the saved ones; the name never changes. */
export const buildReplacePayload = (
  resource: Resource,
  changes: PendingChanges,
): ResourceReplacePayload => ({
  name: resource.name,
  basicInfo: changes.basicInfo ?? resource.basicInfo,
  projectDetails: changes.projectDetails ?? resource.projectDetails,
})
