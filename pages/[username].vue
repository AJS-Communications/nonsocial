<template>
  <div>
    <PageHeader />
    <div class="mt-4">
      <pre class="whitespace-pre-line">{{ item }}</pre>
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