import { defineStore } from "pinia"
import { ref } from "vue"
import type { INewsItem } from "~/types/news"

interface NewsResponse {
  items: INewsItem[]
  total: number
}

export const useNewsStore = defineStore('news', () => {
  const news = ref<INewsItem[]>([])
  const total = ref(0)

  async function fetchNews(search: string, page: number, limit: number) {
    const { data } = await useFetch<NewsResponse>('/api/news', {
      query: {
        search,
        page,
        limit
      }
    })
    if (data.value) {
      news.value = data.value.items || []
      total.value = data.value.total || 0
    }
  }

  async function fetchNewsItem(id: number) {
    const { data } = await useFetch<INewsItem>(`/api/news/${id}`)
    return data.value
  }

  return {
    news,
    total,
    fetchNews,
    fetchNewsItem
  }
})
