<template>
<section class="flex flex-col gap-[8px]">
  <div class="max-w-[1440px] mx-auto w-full px-[20px]">
    <ul class="flex flex-col gap-[8px]">
      <li v-for="item in items" :key="item.id">
        <m-news-item :item="item" />
      </li>
    </ul>
  </div>
</section>
</template>

<script setup lang="ts">
import type { INewsItem } from '~/types/news'

defineProps<{items: INewsItem[]}>()
</script>
