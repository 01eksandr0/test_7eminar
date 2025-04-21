export default defineNuxtRouteMiddleware(async (to) => {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  if (loading.value) {
    return
  }

  if (to.path === '/login') {
    if (user.value) {
      return router.push('/')
    }
    return
  }

  if (!user.value) {
    return router.push('/login')
  }
}) 