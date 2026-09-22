const storageKey = 'jlu-gym-mock-bookings'
const legacyStorageKey = 'jlu-gym-mock-booking'

export const timeSlots = [
  '06:00–07:30',
  '07:30–10:00',
  '10:00–12:00',
  '12:00–13:00',
  '13:00–15:30',
  '15:30–17:30',
  '17:30–19:30',
  '19:30–21:30',
]

const getStorage = () => globalThis.localStorage
const two = (value) => String(value).padStart(2, '0')

function isBookingRecord(value) {
  if (!value || Array.isArray(value) || typeof value !== 'object') return false
  const stringFields = [
    'venueId',
    'sportName',
    'date',
    'timeSlot',
    'courtNumber',
    'startTime',
    'endTime',
    'orderNo',
    'purchaseTime',
    'status',
  ]
  return stringFields.every((field) => typeof value[field] === 'string' && value[field])
    && Number.isFinite(value.quantity)
    && ['active', 'cancelled'].includes(value.status)
}

function parseBookingList(raw) {
  if (raw === null) return null
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.every(isBookingRecord) ? parsed : []
  } catch {
    return []
  }
}

function migrateLegacyBooking() {
  const legacyStorage = globalThis.sessionStorage
  const raw = legacyStorage?.getItem(legacyStorageKey)
  if (!raw) return []

  try {
    const booking = JSON.parse(raw)
    if (!isBookingRecord(booking)) return []
    const bookings = [booking]
    getStorage().setItem(storageKey, JSON.stringify(bookings))
    legacyStorage.removeItem(legacyStorageKey)
    return bookings
  } catch {
    return []
  }
}

function formatPurchaseTime(date = new Date()) {
  return `${date.getFullYear()}-${two(date.getMonth() + 1)}-${two(date.getDate())} ${two(date.getHours())}:${two(date.getMinutes())}`
}

function createOrderNo(date = new Date()) {
  const stamp = `${date.getFullYear()}${two(date.getMonth() + 1)}${two(date.getDate())}${two(date.getHours())}${two(date.getMinutes())}${two(date.getSeconds())}`
  const tail = String(Math.floor(Math.random() * 1e10)).padStart(10, '0')
  return `0002${stamp}${tail}`
}

export function saveMockBooking(input) {
  if (!input?.venueId || !input?.sportName || !input?.date || !input?.courtNumber) {
    throw new Error('预约信息不完整')
  }
  if (!timeSlots.includes(input.timeSlot)) {
    throw new Error('预约时间段无效')
  }

  const [startTime, endTime] = input.timeSlot.split('–')
  const now = new Date()
  const booking = {
    venueId: input.venueId,
    sportName: input.sportName,
    date: input.date,
    timeSlot: input.timeSlot,
    courtNumber: String(input.courtNumber),
    startTime,
    endTime,
    orderNo: createOrderNo(now),
    purchaseTime: formatPurchaseTime(now),
    quantity: 1,
    status: 'active',
  }

  const bookings = getMockBookings()
  getStorage().setItem(storageKey, JSON.stringify([...bookings, booking]))
  return booking
}

export function getMockBookings() {
  const raw = getStorage().getItem(storageKey)
  const bookings = parseBookingList(raw)
  return bookings === null ? migrateLegacyBooking() : bookings
}

export function getMockBooking(orderNo) {
  if (!orderNo) return null
  return getMockBookings().find((booking) => booking.orderNo === orderNo) ?? null
}

export function cancelMockBooking(orderNo) {
  const bookings = getMockBookings()
  const targetIndex = bookings.findIndex((booking) => booking.orderNo === orderNo)
  if (targetIndex < 0) return null

  const cancelled = { ...bookings[targetIndex], status: 'cancelled' }
  const updated = bookings.map((booking, index) => index === targetIndex ? cancelled : booking)
  getStorage().setItem(storageKey, JSON.stringify(updated))
  return cancelled
}
