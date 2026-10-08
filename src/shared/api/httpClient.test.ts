import { afterEach, describe, expect, it, vi } from 'vitest'
import { API_URL } from '../config/env'
import { ApiError, request } from './httpClient'

const stubFetch = (implementation: () => Promise<Response>) => {
  const fetchMock = vi.fn<typeof fetch>(implementation)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('request', () => {
  it('sends a JSON body and returns the parsed response', async () => {
    const fetchMock = stubFetch(async () => Response.json({ resourceId: 1 }))

    await expect(
      request('/api/resources', { method: 'POST', body: { resourceName: 'Alpha' } }),
    ).resolves.toEqual({ resourceId: 1 })
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/api/resources`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceName: 'Alpha' }),
      }),
    )
  })

  it('throws an ApiError carrying the backend message', async () => {
    stubFetch(async () =>
      Response.json({ message: 'Resource not found' }, { status: 404 }),
    )

    await expect(request('/api/resources/9')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      message: 'Resource not found',
    })
  })

  it('falls back to a generic message when the error body is not JSON', async () => {
    stubFetch(async () => new Response('Bad gateway', { status: 502 }))

    await expect(request('/api/resources')).rejects.toMatchObject({
      status: 502,
      message: 'Request failed with status 502',
    })
  })

  it('turns network failures into a readable ApiError', async () => {
    stubFetch(async () => {
      throw new TypeError('Failed to fetch')
    })

    await expect(request('/api/resources')).rejects.toMatchObject({
      status: 0,
      message: 'Unable to reach the server. Check your connection and try again.',
    })
  })
})

describe('ApiError', () => {
  it.each([
    [400, true],
    [404, true],
    [500, false],
    [0, false],
  ])('treats status %i as a client error: %s', (status, expected) => {
    expect(new ApiError(status, 'message').isClientError).toBe(expected)
  })
})
