import { createContext } from 'react'
import type { PendingChangesState } from '../model/pendingChanges'
import type { ModuleUpdate, Resource } from '../model/types'

export interface PendingChangesStore {
  state: PendingChangesState
  stage: (resource: Resource, update: ModuleUpdate) => void
  discard: (resourceKey: string) => void
}

export const PendingChangesContext = createContext<PendingChangesStore | null>(null)
