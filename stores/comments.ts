import type { IComment } from '~/types/comment'

const useCommentsStore = defineStore('comments', () => {
    const comments = ref<IComment[]>([])

    const fetchComments = async (id: number) => {
        const response = await useFetch<IComment[]>(`/api/comments`, {
            query: {
                id
            }
        })
        comments.value = (response.data.value || []).slice(0, 3)
    }

    const addComment = (comment: IComment) => {
        comments.value = [...comments.value, comment]
    }

    return {
        comments,
        fetchComments,
        addComment
    }
})

export default useCommentsStore
