import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BottomNav from '../src/components/BottomNav.vue'

describe('BottomNav', () => {
  it('uses the original active-state artwork for the selected item', () => {
    const wrapper = mount(BottomNav, {
      props: { active: 'home', venueId: 'song' },
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    })

    expect(wrapper.findAll('.nav-icon')[0].attributes('style')).toContain('nav-home-active.png')
  })
})
