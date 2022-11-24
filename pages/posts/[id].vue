<template>
  <div v-if="item" ref="el" class="h-screen overflow-auto">
    <div class="bg-white/80 dark:bg-black/80 backdrop-blur sticky top-0 z-20">
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
    <div class="relative">
      <div
        v-if="parentItem"
        class="bg-neutral-200 dark:bg-neutral-800 w-1 absolute top-10 left-[2.35rem] bottom-10 -z-10"
      />
      <FeedItem v-if="parentItem" :item="parentItem" @update="updateUser" />
      <article class="bg-white dark:bg-black">
        <div class="relative flex flex-col-reverse px-4 pb-2 mt-4">
          <div class="flex items-center space-x-4">
            <img
              :src="item.author.photoUrl"
              :alt="item.author.name || ''"
              class="mb-auto flex-none w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-4 ring-white dark:ring-black"
              loading="lazy"
              decoding="async"
            >
            <div class="flex-auto">
              <div class="text-base font-semibold flex gap-1">
                <NuxtLink
                  :to="`/${item.author.username}`"
                  class="hover:underline my-auto"
                  tabindex="0"
                >
                  {{ item.author.name }}
                </NuxtLink>
              </div>
              <p class="text-neutral-500 font-medium">{{ createdDate(item.createdDate, 'long') }}</p>
            </div>
          </div>
        </div>
        <div class="p-4 space-y-4">
          <p v-if="item.parentId" class="text-neutral-500 font-medium">
            Replying to
            <NuxtLink :to="`/${parentItem.author.username}`" class="text-sky-600 dark:text-sky-400 group">
              @<span class="group-hover:underline">{{ parentItem.author.username }}</span>
            </NuxtLink>
          </p>
          <blockquote class="max-w-prose text-2xl pb-4">
            <div class="font-sans whitespace-pre-line">{{ item.text }}</div>
          </blockquote>
          <hr class="border-neutral-100 dark:border-neutral-900" />
          <div class="flex gap-4 sm:gap-12 text-sm">
            <div class="flex gap-2">
              <span class="font-bold">{{ item.counts.commentCount }}</span>
              <span class="text-neutral-500">{{ item.counts.commentCount === 1 ? 'Comment' : 'Comments' }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-bold">{{ item.counts.commentCount }}</span>
              <span class="text-neutral-500">{{ item.counts.commentCount === 1 ? 'Repost' : 'Reposts' }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-bold">{{ item.counts.favoriteCount }}</span>
              <span class="text-neutral-500">{{ item.counts.favoriteCount === 1 ? 'Like' : 'Likes' }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-bold">{{ item.counts.bookmarkCount }}</span>
              <span class="text-neutral-500">{{ item.counts.bookmarkCount === 1 ? 'Bookmark' : 'Bookmarks' }}</span>
            </div>
          </div>
          <hr class="border-neutral-100 dark:border-neutral-900" />
          <div class="flex justify-around gap-2">
            <button
              class="p-2 rounded-full flex text-neutral-600 dark:text-neutral-400 hover:bg-blue-100/40 dark:hover:bg-blue-100/10 hover:text-blue-600 dark:hover:text-blue-400 saturate-200 transition-colors duration-200"
              @click="commentEditor.$el.querySelector('textarea').focus()"
            >
              <IconChatBubble />
              <span class="sr-only">Comment</span>
            </button>
            <button
              class="p-2 rounded-full flex hover:bg-emerald-100/40 dark:hover:bg-emerald-100/10 hover:text-emerald-600 dark:hover:text-emerald-400 saturate-200 transition-colors duration-200"
              :class="{
                'text-neutral-600 dark:text-neutral-400': !isFavorite(item.id),
                'text-emerald-600 dark:text-emerald-400': isFavorite(item.id)
              }"
              @click="handleFavorite"
            >
              <IconArrowPath :active="isFavorite(item.id)" />
              <span class="sr-only">Repost</span>
            </button>
            <button
              class="p-2 rounded-full flex hover:bg-rose-100/40 dark:hover:bg-rose-100/10 hover:text-rose-600 dark:hover:text-rose-400 saturate-200 transition-colors duration-200"
              :class="{
                'text-neutral-600 dark:text-neutral-400': !isFavorite(item.id),
                'text-rose-600 dark:text-rose-400': isFavorite(item.id)
              }"
              @click="handleFavorite"
            >
              <IconHeart :active="isFavorite(item.id)" />
              <span class="sr-only">Love</span>
            </button>
            <button
              class="p-2 flex gap-4 rounded-full flex hover:bg-amber-100/40 dark:hover:bg-amber-100/10 hover:text-amber-600 dark:hover:text-amber-400 saturate-200 transition-colors duration-200"
              :class="{
                'text-neutral-600 dark:text-neutral-400': !isBookmark(item.id),
                'text-amber-600 dark:text-amber-400': isBookmark(item.id)
              }"
              @click="handleBookmark"
            >
              <IconBookmark :active="isBookmark(item.id)" />
              <span class="sr-only">Bookmark</span>
            </button>
            <button
              class="p-2 rounded-full flex text-neutral-600 dark:text-neutral-400 hover:bg-indigo-100/40 dark:hover:bg-indigo-100/10 hover:text-indigo-800 dark:hover:text-indigo-400 saturate-200 transition-colors duration-200"
              @click="item && share(item.id)"
            >
              <IconShare class="mr-1" />
              <span class="sr-only">Share</span>
          </button>
          </div>
        </div>
      </article>
    </div>
    <hr class="border-neutral-100 dark:border-neutral-900" />
    <div class="border-b border-neutral-100 dark:border-neutral-900">
      <p class="ml-20 mt-4 text-neutral-500 font-medium">
        Replying to
        <NuxtLink :to="`/${item.author.username}`" class="text-sky-600 dark:text-sky-400 group">
          @<span class="group-hover:underline">{{ item.author.username }}</span>
        </NuxtLink>
      </p>
      <CommentEditor
        v-if="item"
        v-model="text"
        ref="commentEditor"
        :parent-id="item.id"
        @submit="update"
      />
    </div>
    <div v-if="comments" class="divide-y divide-neutral-100 dark:divide-neutral-900">
      <FeedItem
        v-for="comment in comments"
        :key="comment.id"
        :item="comment"
        @update="updateUser"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  user,
  updateUser
} = useUser()

const {
  isBookmark,
  isFavorite,
  createdDate,
  share,
  bookmark,
  favorite
} = usePost()

if (!user.value) {
  throw createError({ statusCode: 501, message: 'Access Denied' })
}

const route = useRoute()
const { data: item, refresh } = await useFetch(`/api/posts/${route.params.id}`)

const parentItem = ref()
if (item.value?.parentId) {
  const { data } = await useFetch(`/api/posts/${item.value.parentId}`)
  parentItem.value = data.value
}

if (!item.value) {
  throw createError({ statusCode: 404, message: 'Page Not Found' })
}

const { data: comments, refresh: refreshComments } = await useFetch<[Post]>(`/api/posts/${route.params.id}/comments`)

const title = useTitle()
title.value = 'Post'
const cursor = ref()
const el = ref()
const commentEditor = ref()
const text = ref('')

useInfiniteScroll(el, async () => {
  if (comments.value && user.value) {
    const lastId = comments.value[comments.value.length - 1].id
    if (lastId === cursor.value) return

    cursor.value = lastId
    const { data } = await useFetch<[Post]>(`/api/posts/${route.params.id}/comments`, {
      params: {
        cursor: cursor.value
      }
    })
    if (data.value) {
      comments.value.push(...data.value)
    }
  }
})

const update = async () => {
  if (!user.value) return
  await refresh()
  await refreshComments()
  await updateUser()
}

const handleFavorite = async () => {
  if (!item.value) return
  await favorite(item.value.id)
  await update()
}

const handleBookmark = async () => {
  if (!item.value) return
  await bookmark(item.value.id)
  await update()
}
</script>