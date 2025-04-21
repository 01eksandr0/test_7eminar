export const useAuth = () => {
  const user = ref<any>(null)
  const loading = ref(true)

  async function checkAuth() {
    try {
      loading.value = true
      const { data } = await useFetch('/api/auth/me', {
        key: 'auth-user',
        server: true,
        lazy: false
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