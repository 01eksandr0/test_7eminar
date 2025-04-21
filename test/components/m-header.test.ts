import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MHeader from '../../components/m-header.vue'
import { ref } from 'vue'
import { useRouter, useAuth, type User } from '../setup'

describe('MHeader', () => {
  it('renders login link when user is not authenticated', () => {
    // Mock unauthenticated user
    useAuth.mockReturnValue({
      user: ref<User | null>(null),
      loading: ref(false),
      checkAuth: vi.fn()
    })

    const wrapper = mount(MHeader)
    
    const loginLink = wrapper.find('a')
    expect(loginLink.exists()).toBe(true)
    expect(loginLink.attributes('href')).toBe('/login')
  })

  it('renders user email and logout button when user is authenticated', async () => {
    // Mock authenticated user
    const mockUser = ref<User>({ email: 'test@example.com' })
    useAuth.mockReturnValue({
      user: mockUser,
      loading: ref(false),
      checkAuth: vi.fn()
    })

    const wrapper = mount(MHeader)
    
    const userEmail = wrapper.find('.text-gray-600')
    const logoutButton = wrapper.find('button')
    
    expect(userEmail.text()).toBe('test@example.com')
    expect(logoutButton.exists()).toBe(true)
    expect(logoutButton.text()).toBe('Вийти')
  })

  it('handles logout correctly', async () => {
    const mockPush = vi.fn()
    useRouter.mockReturnValue({
      push: mockPush
    })
    
    // Mock authenticated user
    const mockUser = ref<User>({ email: 'test@example.com' })
    useAuth.mockReturnValue({
      user: mockUser,
      loading: ref(false),
      checkAuth: vi.fn()
    })

    const wrapper = mount(MHeader)
    const logoutButton = wrapper.find('button')
    
    await logoutButton.trigger('click')
    
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('renders with correct layout classes', () => {
    // Mock unauthenticated user
    useAuth.mockReturnValue({
      user: ref<User | null>(null),
      loading: ref(false),
      checkAuth: vi.fn()
    })

    const wrapper = mount(MHeader)
    
    expect(wrapper.find('header').classes()).toContain('bg-white')
    expect(wrapper.find('header').classes()).toContain('flex')
    expect(wrapper.find('header').classes()).toContain('justify-between')
  })
}) 