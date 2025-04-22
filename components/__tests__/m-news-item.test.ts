import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MNewsItem from '../m-news-item.vue'

const NuxtLinkStub = {
  name: 'NuxtLink',
  props: ['to'],
  template: '<a :href="to"><slot /></a>'
}

describe('MNewsItem', () => {
  const mockNewsItem = {
    id: 1,
    title: 'Test News Title',
    date: '2024-03-20',
    summary: 'This is a test summary of the news article',
    content: 'Full content of the news article'
  }

  const mountOptions = {
    props: {
      item: mockNewsItem
    },
    global: {
      stubs: {
        NuxtLink: NuxtLinkStub
      }
    }
  }

  it('renders news item correctly', () => {
    const wrapper = mount(MNewsItem, mountOptions)

    expect(wrapper.find('h3').text()).toBe(mockNewsItem.title)

    expect(wrapper.find('.text-gray-500').text()).toBe(mockNewsItem.date)

    expect(wrapper.find('p').text().trim()).toBe(mockNewsItem.summary)
  })

  it('renders correct link to news detail page', () => {
    const wrapper = mount(MNewsItem, mountOptions)

    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe(`/news/${mockNewsItem.id}`)
  })

  it('applies correct styling classes', () => {
    const wrapper = mount(MNewsItem, mountOptions)

    const link = wrapper.find('a')
    expect(link.classes()).toContain('border')
    expect(link.classes()).toContain('rounded-md')
    expect(link.classes()).toContain('bg-white')
    expect(link.classes()).toContain('cursor-pointer')
  })
}) 