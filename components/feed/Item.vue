<template>
  <article class="relative flex flex-col-reverse p-4">
    <div class="flex items-center space-x-4">
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
            :to="`/${item.author.username}`"
            class="my-auto hover:underline z-10"
            tabindex="0"
          >
            <span>{{ item.author.name }}</span>
          </NuxtLink>
          <div class="mt-0.5 text-sm text-neutral-500 whitespace-nowrap space-x-2">
            <span>&middot;</span>
            <span>{{ createdDate }}</span>
          </div>
        </div>
        <blockquote class="mt-0.5 max-w-prose">
          <div class="font-sans whitespace-pre-line">{{ item.text }}</div>
        </blockquote>
        <div class="grid grid-cols-4 gap-2 my-2">
          <div>
            <NuxtLink
              :to="`/posts/${item.id}`"
              class="w-min flex gap-1 z-10 px-2 transition-colors duration-200 group hover:text-blue-600 dark:hover:text-blue-400 saturate-200"
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
              class="flex gap-1 z-10 px-2 transition-colors duration-200 group hover:text-rose-600 dark:hover:text-rose-400 saturate-200"
              :class="{ 'text-rose-600 dark:text-rose-400': isFavorite }"
              @click="favorite"
            >
              <IconHeart
                :active="isFavorite"
                size="sm"
                class="rounded-full p-2 group-hover:bg-rose-100/40 dark:group-hover:bg-rose-100/10"
              />
              <span class="sr-only">Love</span>
              <span v-if="counts && counts?.favoriteCount > 0" class="my-auto text-sm">{{ counts?.favoriteCount }}</span>
            </button>
          </div>
          <div>
            <button
              class="flex gap-1 z-10 px-2 transition-colors duration-200 group hover:text-emerald-600 dark:hover:text-emerald-400 saturate-200"
              :class="{ 'text-emerald-600 dark:text-emerald-400': isBookmark }"
              @click="bookmark"
            >
              <IconBookmark
                :active="isBookmark"
                size="sm"
                class="rounded-full p-2 group-hover:bg-emerald-100/40 dark:group-hover:bg-emerald-100/10"
              />
              <span class="sr-only">Bookmark</span>
              <span v-if="counts && counts?.bookmarkCount > 0" class="my-auto text-sm">{{ counts?.bookmarkCount }}</span>
            </button>
          </div>
          <div>
            <button
              class="flex w-min z-10 p-2 rounded-full hover:bg-indigo-100/40 dark:hover:bg-indigo-100/10 hover:text-indigo-800 dark:hover:text-indigo-400 saturate-200 transition-colors duration-200"
              @click="share"
            >
              <IconShare size="sm" class="mr-1" />
              <span class="sr-only">Share</span>
          </button>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const user = useUser()

const props = defineProps({
  item: { type: Object, required: true }
})

const { data: counts, refresh } = await useFetch(`/api/posts/${props.item.author.id}/${props.item.id}/counts`)

const emit = defineEmits(['update'])

const createdDate = computed(() => {
  const date = new Date(props.item.createdDate)
  const seconds = Math.floor((new Date().valueOf() - date.valueOf()) / 1000)
  if(Math.round(seconds/(60*60*24*365.25)) >= 2) return new Intl.DateTimeFormat('en-US').format(date)
  else if(Math.round(seconds/(60*60*24*30.4)) >= 2) return new Intl.DateTimeFormat('en-US').format(date)
  else if(Math.round(seconds/(60*60*24*7)) >= 2) return new Intl.DateTimeFormat('en-US').format(date)
  else if(Math.round(seconds/(60*60*24)) >= 2) return Math.round(seconds/(60*60*24)) + "d"
  else if(Math.round(seconds/(60*60)) >= 2) return Math.round(seconds/(60*60)) + "h"
  else if(Math.round(seconds/60) >= 2) return Math.round(seconds/60) + "m"
  else return 'Just now'
})

const share = async () => {
  const url = `${window.location.protocol}//${window.location.host}/posts/${props.item.id}`
  if (!navigator.canShare()) {
    try {
      await navigator.share({
        title: 'Check this out!',
        text: 'Take a look at this post that I found.',
        url
      })
    } catch (e) {
      window.location.href = `mailto:?subject=Check this out!&body=Take a look at this post that I found: ${url}`
    }
  } else {
    window.location.href = `mailto:?subject=Check this out!&body=Take a look at this post that I found: ${url}`
  }
}

const isBookmark = computed(() => {
  if (!user.value) return false
  return user.value.Bookmark.filter(i => i.postId === props.item.id).length > 0
})

const isFavorite = computed(() => {
  if (!user.value) return false
  return user.value.Favorite.filter(i => i.postId === props.item.id).length > 0
})

const update = () => {
  refresh()
  emit('update')
}

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
  update()
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
  update()
}
</script>