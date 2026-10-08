import { describe, expect, it } from 'vitest'
import { parseListSearch, serializeListSearch } from './listSearch'

const parse = (query: string) => parseListSearch(new URLSearchParams(query))

describe('parseListSearch', () => {
  it('uses defaults for an empty query', () => {
    expect(parse('')).toEqual({ page: 1, status: undefined, name: '', sortOrder: 'desc' })
  })

  it('reads valid values', () => {
    expect(parse('page=3&status=completed&name=alpha&sortOrder=asc')).toEqual({
      page: 3,
      status: 'completed',
      name: 'alpha',
      sortOrder: 'asc',
    })
  })

  it('falls back to defaults for values the API would reject', () => {
    expect(parse('page=-2&status=archived&sortOrder=random')).toEqual({
      page: 1,
      status: undefined,
      name: '',
      sortOrder: 'desc',
    })
  })

  it('rejects non-integer pages', () => {
    expect(parse('page=1.5').page).toBe(1)
  })
})

describe('serializeListSearch', () => {
  it('omits default values', () => {
    expect(
      serializeListSearch({
        page: 1,
        status: undefined,
        name: '',
        sortOrder: 'desc',
      }).toString(),
    ).toBe('')
  })

  it('round-trips non-default values', () => {
    const search = {
      page: 2,
      status: 'draft',
      name: 'alpha beta',
      sortOrder: 'asc',
    } as const
    expect(parseListSearch(serializeListSearch(search))).toEqual(search)
  })
})
