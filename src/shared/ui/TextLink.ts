import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const TextLink = styled(Link)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primaryStrong};

  &:hover {
    text-decoration: underline;
  }
`
