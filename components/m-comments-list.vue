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
const pollingInterval = ref<number | null>(null)
const usePolling = ref(false)

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
            // If we were using polling, stop it
            if (pollingInterval.value) {
                clearInterval(pollingInterval.value)
                pollingInterval.value = null
            }
            usePolling.value = false
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
            // If WebSocket fails, switch to polling
            if (!usePolling.value) {
                startPolling()
            }
        }

        socket.value.onclose = () => {
            if (reconnectAttempts.value < maxReconnectAttempts) {
                reconnectAttempts.value++
                setTimeout(() => {
                    setupWebSocket()
                }, 5000)
            } else {
                // If max reconnect attempts reached, switch to polling
                startPolling()
            }
        }
    } catch (error) {
        console.error('Error creating WebSocket connection:', error)
        // If WebSocket creation fails, switch to polling
        startPolling()
    }
}

const startPolling = () => {
    if (usePolling.value) return
    
    usePolling.value = true
    console.log('Switching to polling for comments updates')
    
    // Clear any existing interval
    if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
    }
    
    // Initial fetch
    fetchComments()
    
    // Set up polling interval (every 10 seconds)
    pollingInterval.value = window.setInterval(() => {
        fetchComments()
    }, 10000)
}

const fetchComments = async () => {
    try {
        const response = await fetch(`/api/comments?id=${props.newsId}`)
        if (response.ok) {
            const data = await response.json()
            // Update comments in the store
            data.forEach((comment: IComment) => {
                commentsStore.addComment(comment)
            })
        }
    } catch (error) {
        console.error('Error fetching comments:', error)
    }
}

onMounted(() => {
    setupWebSocket()
})

onUnmounted(() => {
    if (socket.value) {
        socket.value.close()
    }
    if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
    }
})
</script>
