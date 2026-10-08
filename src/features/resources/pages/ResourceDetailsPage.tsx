import { ModuleSummary } from '../components/ModuleSummary'
import { useCurrentResource } from '../hooks/useCurrentResource'
import { RESOURCE_MODULES } from '../model/modules'

export function ResourceDetailsPage() {
  const resource = useCurrentResource()

  return RESOURCE_MODULES.map((module) => (
    <ModuleSummary key={module.key} resource={resource} module={module} />
  ))
}
