import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const modulePath = new URL('../src/data/mockBooking.js', import.meta.url)

test('mock booking module exists', () => {
  assert.equal(existsSync(modulePath), true)
})

test('mock booking state saves one booking in sessionStorage', async () => {
  const { saveMockBooking, getMockBooking, clearMockBooking, timeSlots } = await import(modulePath)
  const original = globalThis.sessionStorage
  const memory = new Map()
  globalThis.sessionStorage = {
    getItem: (key) => memory.has(key) ? memory.get(key) : null,
    setItem: (key, value) => memory.set(key, String(value)),
    removeItem: (key) => memory.delete(key),
  }

  try {
    clearMockBooking()
    const booking = saveMockBooking({
      venueId: 'qianwei',
      sportName: '羽毛球',
      date: '2026-09-22',
      timeSlot: '17:30–19:30',
      courtNumber: '4',
    })

    assert.equal(timeSlots.includes('17:30–19:30'), true)
    assert.deepEqual(getMockBooking(), booking)
    assert.equal(booking.startTime, '17:30')
    assert.equal(booking.endTime, '19:30')
  } finally {
    globalThis.sessionStorage = original
  }
})

test('venue picker exposes the logo as the single-click setup entry', () => {
  const source = readFileSync(new URL('../src/views/VenuePickerView.vue', import.meta.url), 'utf8')
  assert.match(source, /platform-logo[^>]*@click="openBookingSetup"/s)
  assert.match(source, /BookingSetupModal/)
})

test('profile links 我的预约 to a dedicated route', () => {
  const source = readFileSync(new URL('../src/views/ProfileView.vue', import.meta.url), 'utf8')
  assert.match(source, /我的预约/)
  assert.match(source, /\/my-bookings/)
})

test('router registers the my-bookings page', () => {
  const source = readFileSync(new URL('../src/router/index.js', import.meta.url), 'utf8')
  assert.match(source, /MyBookingsView/)
  assert.match(source, /path:\s*['"]\/my-bookings['"]/)
})

test('saved booking includes list metadata and can be cancelled', async () => {
  const { saveMockBooking, getMockBooking, clearMockBooking, cancelMockBooking } = await import(modulePath)
  const original = globalThis.sessionStorage
  const memory = new Map()
  globalThis.sessionStorage = {
    getItem: (key) => memory.has(key) ? memory.get(key) : null,
    setItem: (key, value) => memory.set(key, String(value)),
    removeItem: (key) => memory.delete(key),
  }

  try {
    clearMockBooking()
    const booking = saveMockBooking({
      venueId: 'qianwei',
      sportName: '羽毛球',
      date: '2026-09-22',
      timeSlot: '07:30–10:00',
      courtNumber: '8',
    })

    assert.match(booking.orderNo, /^0002\d{20,}$/)
    assert.equal(booking.quantity, 1)
    assert.equal(booking.status, 'active')
    assert.match(booking.purchaseTime, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)

    const cancelled = cancelMockBooking()
    assert.equal(cancelled.status, 'cancelled')
    assert.equal(getMockBooking().status, 'cancelled')
  } finally {
    globalThis.sessionStorage = original
  }
})

test('my bookings page mirrors the real booking list structure', () => {
  const source = readFileSync(new URL('../src/views/MyBookingsView.vue', import.meta.url), 'utf8')
  assert.match(source, />场地</)
  assert.match(source, /选择日期区间/)
  assert.match(source, /订单号/)
  assert.match(source, /购买时间/)
  assert.match(source, /查看详情/)
  assert.match(source, /取消预约/)
})

test('booking detail and fixed entry-code modal are registered', () => {
  const routerSource = readFileSync(new URL('../src/router/index.js', import.meta.url), 'utf8')
  assert.match(routerSource, /BookingDetailView/)
  assert.match(routerSource, /path:\s*['"]\/my-bookings\/detail['"]/)

  const detailUrl = new URL('../src/views/BookingDetailView.vue', import.meta.url)
  const modalUrl = new URL('../src/components/EntryCodeModal.vue', import.meta.url)
  assert.equal(existsSync(detailUrl), true)
  assert.equal(existsSync(modalUrl), true)

  const detailSource = readFileSync(detailUrl, 'utf8')
  assert.match(detailSource, /同行人/)
  assert.match(detailSource, /开始时间/)
  assert.match(detailSource, /结束时间/)
  assert.match(detailSource, /EntryCodeModal/)

  const modalSource = readFileSync(modalUrl, 'utf8')
  assert.match(modalSource, /入场码/)
  assert.match(modalSource, /fixed-entry-qr\.png/)
})

test('venue home uses faithful structured address/description/phone icons and truncation', () => {
  const source = readFileSync(new URL('../src/views/VenueHomeView.vue', import.meta.url), 'utf8')
  assert.match(source, /description-text/)
  assert.match(source, /viewBox="0 0 24 24"/)
  assert.doesNotMatch(source, />☎</)
})

test('profile assistant keeps the four real assistant actions', () => {
  const source = readFileSync(new URL('../src/views/ProfileView.vue', import.meta.url), 'utf8')
  for (const label of ['我的预约', '我的邀请', '购票记录', '敬请期待...']) {
    assert.match(source, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  }
  assert.match(source, /assistant-grid/)
})

test('profile assistant sizing matches the supplied real page reference', () => {
  const source = readFileSync(new URL('../src/views/ProfileView.vue', import.meta.url), 'utf8')
  assert.match(source, /\.assistant-card h2\s*\{[^}]*font-size:\s*24px/s)
  assert.match(source, /\.assistant-grid img\s*\{[^}]*width:\s*50px[^}]*height:\s*50px/s)
})

test('booking detail uses a lighter compact qr glyph', () => {
  const source = readFileSync(new URL('../src/views/BookingDetailView.vue', import.meta.url), 'utf8')
  assert.match(source, /class="mini-qr-glyph"/)
  assert.match(source, /\.mini-qr\s*\{[^}]*width:\s*26px[^}]*height:\s*26px/s)
  assert.doesNotMatch(source, /mini-qr[^\n]*fixed-entry-qr\.png/s)
})

test('entry code ticket stays compact on wide and mobile viewports', () => {
  const source = readFileSync(new URL('../src/components/EntryCodeModal.vue', import.meta.url), 'utf8')
  assert.match(source, /entry-code-ticket\.png/)
  assert.doesNotMatch(source, /min-height:\s*76vh/)
  assert.doesNotMatch(source, /ticket-notch/)
  assert.match(source, /align-items:\s*center/)
})

test('assistant actions center icon and label in four equal columns', () => {
  const source = readFileSync(new URL('../src/views/ProfileView.vue', import.meta.url), 'utf8')
  assert.match(source, /\.assistant-action\s*\{[^}]*display:\s*flex[^}]*flex-direction:\s*column[^}]*align-items:\s*center/s)
  assert.match(source, /\.assistant-grid span\s*\{[^}]*width:\s*100%[^}]*text-align:\s*center/s)
})


test('venue cards use the original faded three-chevron image asset', () => {
  const source = readFileSync(new URL('../src/components/VenueCard.vue', import.meta.url), 'utf8')
  assert.match(source, /venue-arrow\.png/)
  assert.match(source, /class="venue-chevron"/)
  assert.match(source, /<img[^>]*:src="venueArrow"/s)
  assert.doesNotMatch(source, /〉〉/)
})
