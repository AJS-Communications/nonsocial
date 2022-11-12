<template>
  <figure v-if="item" class="relative flex flex-col-reverse p-4 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors duration-100">
    <figcaption class="flex items-center space-x-4">
      <img
        :src="item.user.photoUrl"
        :alt="item.user.fullName"
        class="mb-auto flex-none w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
        loading="lazy"
        decoding="async"
      >
      <div class="flex-auto">
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
            :to="`${item.type.route}/${item.id}`"
            class="text-sky-600 dark:text-sky-300 my-auto"
            tabindex="0"
          >
            <span class="absolute inset-0" />
            {{ item.title || item.user.fullName }}
          </NuxtLink>
          <div class="mt-0.5 text-sm text-neutral-500 whitespace-nowrap">
            {{ createdDate }}
          </div>
        </div>
        <div v-if="item.title" class="text-neutral-500 dark:text-neutral-400 text-sm font-bold">
          By {{ item.user.fullName }}
        </div>
        <blockquote class="mt-0.5 max-w-prose">
          <p>{{ item.description }}</p>
        </blockquote>
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
</script>