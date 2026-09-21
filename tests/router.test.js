import { beforeEach, describe, expect, it } from 'vitest'
import { getActiveVenueId, setActiveVenue } from '../src/router'

describe('active venue state', () => {
  beforeEach(() => localStorage.clear())

  it('defaults to song', () => expect(getActiveVenueId()).toBe('song'))

  it('persists the selected venue while visiting profile', () => {
    setActiveVenue('qianwei')
    expect(getActiveVenueId()).toBe('qianwei')
  })

  it('rejects an unknown venue', () => {
    setActiveVenue('missing')
    expect(getActiveVenueId()).toBe('song')
  })
})
