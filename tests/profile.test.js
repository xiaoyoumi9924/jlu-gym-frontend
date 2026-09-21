import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ProfileView from '../src/views/ProfileView.vue'

const mountProfile = () => mount(ProfileView, {
  global: { stubs: { BottomNav: true } },
})

describe('ProfileView', () => {
  it('shows the requested name and student number', () => {
    const wrapper = mountProfile()
    expect(wrapper.get('[data-profile-name]').text()).toBe('李子涵')
    expect(wrapper.get('[data-student-id]').text()).toContain('87240433')
    expect(wrapper.text()).not.toContain('王科技')
    expect(wrapper.text()).not.toContain('87240227')
    wrapper.unmount()
  })

  it('shows the four screenshot assistant entries', () => {
    const wrapper = mountProfile()
    for (const label of ['我的预约', '我的邀请', '购票记录', '敬请期待...']) {
      expect(wrapper.text()).toContain(label)
    }
    wrapper.unmount()
  })
})
