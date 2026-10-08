import styled from 'styled-components'
import { Input, Select, type SelectOption } from '../../../design-system'
import { isOneOf } from '../../../shared/lib/isOneOf'
import type { UpdateListSearch } from '../hooks/useResourceListSearch'
import { RESOURCE_STATUSES, SORT_ORDERS } from '../model/constants'
import { RESOURCE_STATUS_LABELS } from '../model/labels'
import type { ResourceListSearch } from '../model/listSearch'
import type { SortOrder } from '../model/types'

const STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'All statuses' },
  ...RESOURCE_STATUSES.map((status) => ({
    value: status,
    label: RESOURCE_STATUS_LABELS[status],
  })),
]

const SORT_ORDER_LABELS: Record<SortOrder, string> = {
  desc: 'Newest first',
  asc: 'Oldest first',
}

const SORT_OPTIONS: SelectOption[] = SORT_ORDERS.map((sortOrder) => ({
  value: sortOrder,
  label: SORT_ORDER_LABELS[sortOrder],
}))

interface ResourceFiltersProps {
  search: ResourceListSearch
  onChange: UpdateListSearch
}

export function ResourceFilters({ search, onChange }: ResourceFiltersProps) {
  return (
    <Toolbar>
      <Input
        type="search"
        label="Search"
        placeholder="Resource name"
        value={search.name}
        // Typing replaces the history entry so "Back" leaves the list instead of undoing keystrokes.
        onChange={(event) => onChange({ name: event.target.value }, { replace: true })}
      />
      <Select
        label="Status"
        options={STATUS_OPTIONS}
        value={search.status ?? ''}
        onChange={({ target: { value } }) =>
          onChange({ status: isOneOf(RESOURCE_STATUSES, value) ? value : undefined })
        }
      />
      <Select
        label="Sort by"
        options={SORT_OPTIONS}
        value={search.sortOrder}
        onChange={({ target: { value } }) => {
          if (isOneOf(SORT_ORDERS, value)) onChange({ sortOrder: value })
        }}
      />
    </Toolbar>
  )
}

const Toolbar = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
  }
`
