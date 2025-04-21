<template>
  <div class="flex justify-center items-center gap-4 py-4">
    <button 
      @click="$emit('prev')" 
      :disabled="currentPage === 1"
      class="p-2 rounded-md border bg-white border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <span class="text-gray-600">Сторінка {{ currentPage }}</span>
    <button 
      @click="$emit('next')" 
      :disabled="currentPage * limit >= total"
      class="p-2 rounded-md border bg-white border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number
  total: number
  limit: number
}>()

defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()
</script> 