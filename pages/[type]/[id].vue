<template>
  <div>
    <div class="border-b border-neutral-100 dark:border-neutral-900 bg-white/80 dark:bg-black/80 backdrop-blur sticky top-0 z-10">
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
      <figure class="relative flex flex-col-reverse p-4 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors duration-100">
        <figcaption class="flex items-center space-x-4">
          <img
            :src="item?.user.photoUrl"
            :alt="item?.user.fullName"
            class="mb-auto flex-none w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
            loading="lazy"
            decoding="async"
          >
          <div class="flex-auto">
            <div class="text-base font-semibold flex gap-1">
              <template v-if="item?.type.name === 'statusUpdate'">
                <IconChatBubble size="sm" class="mt-1" />
              </template>
              <template v-if="item?.type.name === 'blogPost'">
                <IconNewspaper size="sm" class="mt-1" />
              </template>
              <template v-if="item?.type.name === 'event'">
                <IconCalendar size="sm" class="mt-1" />
              </template>
              <template v-if="item?.type.name === 'photo'">
                <IconPhoto size="sm" class="mt-1" />
              </template>
              <template v-if="item?.type.name === 'video'">
                <IconVideo size="sm" class="mt-1" />
              </template>
              <NuxtLink
                to="/profile"
                class="text-sky-600 dark:text-sky-300 my-auto"
                tabindex="0"
              >
                <span class="absolute inset-0" />
                {{ item?.user.fullName }}
              </NuxtLink>
            </div>
          </div>
        </figcaption>
      </figure>
      <div class="p-4 pb-4 space-y-4">
        <h2 v-if="item?.title" class="text-3xl font-bold">{{ item?.title }}</h2>
        <blockquote class="max-w-prose text-2xl pb-2">
          <p>{{ item?.description }}</p>
        </blockquote>
        <p class="text-neutral-500 font-medium pb-2">{{ createdDate }}</p>
        <hr class="border-neutral-100 dark:border-neutral-900" />
        <div class="flex justify-around gap-2">
          <button class="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 flex">
            <IconHeart />
            <span class="sr-only">Love</span>
          </button>
          <button class="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 flex">
            <IconBookmark />
            <span class="sr-only">Bookmark</span>
          </button>
          <NuxtLink :to="`mailto:?subject=Check this out!&body=${shareUrl}`" class="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 flex">
            <IconShare class="mr-1" />
            <span class="sr-only">Share</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data } = await useFetch(`/api/${route.params.type}/jshimkoski/${route.params.id}`, { initialCache: false })
const title = useTitle()
title.value = data.value?.type.title || ''

const item = computed(() => data.value)
const createdDate = computed(() => {
  return item.value && new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(item.value.createdDate))
})

const shareUrl = ref('')

onMounted(() => {
  shareUrl.value = window.location.href
})
</script>