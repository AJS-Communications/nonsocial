<template>
  <figure class="relative flex flex-col-reverse p-4">
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
          :to="`/posts/${item.id}`"
          class="my-auto group"
          tabindex="0"
        >
          <span class="absolute inset-0 group-focus-visible:border border-black dark:border-white" />
          <span class="sr-only">Go to post</span>
        </NuxtLink>
        <div class="text-base font-semibold flex gap-2">
          <NuxtLink
            :to="`profile`"
            class="my-auto hover:underline z-10"
            tabindex="0"
          >
            <span>{{ item.author.name }}</span>
          </NuxtLink>
          <div class="mt-0.5 text-sm text-neutral-500 whitespace-nowrap">
            {{ createdDate }}
          </div>
        </div>
        <blockquote class="mt-0.5 max-w-prose">
          <pre class="font-sans whitespace-pre">{{ item.text }}</pre>
        </blockquote>
        <div class="grid grid-cols-3 gap-2 my-2">
          <div>
            <button
              class="flex z-10 p-2 rounded-full hover:bg-red-100/40 dark:hover:bg-red-100/10 hover:text-red-600 dark:hover:text-red-400 saturate-200 transition-colors duration-200"
              :class="{ 'text-red-600 dark:text-red-400': isFavorite }"
              @click="favorite"
            >
              <IconHeart :active="isFavorite" size="sm" />
              <span class="sr-only">Love</span>
            </button>
          </div>
          <div>
            <button
              class="flex z-10 p-2 rounded-full hover:bg-green-100/40 dark:hover:bg-green-100/10 hover:text-green-600 dark:hover:text-green-400 saturate-200 transition-colors duration-200"
              :class="{ 'text-green-600 dark:text-green-400': isBookmark }"
              @click="bookmark"
            >
              <IconBookmark :active="isBookmark" size="sm" />
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
const user = useUser()

const props = defineProps({
  item: { type: Object, required: true }
})

const emit = defineEmits(['update'])

const createdDate = computed(() => {
  return new Intl.DateTimeFormat('en-US').format(new Date(props.item.createdDate))
})

const shareUrl = ref('')

onMounted(() => {
  shareUrl.value = window.location.href
})

const isBookmark = computed(() => {
  if (!user.value) return false
  return user.value.Bookmark.filter(i => i.postId === props.item.id).length > 0
})

const isFavorite = computed(() => {
  if (!user.value) return false
  return user.value.Favorite.filter(i => i.postId === props.item.id).length > 0
})

const bookmark = async () => {
  if (!user.value) return

  if (isBookmark.value) {
    const bookmark = user.value.Bookmark.find(i => i.postId === props.item.id)
    await useFetch(`/api/bookmarks/${user.value.id}`, {
      method: 'delete',
      body: {
        id: bookmark && bookmark.id
      }
    })
  } else {
    await useFetch(`/api/bookmarks/${user.value.id}`, {
      method: 'post',
      body: {
        postId: props.item.id
      }
    })
  }
  emit('update')
}

const favorite = async () => {
  if (!user.value) return

  if (isFavorite.value) {
    const favorite = user.value.Favorite.find(i => i.postId === props.item.id)
    await useFetch(`/api/favorites/${user.value.id}`, {
      method: 'delete',
      body: {
        id: favorite && favorite.id
      }
    })
  } else {
    await useFetch(`/api/favorites/${user.value.id}`, {
      method: 'post',
      body: {
        postId: props.item.id
      }
    })
  }
  emit('update')
}
</script>