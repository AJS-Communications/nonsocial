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
      <FeedItem v-for="item in data" :key="item.id" :item="item" @update="update" />
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useUser()

if (!user.value) {
  throw createError({ statusCode: 501, message: 'Access Denied' })
}

const title = useTitle()
title.value = 'Home'

const { data, refresh } = await useFetch(`/api/posts/${user.value.id}`)
const text = ref('')

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
