import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import VenueHomeView from '../src/views/VenueHomeView.vue'

describe('VenueHomeView', () => {
  it('renders the requested venue hierarchy', () => {
    const wrapper = mount(VenueHomeView, {
      props: { venueId: 'qianwei' },
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
          BottomNav: true,
        },
      },
    })
    expect(wrapper.get('h1').text()).toBe('前卫体育馆')
    expect(wrapper.text()).toContain('查看其他校区')
    expect(wrapper.text()).toContain('场馆安排')
    expect(wrapper.text()).toContain('在线功能')
    wrapper.unmount()
  })

  it('shows locally bundled images', () => {
    const wrapper = mount(VenueHomeView, {
      props: { venueId: 'song' },
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
          BottomNav: true,
        },
      },
    })
    for (const image of wrapper.findAll('img')) {
      expect(image.attributes('src')).not.toContain('ss.jlu.edu.cn')
    }
    wrapper.unmount()
  })

  it('switches the venue image when a carousel dot is selected', async () => {
    const wrapper = mount(VenueHomeView, {
      props: { venueId: 'qianwei' },
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
          BottomNav: true,
        },
      },
    })

    expect(wrapper.get('.hero').attributes('src')).toContain('qianwei-banner-1.jpg')
    await wrapper.findAll('[data-slide]')[1].trigger('click')
    expect(wrapper.get('.hero').attributes('src')).toContain('qianwei-banner-2.png')
    wrapper.unmount()
  })
})
