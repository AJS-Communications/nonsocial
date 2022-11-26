<template>
  <div ref="el" class="h-screen overflow-auto">
    <div
      class="bg-white/80 dark:bg-black/80 backdrop-blur sticky top-0 z-20 cursor-pointer"
      @click="goToTop"
    >
      <h1 class="p-4 pb-0 text-xl font-bold">{{ title }}</h1>
      <p v-if="user" class="px-4 pb-4 text-neutral-500">@{{ user.username }}</p>
    </div>
    <div class="divide-y divide-neutral-100 dark:divide-neutral-900">
      <LazyFeedItem v-for="item in items" :key="item.id" :item-id="item.id" @update="updateUser" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, updateUser } = useUser()

if (!user.value) {
  throw createError({ statusCode: 501, message: 'Access Denied' })
}

const title = useTitle()
title.value = 'Explore'
const cursor = ref()
const { data } = await useFetch<[Post]>(`/api/posts`)
const el = ref()

const items = ref(data.value)

useInfiniteScroll(el, async () => {
  if (user.value && items.value) {
    const lastItem = items.value[items.value.length - 1]
    const lastId = lastItem && lastItem.id || null
    if (lastId === cursor.value) return

    cursor.value = lastId
    const { data } = await useFetch<[Post]>(`/api/posts`, {
      params: {
        cursor: cursor.value
      }
    })
    if (data.value) {
      items.value.push(...data.value)
    }
  }
})

const update = async () => {
  if (!user.value) return
  const { data } = await useFetch<[Post]>(`/api/posts`)
  items.value = data.value
  updateUser()
}

const goToTop = () => {
  el.value.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>
