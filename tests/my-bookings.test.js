import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeEach, describe, expect, it } from 'vitest'
import BookingDetailView from '../src/views/BookingDetailView.vue'
import MyBookingsView from '../src/views/MyBookingsView.vue'

const bookings = [
  {
    venueId: 'qianwei',
    sportName: '羽毛球',
    date: '2026-09-22',
    timeSlot: '17:30–19:30',
    courtNumber: '4',
    startTime: '17:30',
    endTime: '19:30',
    orderNo: '0002202609221200000000000001',
    purchaseTime: '2026-09-22 12:00',
    quantity: 1,
    status: 'active',
  },
  {
    venueId: 'song',
    sportName: '羽毛球',
    date: '2026-09-23',
    timeSlot: '07:30–10:00',
    courtNumber: '8',
    startTime: '07:30',
    endTime: '10:00',
    orderNo: '0002202609231200000000000002',
    purchaseTime: '2026-09-23 12:00',
    quantity: 1,
    status: 'active',
  },
]

async function mountAt(path) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/my-bookings', component: MyBookingsView },
      { path: '/my-bookings/detail/:orderNo', component: BookingDetailView },
      { path: '/profile', component: { template: '<div>个人中心</div>' } },
    ],
  })
  await router.push(path)
  await router.isReady()
  const wrapper = mount({ template: '<router-view />' }, { global: { plugins: [router] } })
  return { router, wrapper }
}

describe('multiple saved bookings', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    localStorage.setItem('jlu-gym-mock-bookings', JSON.stringify(bookings))
  })

  it('shows every appointment and cancels only the selected card', async () => {
    const { wrapper } = await mountAt('/my-bookings')

    expect(wrapper.findAll('[data-booking-card]')).toHaveLength(2)
    const firstCancel = wrapper.findAll('[data-booking-card]')[0]
      .findAll('button')
      .find((button) => button.text() === '取消预约')
    await firstCancel.trigger('click')

    const cards = wrapper.findAll('[data-booking-card]')
    expect(cards[0].text()).toContain('已取消')
    expect(cards[1].text()).not.toContain('已取消')
    wrapper.unmount()
  })

  it('opens details for the appointment whose button was selected', async () => {
    const { router, wrapper } = await mountAt('/my-bookings')
    const secondDetail = wrapper.findAll('[data-booking-card]')[1]
      .findAll('button')
      .find((button) => button.text() === '查看详情')

    await secondDetail.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.fullPath).toBe(`/my-bookings/detail/${bookings[1].orderNo}`)
    expect(wrapper.text()).toContain('羽毛球8')
    wrapper.unmount()
  })

  it('shows the requested appointment and an empty state for an unknown order', async () => {
    const known = await mountAt(`/my-bookings/detail/${bookings[0].orderNo}`)
    expect(known.wrapper.text()).toContain('羽毛球4')
    known.wrapper.unmount()

    const missing = await mountAt('/my-bookings/detail/missing-order')
    expect(missing.wrapper.get('.empty-detail').text()).toBe('暂无预约')
    expect(missing.wrapper.find('.detail-card').exists()).toBe(false)
    missing.wrapper.unmount()
  })
})
