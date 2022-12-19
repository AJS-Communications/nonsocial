<template>
  <NuxtLink
    :to="to"
    class="cursor-pointer text-xl select-none rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 p-3 flex gap-3 transition-colors duration-100"
    :class="{ 'font-bold': isHome }"
    :active-class="!exact ? 'font-bold' : undefined"
    :exact-active-class="exact ? 'font-bold' : undefined"
    v-slot="{ route, isActive }"
  >
    <slot name="icon" :isActive="isHome || isActive" />
    <span class="my-auto sr-only xl:not-sr-only">{{ text }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps({
  to: { type: String },
  text: { type: String },
  exact: { type: Boolean }
})

const isHome = computed(() => {
  return useRoute().path.startsWith(props.to as string) && props.to !== '/'
})
</script>