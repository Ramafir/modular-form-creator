import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  parseListSearch,
  serializeListSearch,
  type ResourceListSearch,
} from '../model/listSearch'

interface UpdateOptions {
  /** Replace the history entry instead of pushing a new one (e.g. while typing). */
  replace?: boolean
}

export type UpdateListSearch = (
  changes: Partial<ResourceListSearch>,
  options?: UpdateOptions,
) => void

export function useResourceListSearch() {
  const [searchParams, setSearchParams] = useSearchParams()

  const updateSearch = useCallback<UpdateListSearch>(
    (changes, { replace = false } = {}) =>
      setSearchParams(
        // Any change starts from the first page unless a page is given explicitly.
        (current) =>
          serializeListSearch({ ...parseListSearch(current), page: 1, ...changes }),
        { replace },
      ),
    [setSearchParams],
  )

  return [parseListSearch(searchParams), updateSearch] as const
}
