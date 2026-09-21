import { describe, expect, it } from 'vitest'
import { getVenue, profile, venues } from '../src/data/venues'

describe('venue data', () => {
  it('maps each venue to the screenshot sports', () => {
    expect(venues.song.sports.map((sport) => sport.name)).toEqual(['乒乓球', '网球', '排球'])
    expect(venues.qianwei.sports.map((sport) => sport.name)).toEqual(['羽毛球', '乒乓球', '匹克球'])
  })

  it('starts the Song carousel with the arena shown in the reference', () => {
    expect(venues.song.banners[0]).toContain('song-banner-2.jpg')
  })

  it('falls back for an unknown venue id', () => {
    expect(getVenue('missing')).toBe(venues.song)
  })

  it('uses the requested coursework identity', () => {
    expect(profile).toMatchObject({ name: '李子涵', studentId: '87240433', sex: '男' })
  })
})
