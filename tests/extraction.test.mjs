import test from 'node:test'
import assert from 'node:assert/strict'
import {
  SOURCE_FILES,
  REMOTE_ASSETS,
  extractCssDataUrlRule,
  extractDataUrlModule,
} from '../scripts/extract-original-assets.mjs'

test('source manifest contains every inspected page bundle', () => {
  assert.deepEqual(
    SOURCE_FILES.map((entry) => entry.output),
    [
      'index.html',
      'css/app.css',
      'js/app.js',
      'js/chunk-0.js',
      'js/chunk-1.js',
      'js/chunk-2.js',
      'js/chunk-3.js',
      'js/chunk-19.js',
      'js/chunk-105.js',
      'js/chunk-106.js',
      'js/chunk-132.js',
    ],
  )
})

test('runtime asset manifest contains both venues, original navigation, and all six source sport images', () => {
  const names = new Set(REMOTE_ASSETS.map((entry) => entry.output))
  for (const expected of [
    'logo.png',
    'venue-song.png',
    'venue-qianwei.jpg',
    'nav-home.png',
    'nav-reserve.png',
    'nav-profile.png',
    'sport-badminton.png',
    'sport-song-table-tennis.jpg',
    'sport-qianwei-table-tennis.png',
    'sport-pickleball.png',
    'sport-tennis.jpg',
    'sport-volleyball.jpg',
    'entry-code-ticket.png',
  ]) assert.equal(names.has(expected), true, expected)
})

test('embedded module extraction rejects a missing module', () => {
  assert.throws(
    () => extractDataUrlModule('webpackJsonp([])', 'ZR4u'),
    /Missing embedded asset module ZR4u/,
  )
})

test('extracts a base64 image from one scoped CSS rule', () => {
  const css = '.active[data-v-test]{background-image:url(data:image/png;base64,AA==)!important}'
  const asset = extractCssDataUrlRule(css, '.active[data-v-test]')
  assert.equal(asset.extension, 'png')
  assert.deepEqual(asset.bytes, Buffer.from([0]))
})
