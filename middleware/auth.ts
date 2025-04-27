export default defineNuxtRouteMiddleware(async (to) => {
  const { user, loading, checkAuth } = useAuth()
  const router = useRouter()
  
  if (loading.value) {
    await checkAuth()
  }

  // Allow access to login page and public routes
  if (to.path === '/login') {
    if (user.value) {
      return router.push('/')
    }
    return
  }

  // Protect routes that require authentication
  if (!user.value) {
    return router.push('/login')
  }
}) 