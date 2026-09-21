const storageKey = 'jlu-gym-mock-booking'

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

const getStorage = () => globalThis.sessionStorage
const two = (value) => String(value).padStart(2, '0')

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

  getStorage().setItem(storageKey, JSON.stringify(booking))
  return booking
}

export function getMockBooking() {
  const raw = getStorage().getItem(storageKey)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function cancelMockBooking() {
  const booking = getMockBooking()
  if (!booking) return null
  const cancelled = { ...booking, status: 'cancelled' }
  getStorage().setItem(storageKey, JSON.stringify(cancelled))
  return cancelled
}

export function clearMockBooking() {
  getStorage().removeItem(storageKey)
}
