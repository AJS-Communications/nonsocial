<template>
  <figure v-if="item" class="relative flex flex-col-reverse p-4">
    <figcaption class="flex items-center space-x-4">
      <img
        :src="item.author.photoUrl"
        :alt="item.author.name"
        class="mb-auto flex-none w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
        loading="lazy"
        decoding="async"
      >
      <div class="flex-auto">
        <NuxtLink
          :to="`${item.type.route}/${item.id}`"
          class="my-auto group"
          tabindex="0"
        >
          <span class="absolute inset-0 group-focus-visible:border border-black dark:border-white" />
          <span class="sr-only">Go to post</span>
        </NuxtLink>
        <div class="text-base font-semibold flex gap-2">
          <template v-if="item.type.name === 'statusUpdate'">
            <IconChatBubble size="sm" class="mt-1" />
          </template>
          <template v-if="item.type.name === 'blogPost'">
            <IconNewspaper size="sm" class="mt-1" />
          </template>
          <template v-if="item.type.name === 'event'">
            <IconCalendar size="sm" class="mt-1" />
          </template>
          <template v-if="item.type.name === 'photo'">
            <IconPhoto size="sm" class="mt-1" />
          </template>
          <template v-if="item.type.name === 'video'">
            <IconVideo size="sm" class="mt-1" />
          </template>
          <NuxtLink
            :to="`profile`"
            class="my-auto hover:underline z-10"
            tabindex="0"
          >
            <span>{{ item.title || item.author.name }}</span>
          </NuxtLink>
          <div class="mt-0.5 text-sm text-neutral-500 whitespace-nowrap">
            {{ createdDate }}
          </div>
        </div>
        <div v-if="item.title" class="text-neutral-500 dark:text-neutral-400 text-sm font-bold">
          By {{ item.author.name }}
        </div>
        <blockquote class="mt-0.5 max-w-prose">
          <p>{{ item.description }}</p>
        </blockquote>
        <div class="grid grid-cols-3 gap-2 my-2">
          <div>
            <button
            class="flex z-10 p-2 rounded-full hover:bg-pink-100/40 dark:hover:bg-pink-100/10 hover:text-pink-800 dark:hover:text-pink-400 saturate-200 transition-colors duration-200"
            >
              <IconHeart size="sm" />
              <span class="sr-only">Love</span>
            </button>
          </div>
          <div>
            <button
            class="flex z-10 p-2 rounded-full hover:bg-green-100/40 dark:hover:bg-green-100/10 hover:text-green-800 dark:hover:text-green-400 saturate-200 transition-colors duration-200"
            >
              <IconBookmark size="sm" />
              <span class="sr-only">Bookmark</span>
            </button>
          </div>
          <div>
            <NuxtLink
              :to="`mailto:?subject=Check this out!&body=${shareUrl}`"
              class="flex w-min z-10 p-2 rounded-full hover:bg-sky-100/40 dark:hover:bg-sky-100/10 hover:text-sky-800 dark:hover:text-sky-400 saturate-200 transition-colors duration-200"
            >
              <IconShare size="sm" class="mr-1" />
              <span class="sr-only">Share</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
const props = defineProps({
  item: { type: Object }
})

const createdDate = computed(() => {
  return props.item && new Intl.DateTimeFormat('en-US').format(new Date(props.item.createdDate))
})

const shareUrl = ref('')

onMounted(() => {
  shareUrl.value = window.location.href
})
</script>