import { describe, expect, it } from 'vitest'
import {
  buildResource,
  completeBasicInfo,
  completeProjectDetails,
  emptyBasicInfo,
} from './fixtures'
import { getChangedFields, getModuleFields } from './moduleFields'

const completedResource = buildResource({
  status: 'completed',
  basicInfo: completeBasicInfo,
  projectDetails: completeProjectDetails,
})

describe('getModuleFields', () => {
  it('keeps stored values and shows readable labels', () => {
    const priority = getModuleFields({
      moduleKey: 'basicInfo',
      data: completeBasicInfo,
    }).find(({ key }) => key === 'priority')

    expect(priority).toEqual({
      key: 'priority',
      label: 'Priority',
      value: 'high',
      display: 'High',
    })
  })

  it('formats the budget without changing the stored digits', () => {
    const budget = getModuleFields({
      moduleKey: 'projectDetails',
      data: { ...completeProjectDetails, budget: '0012500' },
    }).find(({ key }) => key === 'budget')

    expect(budget).toMatchObject({ value: '0012500', display: '12,500' })
  })

  it('leaves fields of an unsaved module empty', () => {
    const fields = getModuleFields({ moduleKey: 'basicInfo', data: emptyBasicInfo })

    expect(fields.filter(({ display }) => display === '').map(({ key }) => key)).toEqual([
      'owner',
      'email',
      'priority',
      'description',
    ])
  })
})

describe('getChangedFields', () => {
  it('returns only the edited fields with readable before and after values', () => {
    const changes = getChangedFields(completedResource, {
      moduleKey: 'basicInfo',
      data: { ...completeBasicInfo, owner: 'John Roe', priority: 'low' },
    })

    expect(changes).toEqual([
      { key: 'owner', label: 'Owner', before: 'Jane Doe', after: 'John Roe' },
      { key: 'priority', label: 'Priority', before: 'High', after: 'Low' },
    ])
  })

  it('ignores the order of team members', () => {
    const resource = buildResource({
      projectDetails: { ...completeProjectDetails, options: ['Designer', 'FE devs'] },
    })

    expect(
      getChangedFields(resource, {
        moduleKey: 'projectDetails',
        data: { ...completeProjectDetails, options: ['FE devs', 'Designer'] },
      }),
    ).toEqual([])
  })

  it('detects a changed stored value even when it looks the same', () => {
    const changes = getChangedFields(completedResource, {
      moduleKey: 'projectDetails',
      data: { ...completeProjectDetails, budget: '01000' },
    })

    expect(changes).toEqual([
      { key: 'budget', label: 'Budget', before: '1,000', after: '1,000' },
    ])
  })
})
