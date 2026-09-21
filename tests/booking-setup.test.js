import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeEach, describe, expect, it } from 'vitest'
import VenuePickerView from '../src/views/VenuePickerView.vue'

async function mountVenuePicker() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
  })
  await router.push('/')
  await router.isReady()

  return mount(VenuePickerView, {
    global: { plugins: [router] },
  })
}

async function saveDefaultBooking(wrapper) {
  await wrapper.get('.platform-logo').trigger('click')
  await wrapper.get('.booking-form').trigger('submit')
  await flushPromises()
}

describe('booking setup success feedback', () => {
  beforeEach(() => sessionStorage.clear())

  it('replaces the setup form with a dismissible success dialog after saving', async () => {
    const wrapper = await mountVenuePicker()

    await saveDefaultBooking(wrapper)

    expect(wrapper.find('.booking-modal').exists()).toBe(false)
    const success = wrapper.get('[data-save-success]')
    expect(success.attributes('role')).toBe('dialog')
    expect(success.text()).toContain('保存成功')
    expect(success.get('[data-success-confirm]').text()).toBe('确定')
    expect(success.get('[aria-label="关闭保存成功提示"]').exists()).toBe(true)

    await success.get('[data-success-confirm]').trigger('click')
    expect(wrapper.find('[data-save-success]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('allows the success dialog to be closed with its close button', async () => {
    const wrapper = await mountVenuePicker()

    await saveDefaultBooking(wrapper)
    await wrapper.get('[aria-label="关闭保存成功提示"]').trigger('click')

    expect(wrapper.find('[data-save-success]').exists()).toBe(false)
    wrapper.unmount()
  })
})
