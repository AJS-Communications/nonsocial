<template>
  <div>
    <PageHeader />
    <div class="divide-y divide-neutral-100 dark:divide-neutral-900">
      <LazyFeedItem
        v-for="item in posts"
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
title.value = 'Bookmarks'
const cursor = ref()
const { data: bookmarks, error } = await useApiFetch<[Bookmark]>(`/api/users/${user.value.id}/bookmarks`)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    statusMessage: error.value.statusMessage,
    message: 'An error occurred while fetching data',
    fatal: true
  })
}

const el = ref()

const posts = ref(bookmarks.value?.flatMap(i => i.post) || [])

useIntersectionObserver(el, async ([{ isIntersecting }]) => {
  if (bookmarks.value && isIntersecting) {
    const lastItem = bookmarks.value[bookmarks.value.length - 1]
    const lastId = lastItem && lastItem.id || undefined
    if (lastId === cursor.value) return

    cursor.value = lastId
    const data = await $api<[Bookmark]>(`/api/users/${user.value?.id}/bookmarks`, {
      params: {
        cursor: cursor.value
      }
    })
    if (data) {
      posts.value.push(...data?.flatMap(i => i.post) || [])
    }
  }
})
</script>
