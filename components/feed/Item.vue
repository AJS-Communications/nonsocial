<template>
  <div
    v-if="data?.item"
    class="relative"
  >
    <div
      v-if="showComments && commenterList.length > 0"
      class="bg-neutral-200 dark:bg-neutral-800 w-1 absolute top-10 left-[2.35rem] bottom-24 -z-10"
    />
    <article class="relative flex flex-col gap-1 p-4">
      <div v-if="showComments">
        <div ref="moreBtn" class="absolute z-10 top-2 right-2 w-min">
          <button
            class="cursor-pointer flex gap-1 w-min z-10 p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/40 dark:hover:bg-neutral-200/10 hover:text-neutral-800 dark:hover:text-neutral-400 saturate-200 transition-colors duration-200"
            :class="{ 'bg-neutral-200/40 dark:bg-neutral-200/10 text-neutral-800 dark:text-neutral-400': showMoreDropdown }"
            @click.stop="showMoreDropdown = !showMoreDropdown"
          >
            <IconMore size="sm" />
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
      </div>
      <div v-if="boostList.length > 0" class="flex items-center gap-2 text-neutral-500 text-sm ml-10 font-medium">
        <IconArrowPath active size="sm" />
        <div class="flex gap-1">
          <span
            v-for="(boost, index) in boostList"
            :key="boost.id"
          >{{ boost.author.username }} {{ index < boostList.length - 1 ? 'and ' : '' }}</span>
          <span>boosted</span>
        </div>
      </div>
      <div v-if="showComments && boostList.length < 1 && commenterList.length > 0" class="flex items-center gap-2 text-neutral-500 text-sm ml-10 font-medium">
        <IconChatBubble active size="sm" />
        <div class="flex gap-1">
          <span
            v-for="(commenter, index) in commenterList"
            :key="commenter.id"
          >{{ commenter.author.username }}  {{ index < commenterList.length - 1 ? 'and ' : '' }}</span>
          <span>commented</span>
        </div>
      </div>
      <div v-if="boostList.length < 1 && commenterList.length < 1 && likeList.length > 0" class="flex items-center gap-2 text-neutral-500 text-sm ml-10 font-medium">
        <IconHeart active size="sm" />
        <div class="flex gap-1">
          <span
            v-for="(like, index) in likeList"
            :key="like.id"
          >{{ like.author.username }}  {{ index < likeList.length - 1 ? 'and ' : '' }}</span>
          <span>liked</span>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <img
          v-if="data.item.author"
          :src="data.item.author.photoUrl"
          :alt="data.item.author.username"
          class="mb-auto flex-none w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-4 ring-white dark:ring-black bg-white dark:bg-black"
          loading="lazy"
          decoding="async"
        >
        <div class="flex-auto">
          <NuxtLink
            :to="`/posts/${data.item.id}`"
            class="my-auto group"
          >
            <span class="absolute inset-0 group-focus-visible:border border-black dark:border-white" />
            <span class="sr-only">Go to post</span>
          </NuxtLink>
          <div class="text-base font-semibold flex gap-2">
            <NuxtLink
              v-if="data.item.author"
              :to="`/${data.item.author?.username}`"
              class="my-auto hover:underline z-10"
            >
              <span>{{ data.item.author.username }}</span>
            </NuxtLink>
            <div class="mt-0.5 text-sm text-neutral-500 whitespace-nowrap space-x-2">
              <span>&middot;</span>
              <span>{{ createdDate(data.item.createdDate) }}</span>
            </div>
          </div>
          <div v-if="data.parentItem?.author" class="text-neutral-500 font-medium">
            Replying to
            <NuxtLink
              :to="`/${data.parentItem.author.username}`"
              class="relative text-sky-600 dark:text-sky-400 z-10 group"
            >
              @<span class="group-hover:underline">{{ data.parentItem.author.username }}</span>
            </NuxtLink>
          </div>
          <blockquote class="mt-0.5 max-w-prose">
            <div class="font-sans whitespace-pre-line">{{ data.item.text }}</div>
          </blockquote>
          <div class="grid grid-cols-4 gap-2 mt-2">
            <div>
              <ModalComment
                v-slot="{ toggle }"
                :item="data.item"
              >
                <button
                  class="w-min flex gap-1 z-10 px-2 transition-colors duration-200 group text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 saturate-200"
                  @click="toggle"
                >
                  <IconChatBubble
                    size="sm"
                    class="rounded-full p-2 group-hover:bg-blue-100/40 dark:group-hover:bg-blue-100/10"
                  />
                  <span class="sr-only">Comment</span>
                  <span v-if="data.item.counts?.commentCount > 0" class="my-auto text-sm">{{ data.item.counts?.commentCount }}</span>
                </button>
              </ModalComment>
            </div>
            <div>
              <button
                class="flex gap-1 z-10 px-2 transition-colors duration-200 group hover:text-emerald-600 dark:hover:text-emerald-400 saturate-200"
                :class="{
                  'text-neutral-600 dark:text-neutral-400': !isBoost(data.item.id),
                  'text-emerald-600 dark:text-emerald-400': isBoost(data.item.id)
                }"
                @click="handleBoost"
              >
                <IconArrowPath
                  :active="isBoost(data.item.id)"
                  size="sm"
                  class="rounded-full p-2 group-hover:bg-emerald-100/40 dark:group-hover:bg-emerald-100/10"
                />
                <span class="sr-only">Boost</span>
                <span v-if="data.item.counts?.boostCount > 0" class="my-auto text-sm">{{ data.item.counts?.boostCount }}</span>
              </button>
            </div>
            <div>
              <button
                class="flex gap-1 z-10 px-2 transition-colors duration-200 group hover:text-rose-600 dark:hover:text-rose-400 saturate-200"
                :class="{
                  'text-neutral-600 dark:text-neutral-400': !isLike(data.item.id),
                  'text-rose-600 dark:text-rose-400': isLike(data.item.id)
                }"
                @click="handleLike"
              >
                <IconHeart
                  :active="isLike(data.item.id)"
                  size="sm"
                  class="rounded-full p-2 group-hover:bg-rose-100/40 dark:group-hover:bg-rose-100/10"
                />
                <span class="sr-only">Love</span>
                <span v-if="data.item.counts?.likeCount > 0" class="my-auto text-sm">{{ data.item.counts?.likeCount }}</span>
              </button>
            </div>
            <div>
              <button
                class="flex gap-1 z-10 px-2 transition-colors duration-200 group hover:text-amber-600 dark:hover:text-amber-400 saturate-200"
                :class="{
                  'text-neutral-600 dark:text-neutral-400': !isBookmark(data.item.id),
                  'text-amber-600 dark:text-amber-400': isBookmark(data.item.id)
                }"
                @click="handleBookmark"
              >
                <IconBookmark
                  :active="isBookmark(data.item.id)"
                  size="sm"
                  class="rounded-full p-2 group-hover:bg-amber-100/40 dark:group-hover:bg-amber-100/10"
                />
                <span class="sr-only">Bookmark</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
    <LazyFeedItem
      v-if="showComments && commenterList.length > 0"
      :item-id="commenterList[commenterList.length - 1].id"
      show-comments
    />
  </div>
</template>

<script setup lang="ts">
const {
  $api,
  $auth: {
    user
  },
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

const props = defineProps({
  itemId: { type: String, required: true },
  showComments: { type: Boolean, default: false }
})

const { data, refresh } = await useAsyncData(`item-${props.itemId}`, async () => {
  const item = await $api<Post>(`/api/posts/${props.itemId}`)
  const parentItem = item?.parentId ? await $api<Post>(`/api/posts/${item.parentId}`) : null
  return { item, parentItem }
})

const emit = defineEmits(['update'])

const likeList = computed(() => {
  if (!data.value?.item?.likes) return []
  return data.value?.item.likes.filter(i => {
    return user.value?.followers.find(x => x.followingId === i.authorId)
  }).slice(0, 2) || []
})

const boostList = computed(() => {
  if (!data.value?.item?.boosts) return []
  return data.value?.item.boosts.filter(i => {
    return user.value?.followers.find(x => x.followingId === i.authorId)
  }).slice(0, 2) || []
})

const commenterList = computed(() => {
  if (!data.value?.item?.commenters) return []
  return data.value?.item.commenters.filter(i => {
    return user.value?.followers.find(x => x.followingId === i.author.id)
  }).slice(0, 2) || []
})

const moreBtn = ref()
const showMoreDropdown = ref(false)
onClickOutside(moreBtn, () => showMoreDropdown.value = false)
onKeyStroke('Escape', () => showMoreDropdown.value = false)

const update = async () => {
  await refresh()
  emit('update')
}

useNuxtApp().hooks.hook('compose', async () => {
  await update()
})

const handleBookmark = async () => {
  if (!data.value?.item) return
  await bookmark(data.value?.item.id)
  await update()
  showMoreDropdown.value = false
}

const handleLike = async () => {
  if (!data.value?.item) return
  await like(data.value?.item.id)
  await update()
}

const handleBoost = async () => {
  if (!data.value?.item) return
  await boost(data.value?.item.id)
  await update()
}

const handleShare = async () => {
  if (!data.value?.item) return
  share(data.value?.item.id)
  showMoreDropdown.value = false
}
</script>