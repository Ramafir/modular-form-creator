import { useNavigate } from 'react-router-dom'
import { Button } from '../../../design-system'
import { StatusMessage } from '../../../shared/ui/StatusMessage'
import { ProjectDetailsForm } from '../components/ProjectDetailsForm'
import { useCurrentResource } from '../hooks/useCurrentResource'
import { isProjectDetailsLocked } from '../model/rules'
import { resourcePaths } from '../paths'

export function ProjectDetailsPage() {
  const resource = useCurrentResource()
  const navigate = useNavigate()

  // Guards direct URL access; the overview already shows the module as locked.
  if (isProjectDetailsLocked(resource)) {
    return (
      <StatusMessage
        title="Project Details is locked"
        description="Project Details becomes available once Basic Info is completed."
        action={
          <Button
            type="button"
            onClick={() =>
              navigate(resourcePaths.module(resource.resourceId, 'basicInfo'))
            }
          >
            Go to Basic Info
          </Button>
        }
      />
    )
  }

  return <ProjectDetailsForm resource={resource} />
}
