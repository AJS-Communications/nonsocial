<template>
  <div v-if="item">
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
      <div ref="moreBtn" class="absolute z-10 top-2 right-2 w-min">
        <button
          class="p-2 rounded-full flex text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/40 dark:hover:bg-neutral-200/10 hover:text-neutral-800 dark:hover:text-neutral-400 saturate-200 transition-colors duration-200"
          :class="{ 'bg-neutral-200/40 dark:bg-neutral-200/10 text-neutral-800 dark:text-neutral-400': showMoreDropdown }"
          @click.stop="showMoreDropdown = !showMoreDropdown"
        >
          <IconMore />
          <span class="sr-only">More options</span>
        </button>
        <nav v-if="showMoreDropdown" class="absolute left-auto right-0 z-20 w-56 my-2 border shadow-md shadow-neutral-100 dark:shadow-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 py-3 rounded-xl">
          <button
            class="w-full text-left flex gap-2 text-neutral-600 hover:text-black hover:bg-neutral-200 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 px-4 py-2"
            @click="handleShare"
          >
            <IconShare class="text-indigo-600 dark:text-indigo-400" size="sm" />
            <span>Share post via...</span>
          </button>
        </nav>
      </div>
      <div
        v-if="parentItem"
        class="bg-neutral-200 dark:bg-neutral-800 w-1 absolute top-10 left-[2.35rem] bottom-10 -z-10"
      />
      <LazyFeedItem v-if="parentItem" :item-id="parentItem.id" @update="updateUser" />
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
        <div class="px-4 py-2 space-y-2">
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
              <span class="font-bold">{{ item.counts.boostCount }}</span>
              <span class="text-neutral-500">{{ item.counts.boostCount === 1 ? 'Boost' : 'Boosts' }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-bold">{{ item.counts.likeCount }}</span>
              <span class="text-neutral-500">{{ item.counts.likeCount === 1 ? 'Like' : 'Likes' }}</span>
            </div>
          </div>
          <hr class="border-neutral-100 dark:border-neutral-900" />
          <div class="flex justify-around gap-2">
            <ModalComment
              v-slot="{ toggle }"
              :item="item"
            >
              <button
                class="w-min flex gap-1 z-10 px-2 transition-colors duration-200 group text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 saturate-200"
                @click="toggle"
              >
                <IconChatBubble
                  class="rounded-full p-2 group-hover:bg-blue-100/40 dark:group-hover:bg-blue-100/10"
                />
                <span class="sr-only">Comment</span>
              </button>
            </ModalComment>
            <button
              class="p-2 rounded-full flex hover:bg-emerald-100/40 dark:hover:bg-emerald-100/10 hover:text-emerald-600 dark:hover:text-emerald-400 saturate-200 transition-colors duration-200"
              :class="{
                'text-neutral-600 dark:text-neutral-400': !isBoost(item.id),
                'text-emerald-600 dark:text-emerald-400': isBoost(item.id)
              }"
              @click="handleBoost"
            >
              <IconArrowPath :active="isBoost(item.id)" />
              <span class="sr-only">Boost</span>
            </button>
            <button
              class="p-2 rounded-full flex hover:bg-rose-100/40 dark:hover:bg-rose-100/10 hover:text-rose-600 dark:hover:text-rose-400 saturate-200 transition-colors duration-200"
              :class="{
                'text-neutral-600 dark:text-neutral-400': !isLike(item.id),
                'text-rose-600 dark:text-rose-400': isLike(item.id)
              }"
              @click="handleLike"
            >
              <IconHeart :active="isLike(item.id)" />
              <span class="sr-only">Love</span>
            </button>
            <button
              class="p-2 rounded-full flex hover:bg-amber-100/40 dark:hover:bg-amber-100/10 hover:text-amber-600 dark:hover:text-amber-400 saturate-200 transition-colors duration-200"
              :class="{
                'text-neutral-600 dark:text-neutral-400': !isBookmark(item.id),
                'text-amber-600 dark:text-amber-400': isBookmark(item.id)
              }"
              @click="handleBookmark"
            >
              <IconBookmark :active="isBookmark(item.id)" />
              <span class="sr-only">Bookmark</span>
            </button>
          </div>
        </div>
      </article>
    </div>
    <hr class="border-neutral-100 dark:border-neutral-900" />
    <div class="border-b border-neutral-100 dark:border-neutral-900 p-4">
      <CommentEditor
        v-if="item"
        v-model="text"
        ref="commentEditor"
        :item="item"
        @submit="update"
      />
    </div>
    <div v-if="comments" class="divide-y divide-neutral-100 dark:divide-neutral-900">
      <LazyFeedItem
        v-for="comment in comments"
        :key="comment.id"
        :item-id="comment.id"
        show-comments
        @update="updateUser"
      />
    </div>
    <div ref="el" />
  </div>
</template>

<script setup lang="ts">
const {
  user,
  updateUser
} = useUser()

const {
  isBookmark,
  isLike,
  isBoost,
  createdDate,
  share,
  bookmark,
  like,
  boost
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

const moreBtn = ref()
const showMoreDropdown = ref(false)
onClickOutside(moreBtn, () => showMoreDropdown.value = false)
onKeyStroke('Escape', () => showMoreDropdown.value = false)

useIntersectionObserver(el, async ([{ isIntersecting }]) => {
  if (comments.value && user.value && isIntersecting) {
    const lastItem = comments.value[comments.value.length - 1]
    const lastId = lastItem && lastItem.id || null
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

useNuxtApp().hooks.hook('compose' as any, async () => {
  await update()
})

const handleLike = async () => {
  if (!item.value) return
  await like(item.value.id)
  await update()
}

const handleBookmark = async () => {
  if (!item.value) return
  await bookmark(item.value.id)
  await update()
  showMoreDropdown.value = false
}

const handleBoost = async () => {
  if (!item.value) return
  await boost(item.value.id)
  await update()
}

const handleShare = async () => {
  if (!item.value) return
  share(item.value.id)
  showMoreDropdown.value = false
}
</script>