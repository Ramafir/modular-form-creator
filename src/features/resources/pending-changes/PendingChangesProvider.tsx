import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { pendingChangesReducer } from '../model/pendingChanges'
import { PendingChangesContext, type PendingChangesStore } from './PendingChangesContext'

interface PendingChangesProviderProps {
  children: ReactNode
}

/**
 * Keeps edits of completed resources in memory only: they survive navigation
 * within the app but are intentionally lost on refresh or when the tab closes.
 */
export function PendingChangesProvider({ children }: PendingChangesProviderProps) {
  const [state, dispatch] = useReducer(pendingChangesReducer, {})
  const hasPendingChanges = Object.keys(state).length > 0

  // Let the browser ask for confirmation before unsubmitted edits are dropped.
  useEffect(() => {
    if (!hasPendingChanges) return
    const preventUnload = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', preventUnload)
    return () => window.removeEventListener('beforeunload', preventUnload)
  }, [hasPendingChanges])

  const store = useMemo<PendingChangesStore>(
    () => ({
      state,
      stage: (resource, update) => dispatch({ type: 'stage', resource, update }),
      discard: (resourceKey) => dispatch({ type: 'discard', resourceKey }),
    }),
    [state],
  )

  return <PendingChangesContext value={store}>{children}</PendingChangesContext>
}
