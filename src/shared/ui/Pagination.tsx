import styled from 'styled-components'
import { Button } from '../../design-system'

interface PaginationProps {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const firstItem = (page - 1) * pageSize + 1
  const lastItem = Math.min(page * pageSize, totalItems)

  return (
    <Nav aria-label="Pagination">
      <Muted>
        Showing {firstItem}–{lastItem} of {totalItems}
      </Muted>
      {totalPages > 1 ? (
        <Controls>
          <Button
            type="button"
            variant="secondary"
            size="small"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <Muted>
            Page {page} of {totalPages}
          </Muted>
          <Button
            type="button"
            variant="secondary"
            size="small"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </Controls>
      ) : null}
    </Nav>
  )
}

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Muted = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.inkMuted};
`
