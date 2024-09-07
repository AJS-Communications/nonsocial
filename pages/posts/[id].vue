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
      <div
        ref="moreBtn"
        class="absolute z-10 top-2 right-2 w-min"
      >
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
        v-if="item.parent"
        class="bg-neutral-200 dark:bg-neutral-800 w-1 absolute top-10 left-[2.35rem] bottom-10 -z-10"
      />
      <LazyFeedItem
        v-if="item.parent"
        :item="item.parent"
      />
      <article
        v-if="item.author"
        class="bg-white dark:bg-black"
      >
        <div class="relative flex flex-col-reverse px-4 pb-2 mt-4">
          <div class="flex items-center space-x-4">
            <img
              v-if="item.author.photoUrl"
              :src="item.author.photoUrl"
              :alt="item.author.username"
              class="mb-auto flex-none w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-4 ring-white dark:ring-black bg-white dark:bg-black"
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
                  {{ item.author.username }}
                </NuxtLink>
              </div>
              <p class="text-neutral-500 font-medium">{{ createdDate(item.createdDate, 'long') }}</p>
            </div>
          </div>
        </div>
        <div class="px-4 py-2 space-y-2">
          <p v-if="item.parent" class="text-neutral-500 font-medium">
            Replying to
            <NuxtLink :to="`/${item.parent.author.username}`" class="text-sky-600 dark:text-sky-400 group">
              @<span class="group-hover:underline">{{ item.parent.author.username }}</span>
            </NuxtLink>
          </p>
          <blockquote class="max-w-prose text-2xl pb-4">
            <div
              class="font-sans whitespace-pre-line"
              v-html="formattedText"
            />
          </blockquote>
          <hr class="border-neutral-100 dark:border-neutral-900" />
          <div class="flex gap-4 sm:gap-12 text-sm">
            <div class="flex gap-2">
              <span class="font-bold">{{ item._count.children }}</span>
              <span class="text-neutral-500">{{ item._count.children === 1 ? 'Comment' : 'Comments' }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-bold">{{ item._count.boosts }}</span>
              <span class="text-neutral-500">{{ item._count.boosts === 1 ? 'Boost' : 'Boosts' }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-bold">{{ item._count.likes }}</span>
              <span class="text-neutral-500">{{ item._count.likes === 1 ? 'Like' : 'Likes' }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-bold">{{ item._count.bookmarks }}</span>
              <span class="text-neutral-500">{{ item._count.bookmarks === 1 ? 'Bookmarks' : 'Bookmarks' }}</span>
            </div>
          </div>
          <hr class="border-neutral-100 dark:border-neutral-900" />
          <div class="flex justify-around gap-2">
            <ModalComment
              v-slot="{ toggle }"
              v-model="item"
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
              <IconArrowPath
                v-if="item"
                :active="isBoost(item.id)"
              />
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
              <IconHeart
                v-if="item"
                :active="isLike(item.id)"
              />
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
              <IconBookmark
                v-if="item"
                :active="isBookmark(item.id)"
              />
              <span class="sr-only">Bookmark</span>
            </button>
          </div>
        </div>
      </article>
    </div>
    <hr class="border-neutral-100 dark:border-neutral-900" />
    <div class="border-b border-neutral-100 dark:border-neutral-900 p-4">
      <CommentEditor
        v-model="text"
        ref="commentEditor"
        :item="item"
        @submit="update"
      />
    </div>
    <div
      v-if="item.children"
      class="divide-y divide-neutral-100 dark:divide-neutral-900"
    >
      <LazyFeedItem
        v-for="comment in item.children"
        :key="comment.id"
        :item="comment"
        show-comments
      />
    </div>
    <div ref="el" />
  </div>
</template>

<script setup lang="ts">
const {
  $api,
  $auth: { user },
  $post: {
    isBookmark,
    isLike,
    isBoost,
    createdDate,
    share,
    bookmark,
    like,
    boost
  }
} = useNuxtApp()

if (!user.value) {
  throw createError({ statusCode: 501, message: 'Access Denied' })
}

const route = useRoute()

const { data: item, refresh } = await useApiFetch<Post>(`/api/posts/${route.params.id}`)

if (!item.value) {
  throw createError({ statusCode: 404, message: 'Page Not Found' })
}

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
  if (item.value?.children && user.value && route.params.id && isIntersecting) {
    const lastItem = item.value?.children[item.value?.children.length - 1]
    const lastId = lastItem && lastItem.id || undefined
    if (lastId === cursor.value) return

    cursor.value = lastId
    const newComments = await $api<[Post]>(`/api/posts/${route.params.id}/comments`, {
      params: {
        cursor: cursor.value
      }
    })
    if (item.value) {
      item.value?.children.push(...newComments)
    }
  }
})

const formattedText = computed(() => {
  return parsePostText(item.value?.text)
})

const update = async () => {
  if (!user.value) return
  await refresh()
}

const handleLike = async () => {
  if (!item.value) return
  await like(item.value?.id)
  await update()
}

const handleBookmark = async () => {
  if (!item.value) return
  await bookmark(item.value?.id)
  await update()
  showMoreDropdown.value = false
}

const handleBoost = async () => {
  if (!item.value) return
  await boost(item.value?.id)
  await update()
}

const handleShare = async () => {
  if (!item.value) return
  share(item.value?.id)
  showMoreDropdown.value = false
}
</script>