import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Card, Input } from '../../../design-system'
import { useCreateResource } from '../api/resourceMutations'
import { createResourceSchema, NAME_MAX_LENGTH } from '../model/schemas'
import { resourcePaths } from '../paths'

// The backend reports duplicates using its field name; show a friendlier message.
const DUPLICATE_NAME_ERROR = 'resourceName must be unique'

export function CreateResourceForm() {
  const navigate = useNavigate()
  const createResource = useCreateResource()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createResourceSchema),
    defaultValues: { resourceName: '' },
  })

  const onSubmit = handleSubmit(({ resourceName }) =>
    createResource.mutate(resourceName, {
      onSuccess: ({ resourceId }) => navigate(resourcePaths.overview(resourceId)),
      onError: ({ message }) =>
        setError('resourceName', {
          message:
            message === DUPLICATE_NAME_ERROR
              ? 'A resource with this name already exists'
              : message,
        }),
    }),
  )

  return (
    <Card>
      <h2>New resource</h2>
      <Form onSubmit={onSubmit}>
        <Input
          label="Resource name"
          placeholder="e.g. Onboarding Portal"
          helperText="Letters, numbers, spaces and hyphens. The name cannot be changed later."
          maxLength={NAME_MAX_LENGTH}
          error={errors.resourceName?.message}
          {...register('resourceName')}
        />
        <div>
          <Button type="submit" disabled={createResource.isPending}>
            {createResource.isPending ? 'Creating…' : 'Create resource'}
          </Button>
        </div>
      </Form>
    </Card>
  )
}

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`
