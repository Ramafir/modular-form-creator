import styled from 'styled-components'
import { ModuleCard } from '../components/ModuleCard'
import { ProvisioningPanel } from '../components/ProvisioningPanel'
import { useCurrentResource } from '../hooks/useCurrentResource'
import { RESOURCE_MODULES } from '../model/modules'

export function ResourceOverviewPage() {
  const resource = useCurrentResource()

  return (
    <>
      <Section aria-labelledby="modules-heading">
        <h2 id="modules-heading">Modules</h2>
        <ModuleGrid>
          {RESOURCE_MODULES.map((module) => (
            <ModuleCard key={module.key} resource={resource} module={module} />
          ))}
        </ModuleGrid>
      </Section>
      <ProvisioningPanel resource={resource} />
    </>
  )
}

const Section = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`

const ModuleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`
