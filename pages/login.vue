<template>
    <div class="w-[400px] bg-white p-4 rounded-md border border-gray-300">
        <h1 class="text-2xl font-bold mb-4">Вход в систему</h1>
        <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input 
                    v-model="email" 
                    type="email" 
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                >
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Пароль</label>
                <input 
                    v-model="password" 
                    type="password" 
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                >
            </div>
            <div v-if="error" class="text-red-500 text-sm">
                {{ error }}
            </div>
            <button 
                type="submit" 
                class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                Войти
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'login',
    middleware: ['auth']
})

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const { $logger } = useNuxtApp()

async function handleLogin() {
    try {
        error.value = ''
        $logger.info('Login attempt', { email: email.value })
        
        await $fetch('/api/auth/login', {
            method: 'POST',
            body: {
                email: email.value,
                password: password.value
            }
        })

        $logger.trackUserAction('login_success', email.value)
        await router.push('/')
    } catch (e: any) {
        const errorMessage = e.data?.message || 'Произошла ошибка при входе'
        error.value = errorMessage
        $logger.error('Login failed', { 
            email: email.value,
            error: errorMessage
        })
    }
}
</script>
