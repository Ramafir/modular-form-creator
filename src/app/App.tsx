import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles, theme } from '../design-system'
import { PendingChangesProvider } from '../features/resources/pending-changes/PendingChangesProvider'
import { queryClient } from './queryClient'
import { router } from './router'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <PendingChangesProvider>
          <RouterProvider router={router} />
        </PendingChangesProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
