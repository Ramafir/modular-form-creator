import { z } from 'zod'
import { RESOURCE_STATUSES, SORT_ORDERS } from './constants'

const DEFAULT_PAGE = 1
const DEFAULT_SORT_ORDER = 'desc'

// Invalid or missing URL values fall back to defaults, so the API never receives
// a query it would reject with 400.
const listSearchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(DEFAULT_PAGE),
  status: z.enum(RESOURCE_STATUSES).optional().catch(undefined),
  name: z.string().catch(''),
  sortOrder: z.enum(SORT_ORDERS).catch(DEFAULT_SORT_ORDER),
})

/** List page state kept in the URL, so it survives refreshes and can be shared. */
export type ResourceListSearch = z.infer<typeof listSearchSchema>

export const parseListSearch = (searchParams: URLSearchParams): ResourceListSearch =>
  listSearchSchema.parse(Object.fromEntries(searchParams))

/** Writes only non-default values to keep URLs short. */
export const serializeListSearch = ({
  page,
  status,
  name,
  sortOrder,
}: ResourceListSearch) => {
  const searchParams = new URLSearchParams()
  if (page !== DEFAULT_PAGE) searchParams.set('page', String(page))
  if (status) searchParams.set('status', status)
  if (name) searchParams.set('name', name)
  if (sortOrder !== DEFAULT_SORT_ORDER) searchParams.set('sortOrder', sortOrder)
  return searchParams
}
