<template>
  <div>
    <div class="border-b border-neutral-100 dark:border-neutral-900 bg-white/80 dark:bg-black/80 backdrop-blur sticky top-0 z-20">
      <h1 class="p-4 text-xl font-bold">{{ title }}</h1>
      <TextEditor v-model="text" />
    </div>
    <div class="divide-y divide-neutral-100 dark:divide-neutral-900">
      <FeedItem v-for="item in data" :item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
const title = useTitle()
title.value = 'Home'
const { data } = await useFetch('/api/feed/jshimkoski')
const text = ref('')
</script>