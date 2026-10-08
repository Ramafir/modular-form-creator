import { useNavigate } from 'react-router-dom'
import { Button } from '../design-system'
import { resourcePaths } from '../features/resources/paths'
import { StatusMessage } from '../shared/ui/StatusMessage'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <StatusMessage
      title="Page not found"
      description="The page you are looking for does not exist."
      action={
        <Button type="button" onClick={() => navigate(resourcePaths.list)}>
          Back to resources
        </Button>
      }
    />
  )
}
