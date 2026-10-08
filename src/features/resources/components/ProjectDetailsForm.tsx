import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { CheckboxGroup, Input, Select } from '../../../design-system'
import { toSelectOptions } from '../../../shared/lib/toSelectOptions'
import { useModuleSubmit } from '../hooks/useModuleSubmit'
import { CATEGORIES, TEAM_MEMBERS } from '../model/constants'
import { CATEGORY_LABELS, PROJECT_DETAILS_FIELD_LABELS as LABELS } from '../model/labels'
import { PROJECT_DETAILS_MODULE } from '../model/modules'
import { NAME_MAX_LENGTH, projectDetailsSchema } from '../model/schemas'
import type { Resource } from '../model/types'
import { resourcePaths } from '../paths'
import { ModuleFormShell } from './ModuleFormShell'

const CATEGORY_OPTIONS = toSelectOptions(CATEGORIES, CATEGORY_LABELS, 'Select a category')
const TEAM_MEMBER_OPTIONS = [...TEAM_MEMBERS]

interface ProjectDetailsFormProps {
  resource: Resource
}

export function ProjectDetailsForm({ resource }: ProjectDetailsFormProps) {
  const navigate = useNavigate()
  const { submit, isSubmitting, error } = useModuleSubmit(resource)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: resource.projectDetails,
  })

  return (
    <ModuleFormShell
      module={PROJECT_DETAILS_MODULE}
      submitLabel="Save Project Details"
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={handleSubmit((data) => submit({ moduleKey: 'projectDetails', data }))}
      onCancel={() => navigate(resourcePaths.overview(resource.resourceId))}
    >
      <Input
        label={LABELS.projectName}
        maxLength={NAME_MAX_LENGTH}
        helperText="Letters, numbers, spaces and hyphens."
        error={errors.projectName?.message}
        {...register('projectName')}
      />
      <Input
        label={LABELS.budget}
        inputMode="numeric"
        helperText="Whole number without separators, e.g. 25000."
        error={errors.budget?.message}
        {...register('budget')}
      />
      <Select
        label={LABELS.category}
        options={CATEGORY_OPTIONS}
        error={errors.category?.message}
        {...register('category')}
      />
      <Controller
        control={control}
        name="options"
        render={({ field, fieldState }) => (
          <CheckboxGroup
            label={LABELS.options}
            tooltip="Select all roles required for this project."
            options={TEAM_MEMBER_OPTIONS}
            value={field.value}
            // Keep the canonical order no matter in which order boxes are ticked.
            onChange={(next) =>
              field.onChange(TEAM_MEMBERS.filter((member) => next.includes(member)))
            }
            helper="Pick all needed roles."
            error={fieldState.error?.message}
          />
        )}
      />
    </ModuleFormShell>
  )
}
