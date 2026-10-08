import { describe, expect, it } from 'vitest'
import {
  buildResource,
  completeBasicInfo,
  completeProjectDetails,
  emptyBasicInfo,
  emptyProjectDetails,
} from './fixtures'
import {
  canProvision,
  isBasicInfoComplete,
  isProjectDetailsComplete,
  isProjectDetailsLocked,
} from './rules'
import type { BasicInfo } from './types'

describe('isBasicInfoComplete', () => {
  it('is true when every field is filled', () => {
    expect(isBasicInfoComplete(completeBasicInfo)).toBe(true)
  })

  it.each(Object.keys(completeBasicInfo) as (keyof BasicInfo)[])(
    'is false when %s is empty',
    (field) => {
      expect(isBasicInfoComplete({ ...completeBasicInfo, [field]: '' })).toBe(false)
    },
  )
})

describe('isProjectDetailsComplete', () => {
  it('is true when every field is filled and a team member is selected', () => {
    expect(isProjectDetailsComplete(completeProjectDetails)).toBe(true)
  })

  it.each(['projectName', 'budget', 'category'] as const)(
    'is false when %s is empty',
    (field) => {
      expect(isProjectDetailsComplete({ ...completeProjectDetails, [field]: '' })).toBe(
        false,
      )
    },
  )

  it('is false without team members', () => {
    expect(isProjectDetailsComplete({ ...completeProjectDetails, options: [] })).toBe(
      false,
    )
  })
})

describe('isProjectDetailsLocked', () => {
  it('locks Project Details of a draft until Basic Info is complete', () => {
    expect(isProjectDetailsLocked(buildResource())).toBe(true)
  })

  it('unlocks Project Details of a draft with complete Basic Info', () => {
    expect(isProjectDetailsLocked(buildResource({ basicInfo: completeBasicInfo }))).toBe(
      false,
    )
  })

  it('never locks Project Details of a completed resource', () => {
    expect(isProjectDetailsLocked(buildResource({ status: 'completed' }))).toBe(false)
  })
})

describe('canProvision', () => {
  const readyDraft = buildResource({
    basicInfo: completeBasicInfo,
    projectDetails: completeProjectDetails,
  })

  it('allows provisioning a draft with both modules complete', () => {
    expect(canProvision(readyDraft)).toBe(true)
  })

  it('rejects a draft with incomplete Basic Info', () => {
    expect(canProvision({ ...readyDraft, basicInfo: emptyBasicInfo })).toBe(false)
  })

  it('rejects a draft with incomplete Project Details', () => {
    expect(canProvision({ ...readyDraft, projectDetails: emptyProjectDetails })).toBe(
      false,
    )
  })

  it('rejects re-provisioning a completed resource', () => {
    expect(canProvision({ ...readyDraft, status: 'completed' })).toBe(false)
  })
})
