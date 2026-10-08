import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Input, Select } from '../../../design-system'
import { toSelectOptions } from '../../../shared/lib/toSelectOptions'
import { useModuleSubmit } from '../hooks/useModuleSubmit'
import { PRIORITIES } from '../model/constants'
import { BASIC_INFO_FIELD_LABELS as LABELS, PRIORITY_LABELS } from '../model/labels'
import { BASIC_INFO_MODULE } from '../model/modules'
import {
  basicInfoSchema,
  DESCRIPTION_MAX_LENGTH,
  NAME_MAX_LENGTH,
} from '../model/schemas'
import type { Resource } from '../model/types'
import { resourcePaths } from '../paths'
import { ModuleFormShell } from './ModuleFormShell'

const PRIORITY_OPTIONS = toSelectOptions(PRIORITIES, PRIORITY_LABELS, 'Select a priority')

interface BasicInfoFormProps {
  resource: Resource
}

export function BasicInfoForm({ resource }: BasicInfoFormProps) {
  const navigate = useNavigate()
  const { submit, isSubmitting, error } = useModuleSubmit(resource)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(basicInfoSchema),
    // `resourceName` is ignored here: the schema strips fields it does not define.
    defaultValues: resource.basicInfo,
  })
  const description = useWatch({ control, name: 'description' })

  return (
    <ModuleFormShell
      module={BASIC_INFO_MODULE}
      submitLabel="Save Basic Info"
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={handleSubmit((values) =>
        submit({
          moduleKey: 'basicInfo',
          data: { resourceName: resource.name, ...values },
        }),
      )}
      onCancel={() => navigate(resourcePaths.overview(resource.resourceId))}
    >
      <Input
        label={LABELS.resourceName}
        value={resource.name}
        state="locked"
        tooltip="Resource name is immutable after creation."
        helperText="This value cannot be changed."
      />
      <Input
        label={LABELS.owner}
        autoComplete="name"
        maxLength={NAME_MAX_LENGTH}
        helperText="Letters and spaces only."
        error={errors.owner?.message}
        {...register('owner')}
      />
      <Input
        label={LABELS.email}
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label={LABELS.description}
        multiline
        rows={5}
        maxLength={DESCRIPTION_MAX_LENGTH}
        helperText={`${description.length}/${DESCRIPTION_MAX_LENGTH} characters`}
        error={errors.description?.message}
        {...register('description')}
      />
      <Select
        label={LABELS.priority}
        options={PRIORITY_OPTIONS}
        error={errors.priority?.message}
        {...register('priority')}
      />
    </ModuleFormShell>
  )
}
