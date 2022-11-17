<template>
  <div>
    <div class="border-b border-neutral-100 dark:border-neutral-900 bg-white/80 dark:bg-black/80 backdrop-blur sticky top-0 z-20">
      <h1 class="p-4 text-xl font-bold">{{ title }}</h1>
    </div>
    <div class="divide-y divide-neutral-100 dark:divide-neutral-900">
      <FeedItem v-for="item in data" :item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data } = await useFetch(`/api/${route.params.type as 'blog-posts' | 'status-updates'}/jshimkoski`)
const title = useTitle()
title.value = (route.params.type as string).split('-').join(' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
</script>