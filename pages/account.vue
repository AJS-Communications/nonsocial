<template>
  <div>
    <PageHeader />
    <div class="p-4">
      <button
        class="text-sky-700 hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-400"
        @click="logout()"
      >
        <span>Logout</span>
      </button>
      <div class="mt-4">
        <pre class="whitespace-pre-line">{{ item }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $auth: { user, logout } } = useNuxtApp()

if (!user.value) {
  throw createError({ statusCode: 501, message: 'Access Denied' })
}

const title = useTitle()
title.value = `Account @${user.value.username}`

const cursor = ref()
const { data: item } = await useApiFetch<[Post]>(`/api/users/${user.value?.username}`)
const text = ref('')
const el = ref()
</script>