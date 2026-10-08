import { Link, Outlet } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { resourcePaths } from '../features/resources/paths'

export function AppLayout() {
  return (
    <>
      <Header>
        <HeaderContent>
          <Brand to={resourcePaths.list}>Resources Management</Brand>
        </HeaderContent>
      </Header>
      <Main>
        <Outlet />
      </Main>
    </>
  )
}

const container = css`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding-inline: ${({ theme }) => theme.spacing.lg};
`

const Header = styled.header`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

const HeaderContent = styled.div`
  ${container}
  padding-block: ${({ theme }) => theme.spacing.md};
`

const Brand = styled(Link)`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.15rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const Main = styled.main`
  ${container}
  padding-block: ${({ theme }) => theme.spacing.xl};
`
