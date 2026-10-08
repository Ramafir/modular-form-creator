import styled, { keyframes } from 'styled-components'

interface LoadingStateProps {
  label: string
}

export function LoadingState({ label }: LoadingStateProps) {
  return (
    <Wrapper role="status">
      <Spinner aria-hidden="true" />
      <span>{label}</span>
    </Wrapper>
  )
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.inkMuted};
`

const Spinner = styled.span`
  width: 20px;
  height: 20px;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 2s;
  }
`
