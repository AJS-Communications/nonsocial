<template>
  <div>
    <div
      class="bg-white/80 dark:bg-black/80 backdrop-blur sticky top-0 z-20 cursor-pointer"
      @click="goToTop"
    >
      <h1 class="p-4 pb-0 text-xl font-bold">{{ title }}</h1>
      <p v-if="user" class="px-4 pb-4 text-neutral-600 dark:text-neutral-400">@{{ user.username }}</p>
    </div>
    <div class="divide-y divide-neutral-100 dark:divide-neutral-900">
      <FeedItem v-for="item in items" :key="item.id" :item="item" @update="update" />
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
const { data, refresh } = await useFetch<[Bookmark]>(`/api/bookmarks/${user.value.id}`)

const items = computed(() => {
  if (!data.value) return []
  return data.value.flatMap(i => i.post)
})

const update = async () => {
  if (!user.value) return
  await refresh()
  user.value = await $fetch<User>(`/api/users/${user.value.id}`)
}

const goToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>
