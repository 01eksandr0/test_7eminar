<template>
    <section class="flex flex-col gap-[8px] max-w-[1440px] mx-auto w-full px-[20px] py-[20px]">
        <div class="flex items-center">
            <input type="text"
                v-model="searchValue"
                class="w-full p-2 px-4 rounded-md border bg-white border-gray-300 focus:outline-none focus:ring focus:ring-1 focus:ring-blue-600"
                placeholder="Пошук за назвою або описом" />
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useNuxtApp } from '#app'

const search = defineModel<string>('search')
const { $logger } = useNuxtApp()
const searchValue = ref(search.value || '')

let searchTimeout: NodeJS.Timeout | null = null

watch(searchValue, (newValue) => {
    search.value = newValue
    
    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }
    
    searchTimeout = setTimeout(() => {
        if (newValue.trim()) {
            $logger.info('Search query', { 
                query: newValue,
                length: newValue.length
            })
        }
    }, 500)
})
</script>


