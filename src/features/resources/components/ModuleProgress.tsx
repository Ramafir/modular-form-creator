import styled from 'styled-components'
import { getModuleProgress } from '../model/modules'
import type { Resource } from '../model/types'

interface ModuleProgressProps {
  resource: Resource
}

export function ModuleProgress({ resource }: ModuleProgressProps) {
  const { completed, total } = getModuleProgress(resource)

  return (
    <Wrapper>
      <Track
        role="progressbar"
        aria-label="Module progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={completed}
        aria-valuetext={`${completed} of ${total} modules completed`}
      >
        <Fill $ratio={completed / total} />
      </Track>
      <Count aria-hidden="true">
        {completed}/{total}
      </Count>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Track = styled.div`
  width: 72px;
  height: 6px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.border};
`

const Fill = styled.div<{ $ratio: number }>`
  width: ${({ $ratio }) => $ratio * 100}%;
  height: 100%;
  background: ${({ theme, $ratio }) =>
    $ratio === 1 ? theme.colors.success : theme.colors.primary};
  transition: width 0.2s ease;
`

const Count = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.inkMuted};
`
