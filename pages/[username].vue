<template>
  <div>
    <PageHeader />
    <div class="mt-4">
      <pre class="whitespace-pre-line">{{ item }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $auth: { user } } = useNuxtApp()

if (!user.value) {
  throw createError({ statusCode: 501, message: 'Access Denied', fatal: true })
}

const cursor = ref()
const username = computed(() => useRoute().params.username)
const { data: item } = await useApiFetch<User>(`/api/users/${username.value}`)

if (!item.value) {
  throw createError({ statusCode: 404, message: 'Page Not Found', fatal: true })
}

const title = useTitle()
title.value = `${item.value?.name}` || `@${item.value?.username}`

const text = ref('')
const el = ref()
</script>