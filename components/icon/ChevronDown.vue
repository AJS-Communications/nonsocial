<template>
  <div class="my-auto">
    <svg v-if="active" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" :class="size">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" :class="size">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  active: { type: Boolean },
  size: { type: String, default: 'md' }
})

const size = computed(() => {
  return props.size === 'md' ? 'w-6 h-6' : 'w-4 h-4'
})
</script>