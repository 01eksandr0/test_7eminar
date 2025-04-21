import { vi } from 'vitest'
import { ref } from 'vue'

interface User {
  email: string
}

// Create mock functions
const useRouter = vi.fn(() => ({
  push: vi.fn()
}))

const useAuth = vi.fn(() => ({
  user: ref<User | null>(null),
  loading: ref(false),
  checkAuth: vi.fn()
}))

const useFetch = vi.fn()
const $fetch = vi.fn()

// Mock Nuxt composables
vi.mock('#app', () => ({
  useRouter,
  useAuth,
  useFetch,
  $fetch
}))

// Mock Pinia
vi.mock('pinia', () => ({
  defineStore: vi.fn((id, fn) => fn),
  createPinia: vi.fn(() => ({
    install: vi.fn()
  })),
  setActivePinia: vi.fn()
}))

// Mock NuxtLink component
vi.mock('vue-router', () => ({
  RouterLink: {
    name: 'RouterLink',
    props: ['to'],
    template: '<a :href="to"><slot /></a>'
  }
}))

// Export mocks for use in tests
export { useRouter, useAuth, useFetch, $fetch }
export type { User } 