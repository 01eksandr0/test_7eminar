<template>
    <div>
        <div class="flex items-center gap-2">
            <div class="rounded-full h-[32px] bg-white w-[32px] border flex items-center justify-center">{{
                comment.author?.[0] }}</div>
            <div class="flex flex-col gap-0">
                <p class="text-[13px] font-medium">{{ comment.author }}</p>
                <MDate :date="comment.date" class="text-[13px] text-gray-500" />
            </div>
        </div>
        <div class="mt-1 pl-[40px] italic">
            <p>{{ comment.text }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IComment } from '~/types/comment'

defineProps<{
    comment: IComment
}>()
</script>
