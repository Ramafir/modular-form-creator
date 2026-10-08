import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../design-system'
import { ApiError } from '../../../shared/api/httpClient'
import { LoadingState } from '../../../shared/ui/LoadingState'
import { Page } from '../../../shared/ui/Page'
import { StatusMessage } from '../../../shared/ui/StatusMessage'
import { resourceQueries } from '../api/resourceQueries'
import { PendingChangesBanner } from '../components/PendingChangesBanner'
import { ResourceHeader } from '../components/ResourceHeader'
import { resourcePaths } from '../paths'

/** Loads the resource once for all nested pages and handles its loading and error states. */
export function ResourceLayout() {
  const { resourceId = '' } = useParams()
  const { pathname } = useLocation()
  const {
    data: resource,
    error,
    isPending,
    refetch,
  } = useQuery(resourceQueries.detail(resourceId))

  if (isPending) return <LoadingState label="Loading resource…" />

  if (!resource) return <ResourceLoadError error={error} onRetry={() => refetch()} />

  // The API also resolves Mongo ObjectIds and ids like "01"; redirect so URLs and
  // cache keys always use the numeric resourceId.
  const canonicalId = String(resource.resourceId)
  if (resourceId !== canonicalId) {
    const canonicalPath = pathname.replace(
      resourcePaths.overview(resourceId),
      resourcePaths.overview(canonicalId),
    )
    return <Navigate to={canonicalPath} replace />
  }

  return (
    <Page>
      <ResourceHeader resource={resource} />
      <PendingChangesBanner resource={resource} />
      {/* Remount nested pages per resource, so form state never leaks between resources. */}
      <Outlet key={resource._id} context={resource} />
    </Page>
  )
}

const CLIENT_ERRORS: Partial<Record<number, { title: string; description: string }>> = {
  400: {
    title: 'Invalid resource link',
    description: 'Resource links use a numeric id, for example /resources/1.',
  },
  404: {
    title: 'Resource not found',
    description: 'It may have been deleted.',
  },
}

interface ResourceLoadErrorProps {
  error: Error | null
  onRetry: () => void
}

function ResourceLoadError({ error, onRetry }: ResourceLoadErrorProps) {
  const navigate = useNavigate()
  const clientError = error instanceof ApiError ? CLIENT_ERRORS[error.status] : undefined

  if (clientError) {
    return (
      <StatusMessage
        {...clientError}
        action={
          <Button type="button" onClick={() => navigate(resourcePaths.list)}>
            Back to resources
          </Button>
        }
      />
    )
  }

  return (
    <StatusMessage
      title="Could not load the resource"
      description={error?.message}
      action={
        <Button type="button" onClick={onRetry}>
          Try again
        </Button>
      }
    />
  )
}
