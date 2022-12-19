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
        :item-id="item.id"
        show-comments
        @update="updateUser"
      />
    </div>
    <div ref="el" />
  </div>
</template>

<script setup lang="ts">
const { user, updateUser } = useUser()

if (!user.value) {
  throw createError({ statusCode: 501, message: 'Access Denied' })
}

const title = useTitle()
title.value = 'Home'
const cursor = ref()
const { data } = await useFetch<[Post]>(`/api/users/${user.value.id}/posts`)
const text = ref('')
const el = ref()

const items = ref(data.value)

useIntersectionObserver(el, async ([{ isIntersecting }]) => {
  if (user.value && items.value && isIntersecting) {
    const lastItem = items.value[items.value.length - 1]
    const lastId = lastItem && lastItem.id || null
    if (lastId === cursor.value) return

    cursor.value = lastId
    const { data } = await useFetch<[Post]>(`/api/users/${user.value.id}/posts`, {
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
  const { data } = await useFetch<[Post]>(`/api/users/${user.value.id}/posts`)
  items.value = data.value
  await updateUser()
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
