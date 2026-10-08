import { Button } from '../design-system'
import { StatusMessage } from '../shared/ui/StatusMessage'

export function RouteErrorPage() {
  return (
    <StatusMessage
      title="Something went wrong"
      description="An unexpected error occurred. Reload the page to try again."
      action={
        <Button type="button" onClick={() => window.location.reload()}>
          Reload page
        </Button>
      }
    />
  )
}
