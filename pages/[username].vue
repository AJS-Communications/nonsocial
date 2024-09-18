<template>
  <div>
    <PageHeader />
    <div class="mt-4">
      <button
        type="button"
        class="border rounded px-4 py-2 w-full justify-center flex items-center gap-4 bg-neutral-100 hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800"
        @click="handleFollow()"
      >
        {{ item && isFollowing(item.id) ? 'Unfollow' : 'Follow' }}
      </button>
      Person:
      <pre class="whitespace-pre-line">Followers: {{ item?.followers.map(i => i.follower.username) }}</pre>
      <pre class="whitespace-pre-line">Following: {{ item?.following.map(i => i.follower.username) }}</pre>
      User:
      <pre class="whitespace-pre-line">Followers: {{ user?.followers.map(i => i.follower.username) }}</pre>
      <pre class="whitespace-pre-line">Following: {{ user?.following.map(i => i.follower.username) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  $auth: { user },
  $user: {
    isFollowing,
    follow
  }
} = useNuxtApp()

if (!user.value) {
  throw createError({ statusCode: 501, message: 'Access Denied', fatal: true })
}

const username = computed(() => useRoute().params.username)
const { data: item, error, refresh } = await useApiFetch<User>(`/api/users/${username.value}`)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    statusMessage: error.value.statusMessage,
    message: 'An error occurred while fetching data',
    fatal: true
  })
}

const title = useTitle()
title.value = item.value?.name || `@${item.value?.username}`

const handleFollow = async () => {
  if (item.value) {
    await follow(item.value.id)
    await refresh()
  }
}
</script>