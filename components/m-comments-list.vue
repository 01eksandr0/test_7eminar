<template>
    <div>
        <ul class="flex flex-col gap-4">
            <li v-for="comment in comments" :key="comment.id">
                <MCommentItem :comment="comment" />
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import type { IComment } from '~/types/comment'
import { onMounted, onUnmounted, ref } from 'vue'
import useCommentsStore from '~/stores/comments'

const props = defineProps<{
    comments: IComment[]
    newsId: number
}>()

const commentsStore = useCommentsStore()
const socket = ref<WebSocket | null>(null)
const reconnectAttempts = ref(0)
const maxReconnectAttempts = 5

const setupWebSocket = () => {
    if (process.server) return

    if (socket.value) {
        socket.value.close()
    }

    // Use secure WebSocket (wss://) when the site is loaded over HTTPS
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws`
    
    try {
        socket.value = new WebSocket(wsUrl)

        socket.value.onopen = () => {
            reconnectAttempts.value = 0
        }

        socket.value.onmessage = (event) => {
            try {
                const newComment = JSON.parse(event.data) as IComment
                if (newComment.newsId === props.newsId) {
                    commentsStore.addComment(newComment)
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error)
            }
        }

        socket.value.onerror = (error) => {
            console.error('WebSocket error:', error)
        }

        socket.value.onclose = () => {
            if (reconnectAttempts.value < maxReconnectAttempts) {
                reconnectAttempts.value++
                setTimeout(() => {
                    setupWebSocket()
                }, 5000)
            }
        }
    } catch (error) {
        console.error('Error creating WebSocket connection:', error)
    }
}

onMounted(() => {
    setupWebSocket()
})

onUnmounted(() => {
    if (socket.value) {
        socket.value.close()
    }
})
</script>
