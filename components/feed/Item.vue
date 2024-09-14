<template>
  <div
    v-if="localItem"
    class="relative"
  >
    <div
      v-if="localItem.children?.length > 0"
      class="bg-neutral-200 dark:bg-neutral-800 w-1 absolute top-10 left-[2.35rem] bottom-28 -z-10"
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
      <div v-if="localItem.likes?.filter(i => i.authorId !== user?.id ).length > 0" class="flex items-center gap-2 text-neutral-500 text-sm ml-10 font-medium">
        <IconHeart active size="sm" />
        <div class="flex gap-1">
          <span
            v-for="(like, index) in localItem.likes"
            :key="like.id"
          >{{ like.author.name || like.author.username }}  {{ index < localItem.likes.length - 1 ? 'and ' : '' }}</span>
          <span>liked</span>
        </div>
      </div>
      <div v-if="localItem.children?.filter(i => i.authorId !== user?.id ).length > 0" class="flex items-center gap-2 text-neutral-500 text-sm ml-10 font-medium">
        <IconChatBubble active size="sm" />
        <div class="flex gap-1">
          <span
            v-for="(commenter, index) in localItem.children.filter((item, index, self) =>
              index === self.findIndex((c) => c.authorId === item.authorId)
            )"
            :key="commenter.id"
          >{{ commenter.author.name || commenter.author.username }} {{ index < localItem.children.filter((item, index, self) =>
              index === self.findIndex((c) => c.authorId === item.authorId)
            ).length - 1 ? 'and ' : '' }}</span>
          <span>commented</span>
        </div>
      </div>
      <div v-if="localItem.boosts?.filter(i => i.authorId !== user?.id ).length > 0" class="flex items-center gap-2 text-neutral-500 text-sm ml-10 font-medium">
        <IconArrowPath active size="sm" />
        <div class="flex gap-1">
          <span
            v-for="(boost, index) in localItem.boosts"
            :key="boost.id"
          >{{ boost.author.name || boost.author.username }} {{ index < localItem.boosts.length - 1 ? 'and ' : '' }}</span>
          <span>boosted</span>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <img
          v-if="localItem.author"
          :src="localItem.author.photoUrl"
          :alt="localItem.author.username"
          class="mb-auto flex-none w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-4 ring-white dark:ring-black bg-white dark:bg-black"
          loading="lazy"
          decoding="async"
        >
        <div class="flex-auto">
          <NuxtLink
            :to="`/posts/${localItem.id}`"
            class="my-auto group"
          >
            <span class="absolute inset-0 group-focus-visible:border border-black dark:border-white" />
            <span class="sr-only">Go to post</span>
          </NuxtLink>
          <div class="text-base font-semibold flex gap-2">
            <NuxtLink
              v-if="localItem.author"
              :to="`/${localItem.author?.username}`"
              class="my-auto hover:underline z-10"
            >
              <span>{{ localItem.author.name || localItem.author.username }}</span>
            </NuxtLink>
            <div class="mt-0.5 text-sm text-neutral-500 whitespace-nowrap space-x-2">
              <span>&middot;</span>
              <span>{{ createdDate(localItem.createdDate) }}</span>
            </div>
          </div>
          <div v-if="localItem.parent?.author" class="text-neutral-500 font-medium">
            Replying to
            <NuxtLink
              :to="`/${localItem.parent?.author.username}`"
              class="relative text-sky-700 dark:text-sky-300 z-10 group"
            >
              @<span class="group-hover:underline">{{ localItem.parent?.author.name || localItem.parent?.author.username }}</span>
            </NuxtLink>
          </div>
          <blockquote class="mt-0.5 max-w-max cursor-pointer relative">
            <div
              class="font-sans whitespace-pre-line"
              v-html="formattedText"
              @click="handlePostClick(localItem, $event)"
            />
          </blockquote>
          <div class="grid grid-cols-4 gap-2 mt-2">
            <div>
              <button
                class="flex gap-1 z-10 px-2 transition-colors duration-200 group hover:text-rose-600 dark:hover:text-rose-400 saturate-200"
                :class="{
                  'text-neutral-600 dark:text-neutral-400': !isLike(localItem.id),
                  'text-rose-600 dark:text-rose-400': isLike(localItem.id)
                }"
                @click="handleLike"
              >
                <IconHeart
                  :active="isLike(localItem.id)"
                  size="sm"
                  class="rounded-full p-2 group-hover:bg-rose-100/40 dark:group-hover:bg-rose-100/10"
                />
                <span class="sr-only">Love</span>
                <span v-if="localItem._count?.likes > 0" class="my-auto text-sm">{{ localItem._count?.likes }}</span>
              </button>
            </div>
            <div>
              <ModalComment
                v-slot="{ toggle }"
                v-model="localItem"
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
                  <span v-if="localItem._count?.children > 0" class="my-auto text-sm">{{ localItem._count?.children }}</span>
                </button>
              </ModalComment>
            </div>
            <div>
              <button
                class="flex gap-1 z-10 px-2 transition-colors duration-200 group hover:text-emerald-600 dark:hover:text-emerald-400 saturate-200"
                :class="{
                  'text-neutral-600 dark:text-neutral-400': !isBoost(localItem.id),
                  'text-emerald-600 dark:text-emerald-400': isBoost(localItem.id)
                }"
                @click="handleBoost"
              >
                <IconArrowPath
                  :active="isBoost(localItem.id)"
                  size="sm"
                  class="rounded-full p-2 group-hover:bg-emerald-100/40 dark:group-hover:bg-emerald-100/10"
                />
                <span class="sr-only">Boost</span>
                <span v-if="localItem._count?.boosts > 0" class="my-auto text-sm">{{ localItem._count?.boosts }}</span>
              </button>
            </div>
            <div>
              <button
                class="flex gap-1 z-10 px-2 transition-colors duration-200 group hover:text-amber-600 dark:hover:text-amber-400 saturate-200"
                :class="{
                  'text-neutral-600 dark:text-neutral-400': !isBookmark(localItem.id),
                  'text-amber-600 dark:text-amber-400': isBookmark(localItem.id)
                }"
                @click="handleBookmark"
              >
                <IconBookmark
                  :active="isBookmark(localItem.id)"
                  size="sm"
                  class="rounded-full p-2 group-hover:bg-amber-100/40 dark:group-hover:bg-amber-100/10"
                />
                <span class="sr-only">Bookmark</span>
                <span v-if="localItem._count?.bookmarks > 0" class="my-auto text-sm">{{ localItem._count?.bookmarks }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
    <LazyFeedItem
      v-for="child in localItem.children"
      :item="child"
    />
  </div>
</template>

<script setup lang="ts">
const {
  $auth: { user },
  $post: {
    isBookmark,
    isLike,
    isBoost,
    createdDate,
    share,
    bookmark,
    like,
    boost,
    update
  }
} = useNuxtApp()

const props = defineProps({
  item: { type: Object as PropType<Post> }
})

const localItem = ref(props.item)

watch(() => props.item, (value) => {
  localItem.value = value
})

const emit = defineEmits(['update:model-value'])

const formattedText = computed(() => {
  return parsePostText(localItem.value?.text)
})

const moreBtn = ref()
const showMoreDropdown = ref(false)
onClickOutside(moreBtn, () => showMoreDropdown.value = false)
onKeyStroke('Escape', () => showMoreDropdown.value = false)

const handleBookmark = async () => {
  if (!props.item) return
  await bookmark(props.item.id)
  localItem.value = await update(props.item)
  showMoreDropdown.value = false
}

const handleLike = async () => {
  if (!props.item) return
  await like(props.item.id)
  localItem.value = await update(props.item)
}

const handleBoost = async () => {
  if (!props.item) return
  await boost(props.item.id)
  localItem.value = await update(props.item)
}

const handleShare = async () => {
  if (!props.item) return
  share(props.item.id)
  showMoreDropdown.value = false
}
</script>