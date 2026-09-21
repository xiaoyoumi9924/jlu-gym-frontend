import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('document metadata', () => {
  it('declares a bundled favicon instead of triggering a missing favicon request', () => {
    const html = readFileSync('index.html', 'utf8')
    expect(html).toContain('rel="icon"')
    expect(html).toContain('/src/assets/original/logo.png')
  })
})
