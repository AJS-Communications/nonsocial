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
        v-for="item in items"
        :key="item.id"
        :item-id="item.id"
        show-comments
        @update="refreshUser"
      />
    </div>
    <div ref="el" />
  </div>
</template>

<script setup lang="ts">
const { user, refreshUser } = await useAuth()

if (!user.value) {
  throw createError({ statusCode: 501, message: 'Access Denied' })
}

const title = useTitle()
title.value = 'Explore'
const cursor = ref()
const { data } = await useFetch<[Post]>(`/api/posts`)
const el = ref()

const items = ref(data.value)

useIntersectionObserver(el, async ([{ isIntersecting }]) => {
  if (user.value && items.value && isIntersecting) {
    const lastItem = items.value[items.value.length - 1]
    const lastId = lastItem && lastItem.id || undefined
    if (lastId === cursor.value) return

    cursor.value = lastId
    const data = await $fetch<[Post]>(`/api/posts`, {
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
  const data = await $fetch<[Post]>(`/api/posts`)
  items.value = data
  await refreshUser()
}

useNuxtApp().hooks.hook('compose' as any, async () => {
  await update()
})

const goToTop = () => {
  el.value.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>
