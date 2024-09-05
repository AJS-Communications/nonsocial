<template>
  <div>
    <div
      class="bg-white/80 dark:bg-black/80 backdrop-blur sticky top-0 z-20 cursor-pointer"
      @click="goToTop"
    >
      <h1 class="p-4 pb-0 text-xl font-bold">{{ title }}</h1>
      <p
        v-if="user?.username"
        class="px-4 pb-4 text-neutral-500"
      >@{{ user.username }}</p>
    </div>
    <div class="divide-y divide-neutral-100 dark:divide-neutral-900">
      <LazyFeedItem
        v-for="item in posts"
        :key="item.id"
        :item="item"
        show-comments
        @update="update"
      />
    </div>
    <div ref="el" />
  </div>
</template>

<script setup lang="ts">
const { $api, $auth: { user, refreshUser } } = useNuxtApp()

if (!user.value) {
  throw createError({ statusCode: 501, message: 'Access Denied' })
}

const title = useTitle()
title.value = 'Bookmarks'
const cursor = ref()
const { data: bookmarks } = await useApiFetch<[Bookmark]>(`/api/users/${user.value.id}/bookmarks`)
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

const update = async () => {
  if (!user.value) return
  const data = await $api<[Bookmark]>(`/api/users/${user.value.id}/bookmarks`)
  bookmarks.value = data
  posts.value = bookmarks.value?.flatMap(i => i.post) || []
  await refreshUser()
}

useNuxtApp().hooks.hook('compose', async () => {
  await update()
})

const goToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>
