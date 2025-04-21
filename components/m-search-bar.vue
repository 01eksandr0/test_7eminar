<template>
    <section class="flex flex-col gap-[8px] max-w-[1440px] mx-auto w-full px-[20px] py-[20px]">
        <div class="flex items-center">
            <input type="text"
                v-model="search"
                class="w-full p-2 px-4 rounded-md border bg-white border-gray-300 focus:outline-none focus:ring focus:ring-1 focus:ring-blue-600"
                placeholder="Пошук за назвою або описом" />
        </div>
    </section>
</template>

<script setup lang="ts">

const search = defineModel<string>('search')
</script>


