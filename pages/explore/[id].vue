<template>
  <div>
    <PageHeader />
    <div class="divide-y divide-neutral-100 dark:divide-neutral-900">
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

const id = computed(() => useRoute().params.id)
const title = useTitle()
title.value = `Explore #${id.value}`
const cursor = ref()
const { data: items } = await useApiFetch<[Post]>(`/api/posts/explore/${id.value}`)

if (!items.value) {
  throw createError({ statusCode: 404, message: 'Page Not Found', fatal: true })
}

const el = ref()

useIntersectionObserver(el, async ([{ isIntersecting }]) => {
  if (user.value && items.value && isIntersecting) {
    const lastItem = items.value[items.value.length - 1]
    const lastId = lastItem && lastItem.id || undefined
    if (lastId === cursor.value) return

    cursor.value = lastId
    const data = await $api<[Post]>(`/api/posts/explore/${id.value}`, {
      params: {
        cursor: cursor.value
      }
    })
    if (data) {
      items.value.push(...data)
    }
  }
})
</script>
