import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { completeBasicInfo, completeProjectDetails } from '../model/fixtures'
import { resourcesApi } from './resourcesApi'

const fetchMock = vi.fn<typeof fetch>()

const lastRequest = () => {
  const [input, init] = fetchMock.mock.lastCall ?? []
  return { url: new URL(String(input), 'http://localhost'), init }
}

beforeEach(() => {
  fetchMock.mockImplementation(async () => Response.json({}))
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
  fetchMock.mockReset()
})

describe('resourcesApi.list', () => {
  it('sends only the provided query params', async () => {
    await resourcesApi.list({ page: 2, status: 'draft', sortOrder: 'asc' })

    const { url } = lastRequest()
    expect(url.pathname).toBe('/api/resources')
    expect(Object.fromEntries(url.searchParams)).toEqual({
      page: '2',
      status: 'draft',
      sortOrder: 'asc',
    })
  })

  it('escapes the name filter so the backend matches it literally', async () => {
    await resourcesApi.list({ name: '  alpha (v2)  ' })

    expect(lastRequest().url.searchParams.get('name')).toBe('alpha \\(v2\\)')
  })

  it('omits a blank name filter', async () => {
    await resourcesApi.list({ name: '   ' })

    expect(lastRequest().url.search).toBe('')
  })
})

describe('resourcesApi.updateModule', () => {
  it.each([
    { moduleKey: 'basicInfo', endpoint: 'basic-info', data: completeBasicInfo },
    {
      moduleKey: 'projectDetails',
      endpoint: 'project-details',
      data: completeProjectDetails,
    },
  ] as const)(
    'patches $endpoint with the whole module',
    async ({ moduleKey, endpoint, data }) => {
      await resourcesApi.updateModule(7, moduleKey, data)

      const { url, init } = lastRequest()
      expect(url.pathname).toBe(`/api/resources/7/${endpoint}`)
      expect(init).toMatchObject({ method: 'PATCH', body: JSON.stringify(data) })
    },
  )
})
