<template>
  <div ref="el" class="h-screen overflow-auto">
    <div
      class="bg-white/80 dark:bg-black/80 backdrop-blur sticky top-0 z-20 cursor-pointer"
      @click="goToTop"
    >
      <h1 class="p-4 pb-0 text-xl font-bold">{{ title }}</h1>
      <p v-if="user" class="px-4 pb-4 text-neutral-600 dark:text-neutral-400">@{{ user.username }}</p>
    </div>
    <div class="divide-y divide-neutral-100 dark:divide-neutral-900">
      <FeedItem v-for="item in posts" :key="item.id" :item="item" @update="updateUser" />
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useUser()

if (!user.value) {
  throw createError({ statusCode: 501, message: 'Access Denied' })
}

const title = useTitle()
title.value = 'Bookmarks'
const cursor = ref()
const { data } = await useFetch<[Bookmark]>(`/api/bookmarks/${user.value.id}`)
const el = ref()

const bookmarks = ref(data.value)
const posts = ref(bookmarks.value?.flatMap(i => i.post) || [])

useInfiniteScroll(el, async () => {
  if (bookmarks.value) {
    const lastId = bookmarks.value[bookmarks.value.length - 1].id
    if (lastId === cursor.value) return

    cursor.value = lastId
    const { data } = await useFetch<[Bookmark]>(`/api/bookmarks/${user.value?.id}`, {
      params: {
        cursor: cursor.value
      }
    })
    if (data.value) {
      posts.value.push(...data.value?.flatMap(i => i.post) || [])
    }
  }
})

const update = async () => {
  if (!user.value) return
  const { data } = await useFetch<[Bookmark]>(`/api/bookmarks/${user.value.id}`)
  bookmarks.value = data.value
  posts.value = data.value?.flatMap(i => i.post) || []
  updateUser()
}

const updateUser = async () => {
  if (!user.value) return
  user.value = await $fetch<User>(`/api/users/${user.value.id}`)
}

const goToTop = () => {
  el.value.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>
