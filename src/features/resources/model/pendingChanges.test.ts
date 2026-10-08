import { describe, expect, it } from 'vitest'
import { buildResource, completeBasicInfo, completeProjectDetails } from './fixtures'
import {
  buildReplacePayload,
  getModuleChanges,
  pendingChangesReducer,
  type PendingChangesState,
} from './pendingChanges'
import type { ModuleUpdate } from './types'

const resource = buildResource({
  _id: 'resource-a',
  status: 'completed',
  basicInfo: completeBasicInfo,
  projectDetails: completeProjectDetails,
})

const editedBasicInfo = { ...completeBasicInfo, owner: 'John Roe' }
const editedProjectDetails = { ...completeProjectDetails, budget: '2000' }

const stage = (state: PendingChangesState, update: ModuleUpdate) =>
  pendingChangesReducer(state, { type: 'stage', resource, update })

describe('pendingChangesReducer', () => {
  it('buffers edited modules per resource', () => {
    const state = stage(stage({}, { moduleKey: 'basicInfo', data: editedBasicInfo }), {
      moduleKey: 'projectDetails',
      data: editedProjectDetails,
    })

    expect(state).toEqual({
      'resource-a': { basicInfo: editedBasicInfo, projectDetails: editedProjectDetails },
    })
  })

  it('drops a module whose edits match the saved data again', () => {
    const state = stage(
      {
        'resource-a': {
          basicInfo: editedBasicInfo,
          projectDetails: editedProjectDetails,
        },
      },
      { moduleKey: 'basicInfo', data: completeBasicInfo },
    )

    expect(state).toEqual({ 'resource-a': { projectDetails: editedProjectDetails } })
  })

  it('removes the resource entry when nothing is left to submit', () => {
    const state = stage(
      { 'resource-a': { basicInfo: editedBasicInfo } },
      { moduleKey: 'basicInfo', data: completeBasicInfo },
    )

    expect(state).toEqual({})
  })

  it('discards the changes of one resource only', () => {
    const state = {
      'resource-a': { basicInfo: editedBasicInfo },
      'resource-b': { projectDetails: editedProjectDetails },
    }

    expect(
      pendingChangesReducer(state, { type: 'discard', resourceKey: 'resource-a' }),
    ).toEqual({ 'resource-b': { projectDetails: editedProjectDetails } })
  })
})

describe('getModuleChanges', () => {
  it('lists changed fields per module in workflow order', () => {
    const moduleChanges = getModuleChanges(resource, {
      projectDetails: editedProjectDetails,
      basicInfo: editedBasicInfo,
    })

    expect(
      moduleChanges.map(({ moduleKey, fields }) => [moduleKey, fields.length]),
    ).toEqual([
      ['basicInfo', 1],
      ['projectDetails', 1],
    ])
  })
})

describe('buildReplacePayload', () => {
  it('merges buffered modules with saved data and keeps the name', () => {
    expect(
      buildReplacePayload(resource, { projectDetails: editedProjectDetails }),
    ).toEqual({
      name: resource.name,
      basicInfo: completeBasicInfo,
      projectDetails: editedProjectDetails,
    })
  })
})
