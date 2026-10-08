import { describe, expect, it } from 'vitest'
import {
  buildResource,
  completeBasicInfo,
  completeProjectDetails,
  emptyBasicInfo,
  emptyProjectDetails,
} from './fixtures'
import { getModuleProgress, getModuleState, RESOURCE_MODULES } from './modules'

const [basicInfoModule, projectDetailsModule] = RESOURCE_MODULES

describe('getModuleProgress', () => {
  it.each([
    [0, emptyBasicInfo, emptyProjectDetails],
    [1, completeBasicInfo, emptyProjectDetails],
    [2, completeBasicInfo, completeProjectDetails],
  ])('counts %i of 2 modules as completed', (completed, basicInfo, projectDetails) => {
    expect(getModuleProgress(buildResource({ basicInfo, projectDetails }))).toEqual({
      completed,
      total: 2,
    })
  })
})

describe('getModuleState', () => {
  it('reports a new draft as Basic Info not started and Project Details locked', () => {
    const resource = buildResource()

    expect(getModuleState(resource, basicInfoModule)).toBe('notStarted')
    expect(getModuleState(resource, projectDetailsModule)).toBe('locked')
  })

  it('unlocks Project Details once Basic Info is completed', () => {
    const resource = buildResource({ basicInfo: completeBasicInfo })

    expect(getModuleState(resource, basicInfoModule)).toBe('completed')
    expect(getModuleState(resource, projectDetailsModule)).toBe('notStarted')
  })

  it('reports both modules of a completed resource as completed', () => {
    const resource = buildResource({
      status: 'completed',
      basicInfo: completeBasicInfo,
      projectDetails: completeProjectDetails,
    })

    expect(RESOURCE_MODULES.map((module) => getModuleState(resource, module))).toEqual([
      'completed',
      'completed',
    ])
  })
})
