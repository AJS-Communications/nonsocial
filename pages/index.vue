<template>
  <div>
    <div
      class="bg-white/80 dark:bg-black/80 backdrop-blur sticky top-0 z-20 cursor-pointer"
      @click="goToTop"
    >
      <h1 class="p-4 text-xl font-bold">{{ title }}</h1>
    </div>
    <div class="divide-y divide-neutral-100 dark:divide-neutral-900">
      <PostEditor v-model="text" @submit="update" />
      <LazyFeedItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        show-comments
        @update="refreshUser"
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
title.value = 'Home'
const cursor = ref()
const { data: items } = await useApiFetch<[Post]>(`/api/users/${user.value.id}/posts`)
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
