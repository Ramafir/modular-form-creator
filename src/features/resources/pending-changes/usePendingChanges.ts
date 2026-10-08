import { use } from 'react'
import { RESOURCE_MODULES_BY_KEY } from '../model/modules'
import { getModuleChanges, type PendingChanges } from '../model/pendingChanges'
import type { ModuleUpdate, Resource } from '../model/types'
import { PendingChangesContext } from './PendingChangesContext'

const NO_CHANGES: PendingChanges = {}

export function usePendingChangesStore() {
  const store = use(PendingChangesContext)
  if (!store) {
    throw new Error('usePendingChangesStore must be used inside PendingChangesProvider')
  }
  return store
}

/** Unsubmitted edits of one completed resource. */
export function usePendingChanges(resource: Resource) {
  const { state, stage, discard } = usePendingChangesStore()
  const changes = state[resource._id] ?? NO_CHANGES

  return {
    changes,
    moduleChanges: getModuleChanges(resource, changes).map(({ moduleKey, fields }) => ({
      module: RESOURCE_MODULES_BY_KEY[moduleKey],
      fields,
    })),
    stage: (update: ModuleUpdate) => stage(resource, update),
    discard: () => discard(resource._id),
  }
}
