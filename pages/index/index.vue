<template>
  <div>
    <m-search-bar v-model:search="search" @update:search="debouncedSearch" />
    <m-news-list :items="news" />
    <m-pagination 
      :current-page="page" 
      :total="total"
      :limit="limit"
      @prev="handlePrevPage"
      @next="handleNextPage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNewsStore } from '~/stores/news'
import { debounce } from '~/helpers/debounce'

definePageMeta({
  layout: 'default',
})

const search = ref('')
const page = ref(1)
const limit = 10

const store = useNewsStore()
const { news, total } = storeToRefs(store)

await store.fetchNews(search.value, page.value, limit)

const debouncedSearch = debounce((newSearch: string) => {
  page.value = 1
  store.fetchNews(newSearch, page.value, limit)
}, 500)

const handlePrevPage = () => {
  if (page.value > 1) {
    page.value--
    store.fetchNews(search.value, page.value, limit)
  }
}

const handleNextPage = () => {
  if (page.value * limit < total.value) {
    page.value++
    store.fetchNews(search.value, page.value, limit)
  }
}
</script>
