import { useState } from 'react'
import styled from 'styled-components'
import { Card, IconButton } from '../../../design-system'
import { formatDateTime } from '../../../shared/lib/formatDate'
import { InlineConfirmation } from '../../../shared/ui/InlineConfirmation'
import { TextLink } from '../../../shared/ui/TextLink'
import type { Resource, ResourceId } from '../model/types'
import { resourcePaths } from '../paths'
import { ModuleProgress } from './ModuleProgress'
import { ResourceStatusBadge } from './ResourceStatusBadge'

interface ResourcesTableProps {
  resources: Resource[]
  /** Dims the table while the next page or filter result is loading. */
  isRefreshing: boolean
  deletingId?: ResourceId
  onDelete: (resource: Resource) => void
}

export function ResourcesTable({
  resources,
  isRefreshing,
  deletingId,
  onDelete,
}: ResourcesTableProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  return (
    <TableCard aria-busy={isRefreshing} $isRefreshing={isRefreshing}>
      <Table>
        <thead>
          <tr>
            <th scope="col">Resource</th>
            <th scope="col">Status</th>
            <th scope="col">Modules</th>
            <th scope="col">Created</th>
            <th scope="col" aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource._id}>
              <td>
                <TextLink to={resourcePaths.overview(resource.resourceId)}>
                  {resource.name}
                </TextLink>
                <ResourceNumber>#{resource.resourceId}</ResourceNumber>
              </td>
              <td>
                <ResourceStatusBadge status={resource.status} />
              </td>
              <td>
                <ModuleProgress resource={resource} />
              </td>
              <td>{formatDateTime(resource.createdAt)}</td>
              <ActionsCell>
                {confirmingId === resource._id ? (
                  <InlineConfirmation
                    message="Delete?"
                    label={`Confirm deleting ${resource.name}`}
                    confirmLabel="Delete"
                    pendingLabel="Deleting…"
                    isPending={deletingId === resource.resourceId}
                    onConfirm={() => onDelete(resource)}
                    onCancel={() => setConfirmingId(null)}
                  />
                ) : (
                  <IconButton
                    type="button"
                    variant="ghost"
                    size="small"
                    aria-label={`Delete ${resource.name}`}
                    onClick={() => setConfirmingId(resource._id)}
                  >
                    🗑
                  </IconButton>
                )}
              </ActionsCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableCard>
  )
}

const TableCard = styled(Card)<{ $isRefreshing: boolean }>`
  padding: 0;
  overflow-x: auto;
  opacity: ${({ $isRefreshing }) => ($isRefreshing ? 0.6 : 1)};
  transition: opacity 0.2s ease;
`

const Table = styled.table`
  width: 100%;
  min-width: 680px;
  border-collapse: collapse;

  th,
  td {
    padding: 14px 20px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    text-align: left;
    vertical-align: middle;
  }

  th {
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.inkMuted};
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover {
    background: rgba(31, 122, 140, 0.04);
  }
`

const ResourceNumber = styled.span`
  margin-left: ${({ theme }) => theme.spacing.sm};
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.inkMuted};
`

const ActionsCell = styled.td`
  width: 1%;
  white-space: nowrap;
  text-align: right;
`
