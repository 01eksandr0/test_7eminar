import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MCommentsList from '../../components/m-comments-list.vue'
import { createPinia, setActivePinia } from 'pinia'
import type { IComment } from '../../types/comment'

// Mock the comments store
const mockCommentsStore = {
  addComment: vi.fn()
}

vi.mock('../../stores/comments', () => ({
  default: () => mockCommentsStore
}))

describe('MCommentsList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders comments correctly', () => {
    const comments: IComment[] = [
      { 
        id: 1, 
        text: 'Test comment 1', 
        newsId: 1,
        author: 'Test User',
        date: '2024-04-21'
      },
      { 
        id: 2, 
        text: 'Test comment 2', 
        newsId: 1,
        author: 'Test User 2',
        date: '2024-04-21'
      }
    ]

    const wrapper = mount(MCommentsList, {
      props: {
        comments,
        newsId: 1
      }
    })

    const commentItems = wrapper.findAll('li')
    expect(commentItems).toHaveLength(2)
  })

  it('handles empty comments array', () => {
    const wrapper = mount(MCommentsList, {
      props: {
        comments: [],
        newsId: 1
      }
    })

    const commentItems = wrapper.findAll('li')
    expect(commentItems).toHaveLength(0)
  })

  it('sets up WebSocket connection on mount', () => {
    const mockWebSocket = vi.fn()
    // @ts-ignore - mocking WebSocket
    global.WebSocket = mockWebSocket

    mount(MCommentsList, {
      props: {
        comments: [],
        newsId: 1
      }
    })

    expect(mockWebSocket).toHaveBeenCalled()
  })

  it('handles WebSocket messages correctly', () => {
    const mockWebSocket = {
      onmessage: null as ((event: { data: string }) => void) | null,
      onopen: null,
      onerror: null,
      onclose: null,
      close: vi.fn()
    }
    // @ts-ignore - mocking WebSocket
    global.WebSocket = vi.fn(() => mockWebSocket)

    mount(MCommentsList, {
      props: {
        comments: [],
        newsId: 1
      }
    })

    // Simulate WebSocket message
    const newComment: IComment = {
      id: 3,
      text: 'New comment',
      newsId: 1,
      author: 'Test User',
      date: '2024-04-21'
    }
    if (mockWebSocket.onmessage) {
      mockWebSocket.onmessage({ data: JSON.stringify(newComment) })
    }

    expect(mockCommentsStore.addComment).toHaveBeenCalledWith(newComment)
  })
}) 