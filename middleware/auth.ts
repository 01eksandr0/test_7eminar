export default defineNuxtRouteMiddleware(async (to) => {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  if (loading.value) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  if (process.server) {
    return
  }

  if (!user.value && to.path !== '/login') {
    return router.push('/login')
  }
  if (user.value && to.path === '/login') {
    return router.push('/')
  }
}) 