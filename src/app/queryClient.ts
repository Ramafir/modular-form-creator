import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '../shared/api/httpClient'

const MAX_RETRIES = 2

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Mutations write fresh data into the cache, so route changes don't need refetches.
      staleTime: 30_000,
      // Retrying 4xx responses (invalid id, not found) would only delay the error state.
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.isClientError) && failureCount < MAX_RETRIES,
    },
  },
})
