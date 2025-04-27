<template>
    <div>
        <div v-if="user" class="mb-6">
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <textarea
                        v-model="newComment"
                        class="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Напишіть ваш коментар..."
                        required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    :disabled="isSubmitting"
                >
                    {{ isSubmitting ? 'Відправка...' : 'Додати коментар' }}
                </button>
            </form>
        </div>
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
import { useNuxtApp } from '#app'
import { useAuth } from '~/composables/useAuth'

const props = defineProps<{
    comments: IComment[]
    newsId: number
}>()

const { user } = useAuth()
const commentsStore = useCommentsStore()
const { $logger } = useNuxtApp()
const socket = ref<WebSocket | null>(null)
const reconnectAttempts = ref(0)
const maxReconnectAttempts = 5
const pollingInterval = ref<number | null>(null)
const usePolling = ref(false)
const newComment = ref('')
const isSubmitting = ref(false)

const setupWebSocket = () => {
    if (process.server) return

    if (socket.value) {
        socket.value.close()
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws`
    
    try {
        socket.value = new WebSocket(wsUrl)
        $logger.info('WebSocket connection attempt', { newsId: props.newsId })

        socket.value.onopen = () => {
            reconnectAttempts.value = 0
            $logger.info('WebSocket connection established', { newsId: props.newsId })
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
                    $logger.debug('New comment received', { 
                        commentId: newComment.id,
                        newsId: props.newsId 
                    })
                }
            } catch (error) {
                $logger.error('Error parsing WebSocket message', { 
                    error,
                    newsId: props.newsId 
                })
            }
        }

        socket.value.onerror = (error) => {
            $logger.error('WebSocket error occurred', { 
                error,
                newsId: props.newsId 
            })
            if (!usePolling.value) {
                startPolling()
            }
        }

        socket.value.onclose = () => {
            if (reconnectAttempts.value < maxReconnectAttempts) {
                reconnectAttempts.value++
                $logger.warn('WebSocket connection closed, attempting reconnect', { 
                    attempt: reconnectAttempts.value,
                    newsId: props.newsId 
                })
                setTimeout(() => {
                    setupWebSocket()
                }, 5000)
            } else {
                $logger.error('Max WebSocket reconnect attempts reached', { 
                    newsId: props.newsId 
                })
                startPolling()
            }
        }
    } catch (error) {
        $logger.error('Error creating WebSocket connection', { 
            error,
            newsId: props.newsId 
        })
        startPolling()
    }
}

const startPolling = () => {
    if (usePolling.value) return
    
    usePolling.value = true
    $logger.info('Switching to polling for comments updates', { newsId: props.newsId })
    
    if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
    }
    
    fetchComments()
    
    pollingInterval.value = window.setInterval(() => {
        fetchComments()
    }, 10000)
}

const fetchComments = async () => {
    try {
        const response = await fetch(`/api/comments?id=${props.newsId}`)
        if (response.ok) {
            const data = await response.json()
            data.forEach((comment: IComment) => {
                commentsStore.addComment(comment)
            })
            $logger.debug('Comments fetched successfully', { 
                count: data.length,
                newsId: props.newsId 
            })
        }
    } catch (error) {
        $logger.error('Error fetching comments', { 
            error,
            newsId: props.newsId 
        })
    }
}

async function handleSubmit() {
    if (!newComment.value.trim()) return

    try {
        isSubmitting.value = true
        const response = await $fetch('/api/comments', {
            method: 'POST',
            body: {
                newsId: props.newsId,
                text: newComment.value.trim()
            }
        })
        
        commentsStore.addComment(response)
        newComment.value = ''
        $logger.info('Comment added successfully', { 
            newsId: props.newsId,
            commentId: response.id
        })
    } catch (error) {
        $logger.error('Error adding comment', { 
            error,
            newsId: props.newsId
        })
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
    $logger.debug('Comments component mounted', { newsId: props.newsId })
    setupWebSocket()
})

onUnmounted(() => {
    $logger.debug('Comments component unmounted', { newsId: props.newsId })
    if (socket.value) {
        socket.value.close()
    }
    if (pollingInterval.value) {
        clearInterval(pollingInterval.value)
    }
})
</script>
