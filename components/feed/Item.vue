<template>
  <article class="relative flex flex-col gap-1 p-4">
    <!-- <p class="flex gap-2 text-neutral-500 text-sm ml-10 font-medium">
      <IconArrowPath active size="sm" />
      <span>USERNAME reposted</span>
    </p> -->
    <!-- <p class="flex gap-2 text-neutral-500 text-sm ml-10 font-medium">
      <IconHeart active size="sm" />
      <span>USERNAME liked</span>
    </p> -->
    <!-- <p class="flex gap-2 text-neutral-500 text-sm ml-10 font-medium">
      <IconChatBubble active size="sm" />
      <span>USERNAME commented</span>
    </p> -->
    <div class="flex items-center space-x-4">
      <img
        :src="item.author.photoUrl"
        :alt="item.author.name"
        class="mb-auto flex-none w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-4 ring-white dark:ring-black"
        loading="lazy"
        decoding="async"
      >
      <div class="flex-auto">
        <NuxtLink
          :to="`/posts/${item.id}`"
          class="my-auto group"
        >
          <span class="absolute inset-0 group-focus-visible:border border-black dark:border-white" />
          <span class="sr-only">Go to post</span>
        </NuxtLink>
        <div class="text-base font-semibold flex gap-2">
          <NuxtLink
            :to="`/${item.author.username}`"
            class="my-auto hover:underline z-10"
          >
            <span>{{ item.author.name }}</span>
          </NuxtLink>
          <div class="mt-0.5 text-sm text-neutral-500 whitespace-nowrap space-x-2">
            <span>&middot;</span>
            <span>{{ createdDate(item.createdDate) }}</span>
          </div>
        </div>
        <div v-if="parentItem" class="text-neutral-500 font-medium">
          Replying to
          <NuxtLink
            :to="`/${parentItem.author.username}`"
            class="relative text-sky-600 dark:text-sky-400 z-10 group"
          >
            @<span class="group-hover:underline">{{ parentItem.author.username }}</span>
          </NuxtLink>
        </div>
        <blockquote class="mt-0.5 max-w-prose">
          <div class="font-sans whitespace-pre-line">{{ item.text }}</div>
        </blockquote>
        <div class="grid grid-cols-4 gap-2 mt-2">
          <div>
            <NuxtLink
              :to="`/posts/${item.id}`"
              class="w-min flex gap-1 z-10 px-2 transition-colors duration-200 group text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 saturate-200"
            >
              <IconChatBubble
                size="sm"
                class="rounded-full p-2 group-hover:bg-blue-100/40 dark:group-hover:bg-blue-100/10"
              />
              <span class="sr-only">Comment</span>
              <span v-if="counts && counts?.commentCount > 0" class="my-auto text-sm">{{ counts?.commentCount }}</span>
            </NuxtLink>
          </div>
          <div>
            <button
              class="flex gap-1 z-10 px-2 transition-colors duration-200 group hover:text-emerald-600 dark:hover:text-emerald-400 saturate-200"
              :class="{
                'text-neutral-600 dark:text-neutral-400': !isRepost(item.id),
                'text-emerald-600 dark:text-emerald-400': isRepost(item.id)
              }"
              @click="handleRepost(item.id)"
            >
              <IconArrowPath
                :active="isRepost(item.id)"
                size="sm"
                class="rounded-full p-2 group-hover:bg-emerald-100/40 dark:group-hover:bg-emerald-100/10"
              />
              <span class="sr-only">Repost</span>
              <span v-if="counts && counts?.repostCount > 0" class="my-auto text-sm">{{ counts?.repostCount }}</span>
            </button>
          </div>
          <div>
            <button
              class="flex gap-1 z-10 px-2 transition-colors duration-200 group hover:text-rose-600 dark:hover:text-rose-400 saturate-200"
              :class="{
                'text-neutral-600 dark:text-neutral-400': !isFavorite(item.id),
                'text-rose-600 dark:text-rose-400': isFavorite(item.id)
              }"
              @click="handleFavorite(item.id)"
            >
              <IconHeart
                :active="isFavorite(item.id)"
                size="sm"
                class="rounded-full p-2 group-hover:bg-rose-100/40 dark:group-hover:bg-rose-100/10"
              />
              <span class="sr-only">Love</span>
              <span v-if="counts && counts?.favoriteCount > 0" class="my-auto text-sm">{{ counts?.favoriteCount }}</span>
            </button>
          </div>
          <div>
            <div ref="shareBtn" class="relative w-min">
              <button
                class="cursor-pointer flex gap-1 w-min z-10 p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-indigo-100/40 dark:hover:bg-indigo-100/10 hover:text-indigo-800 dark:hover:text-indigo-400 saturate-200 transition-colors duration-200"
                :class="{ 'bg-indigo-100/40 dark:bg-indigo-100/10 text-indigo-800 dark:text-indigo-400': showShareDropdown }"
                @click.stop="showShareDropdown = !showShareDropdown"
              >
                <IconShare size="sm" />
                <span class="sr-only">Share</span>
              </button>
              <nav v-if="showShareDropdown" class="absolute left-auto right-0 z-20 w-56 my-2 border shadow-md shadow-neutral-100 dark:shadow-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 py-3 rounded-xl">
                <button
                  class="w-full text-left flex gap-2 text-neutral-600 hover:text-black hover:bg-neutral-200 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 px-4 py-2"
                  @click="handleShare(item.id)"
                >
                  <IconShare class="text-indigo-600 dark:text-indigo-400" size="sm" />
                  <span>Share post via...</span>
                </button>
                <button
                class="w-full text-left flex gap-2 text-neutral-600 hover:text-black hover:bg-neutral-200 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 px-4 py-2"
                  @click="handleBookmark(item.id)"
                >
                  <IconBookmark
                    :active="isBookmark(item.id)"
                    size="sm"
                    :class="{
                      'text-amber-600 dark:text-amber-400': isBookmark(item.id)
                    }"
                  />
                  <span>Bookmark</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const {
  isBookmark,
  isFavorite,
  isRepost,
  createdDate,
  share,
  bookmark,
  favorite,
  repost
} = usePost()

const props = defineProps({
  item: { type: Object, required: true }
})

const parentItem = ref()
if (props.item.parentId) {
  const { data } = await useFetch(`/api/posts/${props.item.parentId}`)
  parentItem.value = data.value
}

const { data: counts, refresh } = await useFetch(`/api/posts/${props.item.id}/counts`)

const emit = defineEmits(['update'])

const shareBtn = ref()
const showShareDropdown = ref(false)
onClickOutside(shareBtn, () => showShareDropdown.value = false)
onKeyStroke('Escape', () => showShareDropdown.value = false)

const update = async () => {
  await refresh()
  emit('update')
}

const handleBookmark = async (itemId: number) => {
  await bookmark(itemId)
  await update()
  showShareDropdown.value = false
}

const handleFavorite = async (itemId: number) => {
  await favorite(itemId)
  await update()
}

const handleRepost = async (itemId: number) => {
  await repost(itemId)
  await update()
}

const handleShare = async (itemId: number) => {
  share(itemId)
  showShareDropdown.value = false
}
</script>