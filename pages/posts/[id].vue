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
      <figure class="relative flex flex-col-reverse px-4 pb-2 mt-4">
        <figcaption class="flex items-center space-x-4">
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
                to="/profile"
                class="hover:underline my-auto"
                tabindex="0"
              >
                {{ item?.author.name }}
              </NuxtLink>
            </div>
            <p class="text-neutral-600 dark:text-neutral-400 font-medium">{{ createdDate }}</p>
          </div>
        </figcaption>
      </figure>
      <div class="p-4 space-y-4">
        <blockquote class="max-w-prose text-2xl pb-4">
          <pre class="font-sans whitespace-pre">{{ item?.text }}</pre>
        </blockquote>
        <hr class="border-neutral-100 dark:border-neutral-900" />
        <div class="flex justify-around gap-2">
          <button
            class="p-2 rounded-full flex hover:bg-red-100/40 dark:hover:bg-red-100/10 hover:text-red-800 dark:hover:text-red-400 saturate-200 transition-colors duration-200"
          >
            <IconHeart />
            <span class="sr-only">Love</span>
          </button>
          <button
            class="p-2 rounded-full flex hover:bg-green-100/40 dark:hover:bg-green-100/10 hover:text-green-800 dark:hover:text-green-400 saturate-200 transition-colors duration-200"
          >
            <IconBookmark />
            <span class="sr-only">Bookmark</span>
          </button>
          <NuxtLink
            :to="`mailto:?subject=Check this out!&body=${shareUrl}`"
            class="p-2 rounded-full flex hover:bg-sky-100/40 dark:hover:bg-sky-100/10 hover:text-sky-800 dark:hover:text-sky-400 saturate-200 transition-colors duration-200"
          >
            <IconShare class="mr-1" />
            <span class="sr-only">Share</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useUser()

if (!user.value) {
  throw createError({ statusCode: 501, message: 'Access Denied!' })
}

const route = useRoute()
const { data } = await useFetch(`/api/posts/${user.value.id}/${route.params.id}`)
const title = useTitle()
title.value = 'Post'

const item = computed(() => data.value)
const createdDate = computed(() => {
  return item.value && new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.value.createdDate))
})

const shareUrl = ref('')

onMounted(() => {
  shareUrl.value = window.location.href
})
</script>