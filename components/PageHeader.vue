<template>
  <div
    class="border-b border-neutral-100 dark:border-neutral-900 bg-white/80 dark:bg-black/80 backdrop-blur sticky top-0 z-20 cursor-pointer"
    @click="goToTop"
  >
    <div
      v-if="showBackButton"
      class="p-2.5 flex gap-2"
    >
      <button
        type="button"
        class="my-auto p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"
        @click="$router.go(-1)"
      >
        <IconLeftArrow />
      </button>
      <h1 class="text-xl font-bold my-auto">{{ title }}</h1>
    </div>
    <h1
      v-else
      class="p-4 text-xl font-bold my-auto"
    >{{ title }}</h1>
  </div>
</template>

<script lang="ts" setup>
const title = useTitle()

defineProps({
  showBackButton: { type: Boolean, default: false }
})
</script>