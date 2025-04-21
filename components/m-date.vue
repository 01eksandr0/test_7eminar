<template>
    <span>{{ formatDate(date) }}</span>
</template>

<script setup lang="ts">

defineProps({
    date: {
        type: String,
        required: true
    }
})

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })

</script>