interface User {
  id: string;
  email: string;
}

export const useAuth = () => {
  const user = useState<User | null>('auth:user', () => null)
  const loading = ref(true)

  async function checkAuth() {
    try {
      loading.value = true
      const { data } = await useFetch<User>('/api/auth/me', {
        key: 'auth-user',
        server: false,
        lazy: true
      })
      user.value = data.value
    } catch (e) {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  if (process.client) {
    checkAuth()
  }

  return {
    user,
    loading,
    checkAuth
  }
} 