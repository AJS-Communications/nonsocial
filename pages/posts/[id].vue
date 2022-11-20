<template>
  <div>
    <div class="bg-white/80 dark:bg-black/80 backdrop-blur sticky top-0 z-10">
      <div class="p-2.5 flex gap-2">
        <button
          type="button"
          class="my-auto p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"
          @click="$router.go(-1)"
        >
          <IconLeftArrow />
        </button>
        <h1 class="text-xl font-bold my-auto">{{ title }}</h1>
      </div>
    </div>
    <article>
      <div class="relative flex flex-col-reverse px-4 pb-2 mt-4">
        <div class="flex items-center space-x-4">
          <img
            :src="item?.author.photoUrl"
            :alt="item?.author.name || ''"
            class="mb-auto flex-none w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
            loading="lazy"
            decoding="async"
          >
          <div class="flex-auto">
            <div class="text-base font-semibold flex gap-1">
              <NuxtLink
                :to="`/${item?.author.username}`"
                class="hover:underline my-auto"
                tabindex="0"
              >
                {{ item?.author.name }}
              </NuxtLink>
            </div>
            <p class="text-neutral-600 dark:text-neutral-400 font-medium">{{ createdDate }}</p>
          </div>
        </div>
      </div>
      <div class="p-4 space-y-4">
        <blockquote class="max-w-prose text-2xl pb-4">
          <pre class="font-sans whitespace-pre">{{ item?.text }}</pre>
        </blockquote>
        <hr class="border-neutral-100 dark:border-neutral-900" />
        <div v-if="data" class="flex gap-12">
          <div class="flex gap-2">
            <span class="font-bold">{{ data.favoriteCount }}</span>
            <span class="text-neutral-600 dark:text-neutral-400">{{ data.favoriteCount === 1 ? 'Like' : 'Likes' }}</span>
          </div>
          <div class="flex gap-2">
            <span class="font-bold">{{ data.bookmarkCount }}</span>
            <span class="text-neutral-600 dark:text-neutral-400">{{ data.bookmarkCount === 1 ? 'Bookmark' : 'Bookmarks' }}</span>
          </div>
          <div class="flex gap-2">
            <span class="font-bold">{{ data.commentCount }}</span>
            <span class="text-neutral-600 dark:text-neutral-400">{{ data.commentCount === 1 ? 'Comment' : 'Comments' }}</span>
          </div>
        </div>
        <hr class="border-neutral-100 dark:border-neutral-900" />
        <div class="flex justify-around gap-2">
          <button
            class="p-2 rounded-full flex hover:bg-rose-100/40 dark:hover:bg-rose-100/10 hover:text-rose-600 dark:hover:text-rose-400 saturate-200 transition-colors duration-200"
            :class="{ 'text-rose-600 dark:text-rose-400': isFavorite }"
            @click="favorite"
          >
            <IconHeart :active="isFavorite" />
            <span class="sr-only">Love</span>
          </button>
          <button
            class="p-2 flex gap-4 rounded-full flex hover:bg-green-100/40 dark:hover:bg-green-100/10 hover:text-green-600 dark:hover:text-green-400 saturate-200 transition-colors duration-200"
            :class="{ 'text-green-600 dark:text-green-400': isBookmark }"
            @click="bookmark"
          >
            <IconBookmark :active="isBookmark" />
            <span class="sr-only">Bookmark</span>
          </button>
          <button
            class="p-2 rounded-full flex hover:bg-sky-100/40 dark:hover:bg-sky-100/10 hover:text-sky-800 dark:hover:text-sky-400 saturate-200 transition-colors duration-200"
            @click="share"
          >
            <IconShare class="mr-1" />
            <span class="sr-only">Share</span>
        </button>
        </div>
      </div>
    </article>
    <hr class="border-neutral-100 dark:border-neutral-900" />
    <div class="border-b border-neutral-100 dark:border-neutral-900">
      <p class="ml-20 mt-4 text-neutral-600 dark:text-neutral-400 font-medium">
        Replying to
        <NuxtLink :to="`/${item?.author.username}`" class="text-sky-600 dark:text-sky-400 group">
          @<span class="group-hover:underline">{{ item?.author.username }}</span>
        </NuxtLink>
      </p>
      <CommentEditor v-if="data && data.post" v-model="text" :parent-id="data.post.id" @submit="update" />
    </div>
    <div class="divide-y divide-neutral-100 dark:divide-neutral-900">
      <FeedItem v-for="item in data?.comments" :item="item" @update="update" />
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useUser()

if (!user.value) {
  throw createError({ statusCode: 501, message: 'Access Denied' })
}

const route = useRoute()
const { data, refresh } = await useFetch(`/api/posts/${user.value.id}/${route.params.id}`)

if (!data.value) {
  throw createError({ statusCode: 404, message: 'Page Not Found' })
}

const title = useTitle()
title.value = 'Post'

const text = ref('')
const item = computed(() => data.value?.post)
const createdDate = computed(() => {
  return item.value && new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.value.createdDate))
})

const isBookmark = computed(() => {
  if (!user.value) return false
  return user.value.Bookmark.filter(i => i.postId === data.value?.post?.id).length > 0
})

const isFavorite = computed(() => {
  if (!user.value) return false
  return user.value.Favorite.filter(i => i.postId === data.value?.post?.id).length > 0
})

const update = async () => {
  if (!user.value) return
  await refresh()
  user.value = await $fetch<User>(`/api/users/${user.value.id}`)
}

const share = async () => {
  const url = `${window.location.protocol}//${window.location.host}/posts/${data.value?.post?.id}`
  if (!navigator.canShare()) {
    try {
      await navigator.share({
        title: 'Check this out!',
        text: 'Take a look at this post that I found.',
        url
      })
    } catch (e) {
      window.location.href = `mailto:?subject=Check this out!&body=Take a look at this post that I found: ${url}`
    }
  } else {
    window.location.href = `mailto:?subject=Check this out!&body=Take a look at this post that I found: ${url}`
  }
}

const bookmark = async () => {
  if (!user.value) return

  if (isBookmark.value) {
    const bookmark = user.value.Bookmark.find(i => i.postId ===  data.value?.post?.id)
    await useFetch(`/api/bookmarks/${user.value.id}`, {
      method: 'delete',
      body: {
        id: bookmark && bookmark.id
      }
    })
  } else {
    await useFetch(`/api/bookmarks/${user.value.id}`, {
      method: 'post',
      body: {
        postId: data.value?.post?.id
      }
    })
  }
  update()
}

const favorite = async () => {
  if (!user.value) return

  if (isFavorite.value) {
    const favorite = user.value.Favorite.find(i => i.postId ===  data.value?.post?.id)
    await useFetch(`/api/favorites/${user.value.id}`, {
      method: 'delete',
      body: {
        id: favorite && favorite.id
      }
    })
  } else {
    await useFetch(`/api/favorites/${user.value.id}`, {
      method: 'post',
      body: {
        postId:  data.value?.post?.id
      }
    })
  }
  update()
}
</script>