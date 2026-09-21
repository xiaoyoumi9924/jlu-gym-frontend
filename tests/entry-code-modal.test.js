import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import EntryCodeModal from '../src/components/EntryCodeModal.vue'

describe('EntryCodeModal', () => {
  test('renders the entry ticket at the same compact scale as the real page', () => {
    const wrapper = mount(EntryCodeModal, {
      props: { courtLabel: '羽毛球8' },
      attachTo: document.body,
    })

    const ticketStyle = wrapper.get('.entry-ticket').element.style
    const qrStyle = wrapper.get('.entry-qr').element.style

    expect(ticketStyle.width).toBe('240px')
    expect(ticketStyle.height).toBe('300px')
    expect(qrStyle.width).toBe('150px')
    expect(qrStyle.height).toBe('150px')

    wrapper.unmount()
  })
})
