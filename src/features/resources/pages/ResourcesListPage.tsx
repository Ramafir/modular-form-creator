import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Button } from '../../../design-system'
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue'
import { Alert } from '../../../shared/ui/Alert'
import { LoadingState } from '../../../shared/ui/LoadingState'
import { Page } from '../../../shared/ui/Page'
import { PageHeader } from '../../../shared/ui/PageHeader'
import { Pagination } from '../../../shared/ui/Pagination'
import { StatusMessage } from '../../../shared/ui/StatusMessage'
import { useDeleteResource } from '../api/resourceMutations'
import { resourceQueries } from '../api/resourceQueries'
import { CreateResourceForm } from '../components/CreateResourceForm'
import { ResourceFilters } from '../components/ResourceFilters'
import { ResourcesTable } from '../components/ResourcesTable'
import { useResourceListSearch } from '../hooks/useResourceListSearch'

const SEARCH_DEBOUNCE_MS = 300

export function ResourcesListPage() {
  const [search, updateSearch] = useResourceListSearch()
  const debouncedName = useDebouncedValue(search.name, SEARCH_DEBOUNCE_MS)
  const { data, error, isPending, isPlaceholderData, refetch } = useQuery(
    resourceQueries.list({ ...search, name: debouncedName }),
  )
  const deleteResource = useDeleteResource()

  // The backend clamps out-of-range pages (e.g. after deleting the last item on
  // the last page), so keep the URL in sync with the page actually returned.
  const responsePage = isPlaceholderData ? undefined : data?.pagination.page
  useEffect(() => {
    if (responsePage !== undefined && responsePage !== search.page) {
      updateSearch({ page: responsePage }, { replace: true })
    }
  }, [responsePage, search.page, updateSearch])

  const renderResults = () => {
    if (isPending) return <LoadingState label="Loading resources…" />

    if (!data) {
      return (
        <StatusMessage
          title="Could not load resources"
          description={error?.message}
          action={
            <Button type="button" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      )
    }

    if (data.items.length === 0) {
      return search.name || search.status ? (
        <StatusMessage
          title="No matching resources"
          description="Try a different name or status."
          action={
            <Button
              type="button"
              variant="secondary"
              onClick={() => updateSearch({ name: '', status: undefined })}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <StatusMessage
          title="No resources yet"
          description="Create your first resource to get started."
        />
      )
    }

    return (
      <>
        <ResourcesTable
          resources={data.items}
          isRefreshing={isPlaceholderData}
          deletingId={deleteResource.isPending ? deleteResource.variables : undefined}
          onDelete={(resource) => deleteResource.mutate(resource.resourceId)}
        />
        <Pagination
          {...data.pagination}
          onPageChange={(page) => updateSearch({ page })}
        />
      </>
    )
  }

  return (
    <Page>
      <PageHeader
        title="Resources"
        description="Create resources and track their module progress."
      />
      <CreateResourceForm />
      <ResourceFilters search={search} onChange={updateSearch} />
      {deleteResource.error ? (
        <Alert title="The resource could not be deleted">
          {deleteResource.error.message}
        </Alert>
      ) : null}
      {renderResults()}
    </Page>
  )
}
