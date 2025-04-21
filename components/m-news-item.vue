<template>
    <NuxtLink :to="`/news/${item?.id}`"
        class="border rounded-md p-4 bg-white block border-gray-300 cursor-pointer hover:shadow hover:translate-y-[-2px] duration-100">
        <div class="flex justify-between items-center">
            <h3 class="font-medium ">{{ item?.title }}</h3>
            <span class="text-gray-500 text-sm">{{ item?.date }}</span>
        </div>
        <div class="flex mt-[12px] gap-[16px]">
            <p class="italic text-gray-500 w-[calc(100%-80px)] overflow-hidden text-ellipsis text-nowrap">
                {{ item?.summary }}
            </p>
         
        </div>

    </NuxtLink>
</template>

<script setup lang="ts">
import type { INewsItem } from '~/types/news'

defineProps<{
  item: INewsItem
}>()
</script>
