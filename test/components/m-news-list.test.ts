import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MNewsList from '../../components/m-news-list.vue'
import type { INewsItem } from '../../types/news'

describe('MNewsList', () => {
  it('renders news items correctly', () => {
    const items: INewsItem[] = [
      {
        id: 1,
        title: 'Test News 1',
        date: '2024-04-21',
        summary: 'Test Summary 1',
        content: 'Test Content 1'
      },
      {
        id: 2,
        title: 'Test News 2',
        date: '2024-04-21',
        summary: 'Test Summary 2',
        content: 'Test Content 2'
      }
    ]

    const wrapper = mount(MNewsList, {
      props: {
        items
      }
    })

    const newsItems = wrapper.findAll('li')
    expect(newsItems).toHaveLength(2)
  })

  it('handles empty items array', () => {
    const wrapper = mount(MNewsList, {
      props: {
        items: []
      }
    })

    const newsItems = wrapper.findAll('li')
    expect(newsItems).toHaveLength(0)
  })

  it('renders with correct layout classes', () => {
    const wrapper = mount(MNewsList, {
      props: {
        items: []
      }
    })

    expect(wrapper.find('section').classes()).toContain('flex')
    expect(wrapper.find('section').classes()).toContain('flex-col')
    expect(wrapper.find('div').classes()).toContain('max-w-[1440px]')
  })
}) 