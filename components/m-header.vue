<template>
    <header class="bg-white flex justify-between items-center shadow-md h-[60px] ">
        <div class=" max-w-[1440px] mx-auto w-full px-[20px]">
            <h2 class=" font-medium text-gray-800">Вітаємо у <span class="text-blue-600">7EMINAR NEWS </span> - застосунку для
                читання новин</h2>
        </div>
        <div class="flex items-center gap-4 px-4"> 
            <template v-if="user">
                <span class="text-gray-600">{{ user.email }}</span>
                <button 
                    @click="handleLogout" 
                    class="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                >
                    Вийти
                </button>
            </template>
            <NuxtLink 
                v-else 
                to="/login" 
                class="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
                Увійти
            </NuxtLink>
        </div>
    </header>
</template>

<script setup lang="ts">
const { user } = useAuth()
const router = useRouter()

async function handleLogout() {
    try {
        await $fetch('/api/auth/logout', {
            method: 'POST'
        })
        await router.push('/login')
    } catch (error) {
        console.error('Error during logout:', error)
    }
}
</script>

