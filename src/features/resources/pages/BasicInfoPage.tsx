import { BasicInfoForm } from '../components/BasicInfoForm'
import { useCurrentResource } from '../hooks/useCurrentResource'

export function BasicInfoPage() {
  const resource = useCurrentResource()

  return <BasicInfoForm resource={resource} />
}
