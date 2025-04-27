import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuth } from '~/composables/useAuth'

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}))

describe('Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Login', () => {
    it('should successfully login with correct credentials', async () => {
      const { user, loading } = useAuth()
      
      expect(loading.value).toBe(true)
      expect(user.value).toBe(null)

      global.fetch = vi.fn().mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            user: {
              id: 'user123',
              email: 'test@example.com'
            }
          })
        })
      )

      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'password'
        }
      })

      expect(user.value).toEqual({
        id: 'user123',
        email: 'test@example.com'
      })
      expect(loading.value).toBe(false)
    })

    it('should fail login with incorrect credentials', async () => {
      const { user, loading } = useAuth()
      
      global.fetch = vi.fn().mockImplementationOnce(() => 
        Promise.reject({
          data: {
            message: 'Неверный email или пароль'
          }
        })
      )

      try {
        await $fetch('/api/auth/login', {
          method: 'POST',
          body: {
            email: 'wrong@example.com',
            password: 'wrongpassword'
          }
        })
      } catch (error) {
        expect(error.data.message).toBe('Неверный email или пароль')
      }

      expect(user.value).toBe(null)
      expect(loading.value).toBe(false)
    })
  })

  describe('News Access', () => {
    it('should allow unauthorized user to view news', async () => {
      const { user } = useAuth()
      user.value = null

      const response = await $fetch('/api/news/1')
      expect(response).toBeDefined()
    })

    it('should allow authorized user to view news', async () => {
      const { user } = useAuth()
      user.value = {
        id: 'user123',
        email: 'test@example.com'
      }

      const response = await $fetch('/api/news/1')
      expect(response).toBeDefined()
    })
  })

  describe('Comments', () => {
    it('should allow authorized user to add comment', async () => {
      const { user } = useAuth()
      user.value = {
        id: 'user123',
        email: 'test@example.com'
      }

      const comment = {
        newsId: 1,
        text: 'Test comment'
      }

      const response = await $fetch('/api/comments', {
        method: 'POST',
        body: comment
      })

      expect(response).toBeDefined()
      expect(response.text).toBe(comment.text)
      expect(response.newsId).toBe(comment.newsId)
      expect(response.author).toBe(user.value.id)
    })

    it('should prevent unauthorized user from adding comment', async () => {
      const { user } = useAuth()
      user.value = null

      const comment = {
        newsId: 1,
        text: 'Test comment'
      }

      try {
        await $fetch('/api/comments', {
          method: 'POST',
          body: comment
        })
      } catch (error) {
        expect(error.statusCode).toBe(401)
      }
    })
  })
}) 