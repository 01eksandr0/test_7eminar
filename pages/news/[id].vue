<template>
    <section>
        <div class="max-w-[1440px] mx-auto w-full px-[20px] py-[20px]">
            <NuxtLink to="/"
                class="text-blue-600 hover:text-blue-700 duration-100 flex items-center gap-3  px-4 py-2 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg> 
                Назад
            </NuxtLink>
            <h1 class="font-bold mt-[16px] text-xl">{{ newsItem?.title }}</h1>
        </div>
    </section>
    <section>
        <div class="max-w-[1440px] mx-auto w-full px-[20px]">
            <p class="text-gray-500 border p-4 rounded-md bg-white italic">{{ newsItem?.content }}</p>
        </div>
    </section>
    <section>
        <div class="max-w-[1440px] mx-auto w-full px-[20px] py-[20px]">
            <MCommentsList :comments="comments" :news-id="Number(id)" />
        </div>
    </section>
</template>

<script setup lang="ts">
import { useNewsStore } from '~/stores/news'
import useCommentsStore from '~/stores/comments'
import { storeToRefs } from 'pinia'

const route = useRoute()
const { id } = route.params

const newsItem = await useNewsStore().fetchNewsItem(Number(id))
const commentsStore = useCommentsStore()
await commentsStore.fetchComments(Number(id))
const { comments } = storeToRefs(commentsStore)
</script>
