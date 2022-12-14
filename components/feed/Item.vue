<template>
  <div v-if="item" class="relative">
    <div
      v-if="showComments && commenterList.length > 0"
      class="bg-neutral-200 dark:bg-neutral-800 w-1 absolute top-10 left-[2.35rem] bottom-24 -z-10"
    />
    <article class="relative flex flex-col gap-1 p-4">
      <div>
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
          >{{ boost.author.name }} {{ index < boostList.length - 1 ? 'and ' : '' }}</span>
          <span>boosted</span>
        </div>
      </div>
      <div v-if="showComments && boostList.length < 1 && commenterList.length > 0" class="flex items-center gap-2 text-neutral-500 text-sm ml-10 font-medium">
        <IconChatBubble active size="sm" />
        <div class="flex gap-1">
          <span
            v-for="(commenter, index) in commenterList"
            :key="commenter.id"
          >{{ commenter.author.name }}  {{ index < commenterList.length - 1 ? 'and ' : '' }}</span>
          <span>commented</span>
        </div>
      </div>
      <div v-if="boostList.length < 1 && commenterList.length < 1 && likeList.length > 0" class="flex items-center gap-2 text-neutral-500 text-sm ml-10 font-medium">
        <IconHeart active size="sm" />
        <div class="flex gap-1">
          <span
            v-for="(like, index) in likeList"
            :key="like.id"
          >{{ like.author.name }}  {{ index < likeList.length - 1 ? 'and ' : '' }}</span>
          <span>liked</span>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <img
          :src="item.author.photoUrl"
          :alt="item.author.name || ''"
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
              <ModalComment
                v-slot="{ toggle }"
                :item="item"
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
                  <span v-if="item.counts.commentCount > 0" class="my-auto text-sm">{{ item.counts.commentCount }}</span>
                </button>
              </ModalComment>
            </div>
            <div>
              <button
                class="flex gap-1 z-10 px-2 transition-colors duration-200 group hover:text-emerald-600 dark:hover:text-emerald-400 saturate-200"
                :class="{
                  'text-neutral-600 dark:text-neutral-400': !isBoost(item.id),
                  'text-emerald-600 dark:text-emerald-400': isBoost(item.id)
                }"
                @click="handleBoost"
              >
                <IconArrowPath
                  :active="isBoost(item.id)"
                  size="sm"
                  class="rounded-full p-2 group-hover:bg-emerald-100/40 dark:group-hover:bg-emerald-100/10"
                />
                <span class="sr-only">Boost</span>
                <span v-if="item.counts.boostCount > 0" class="my-auto text-sm">{{ item.counts.boostCount }}</span>
              </button>
            </div>
            <div>
              <button
                class="flex gap-1 z-10 px-2 transition-colors duration-200 group hover:text-rose-600 dark:hover:text-rose-400 saturate-200"
                :class="{
                  'text-neutral-600 dark:text-neutral-400': !isLike(item.id),
                  'text-rose-600 dark:text-rose-400': isLike(item.id)
                }"
                @click="handleLike"
              >
                <IconHeart
                  :active="isLike(item.id)"
                  size="sm"
                  class="rounded-full p-2 group-hover:bg-rose-100/40 dark:group-hover:bg-rose-100/10"
                />
                <span class="sr-only">Love</span>
                <span v-if="item.counts.likeCount > 0" class="my-auto text-sm">{{ item.counts.likeCount }}</span>
              </button>
            </div>
            <div>
              <button
                class="flex gap-1 z-10 px-2 transition-colors duration-200 group hover:text-amber-600 dark:hover:text-amber-400 saturate-200"
                :class="{
                  'text-neutral-600 dark:text-neutral-400': !isBookmark(item.id),
                  'text-amber-600 dark:text-amber-400': isBookmark(item.id)
                }"
                @click="handleBookmark"
              >
                <IconBookmark
                  :active="isBookmark(item.id)"
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
const { user } = useUser()

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

const props = defineProps({
  itemId: { type: Number, required: true },
  showComments: { type: Boolean, default: false }
})

const { data: item, refresh } = await useFetch(`/api/posts/${props.itemId}`)

const parentItem = ref()
if (item.value?.parentId) {
  const { data } = await useFetch(`/api/posts/${item.value.parentId}`)
  parentItem.value = data.value
}

const emit = defineEmits(['update'])

const likeList = computed(() => {
  if (!item.value) return []
  return item.value.likes.filter(i => {
    return user.value?.followers.find(x => x.followingId === i.authorId)
  }).slice(0, 2) || []
})

const boostList = computed(() => {
  if (!item.value) return []
  return item.value.boosts.filter(i => {
    return user.value?.followers.find(x => x.followingId === i.authorId)
  }).slice(0, 2) || []
})

const commenterList = computed(() => {
  if (!item.value) return []
  return item.value.commenters.filter(i => {
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

useNuxtApp().hooks.hook('compose' as any, async () => {
  await update()
})

const handleBookmark = async () => {
  if (!item.value) return
  await bookmark(item.value.id)
  await update()
  showMoreDropdown.value = false
}

const handleLike = async () => {
  if (!item.value) return
  await like(item.value.id)
  await update()
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