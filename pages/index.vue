<template>
  <div>
    <PageHeader />
    <div class="divide-y divide-neutral-100 dark:divide-neutral-900">
      <PostEditor v-model="text" @submit="update" />
      <LazyFeedItem
        v-for="item in items"
        :key="item.id"
        :item="item"
      />
    </div>
    <div ref="el" />
  </div>
</template>

<script setup lang="ts">
const { $api, $auth: { user } } = useNuxtApp()

if (!user.value) {
  throw createError({ statusCode: 501, message: 'Access Denied', fatal: true })
}

const title = useTitle()
title.value = 'Home'
const cursor = ref()
const { data: items, error } = await useApiFetch<[Post]>(`/api/users/${user.value.id}/posts`)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    statusMessage: error.value.statusMessage,
    message: 'An error occurred while fetching data',
    fatal: true
  })
}

const text = ref('')
const el = ref()

useIntersectionObserver(el, async ([{ isIntersecting }]) => {
  if (user.value && items.value && isIntersecting) {
    const lastItem = items.value[items.value.length - 1]
    const lastId = lastItem && lastItem.id || undefined
    if (lastId === cursor.value) return

    cursor.value = lastId
    const data = await $api<[Post]>(`/api/users/${user.value.id}/posts`, {
      params: {
        cursor: cursor.value
      }
    })
    if (data) {
      items.value.push(...data)
    }
  }
})

const update = async () => {
  if (!user.value) return
  const data = await $api<[Post]>(`/api/users/${user.value.id}/posts`)
  items.value = data
}
</script>
