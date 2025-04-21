<template>
 <div class="flex flex-col min-h-screen bg-gray-100  mx-auto" >
  <MHeader/>
  <NuxtPage/>
 </div>
</template>
<script setup>
import MHeader from '~/components/m-header.vue'

const { user, loading } = useAuth()
const router = useRouter()

onMounted(async () => {
  if (!loading.value && !user.value) {
    await router.push('/login')
  }
})
</script>
