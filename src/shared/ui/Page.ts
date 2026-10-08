import styled from 'styled-components'

/** Vertical layout shared by all pages. */
export const Page = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`
