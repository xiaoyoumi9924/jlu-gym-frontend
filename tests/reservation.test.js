import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ReservationView from '../src/views/ReservationView.vue'

const mountReservation = (venueId) => mount(ReservationView, {
  props: { venueId },
  global: { stubs: { BottomNav: true } },
})

describe('ReservationView', () => {
  it('renders the Song sports in source order', () => {
    const wrapper = mountReservation('song')
    expect(wrapper.findAll('[data-sport]').map((card) => card.attributes('data-sport'))).toEqual(['乒乓球', '网球', '排球'])
    wrapper.unmount()
  })

  it('renders the Qianwei sports in source order', () => {
    const wrapper = mountReservation('qianwei')
    expect(wrapper.findAll('[data-sport]').map((card) => card.attributes('data-sport'))).toEqual(['羽毛球', '乒乓球', '匹克球'])
    wrapper.unmount()
  })

  it('keeps reservation local', async () => {
    const wrapper = mountReservation('song')
    await wrapper.get('button').trigger('click')
    expect(wrapper.text()).toContain('演示页面不连接预约后台')
    wrapper.unmount()
  })
})
