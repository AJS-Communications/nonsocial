<template>
  <div>
    <div
      class="border-b border-neutral-100 dark:border-neutral-900 bg-white/80 dark:bg-black/80 backdrop-blur sticky top-0 z-20 cursor-pointer"
      @click="goToTop"
    >
      <h1 class="p-4 text-xl font-bold">{{ title }}</h1>
    </div>
    <div class="p-4">
      <pre>{{ item }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const username = computed(() => useRoute().params.username)
const title = useTitle()
title.value = `Profile @${username.value}`

const cursor = ref()
const { data: item } = await useApiFetch<[Post]>(`/api/users/${username.value}`)
const text = ref('')
const el = ref()
</script>