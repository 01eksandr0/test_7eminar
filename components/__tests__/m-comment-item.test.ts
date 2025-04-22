import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MCommentItem from '../m-comment-item.vue'

const MDateStub = {
  name: 'MDate',
  props: ['date'],
  template: '<span>{{ date }}</span>'
}

describe('MCommentItem', () => {
  const mockComment = {
    id: 1,
    author: 'John Doe',
    date: '2024-03-20T10:00:00',
    text: 'This is a test comment',
    newsId: 1
  }

  const mountOptions = {
    props: {
      comment: mockComment
    },
    global: {
      stubs: {
        MDate: MDateStub
      }
    }
  }

  it('renders author avatar with first letter', () => {
    const wrapper = mount(MCommentItem, mountOptions)
    const avatar = wrapper.find('.rounded-full')
    
    expect(avatar.exists()).toBe(true)
    expect(avatar.text()).toBe('J') 
  })

  it('renders author name correctly', () => {
    const wrapper = mount(MCommentItem, mountOptions)
    const authorName = wrapper.find('.font-medium')
    
    expect(authorName.text()).toBe(mockComment.author)
  })

  it('renders comment date', () => {
    const wrapper = mount(MCommentItem, mountOptions)
    const date = wrapper.findComponent(MDateStub)
    
    expect(date.exists()).toBe(true)
    expect(date.props('date')).toBe(mockComment.date)
  })

  it('renders comment text', () => {
    const wrapper = mount(MCommentItem, mountOptions)
    const commentText = wrapper.find('.italic p')
    
    expect(commentText.text()).toBe(mockComment.text)
  })

  it('applies correct styling classes', () => {
    const wrapper = mount(MCommentItem, mountOptions)
    
    const avatar = wrapper.find('.rounded-full')
    expect(avatar.classes()).toContain('rounded-full')
    expect(avatar.classes()).toContain('bg-white')
    expect(avatar.classes()).toContain('h-[32px]')
    expect(avatar.classes()).toContain('w-[32px]')
    
    const authorName = wrapper.find('.font-medium')
    expect(authorName.classes()).toContain('text-[13px]')
    
    const date = wrapper.find('.text-gray-500')
    expect(date.classes()).toContain('text-[13px]')
  })
}) 