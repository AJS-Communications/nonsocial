<template>
  <div class="my-auto">
    <svg v-if="active" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="size">
      <path fill-rule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clip-rule="evenodd" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" :class="size">
      <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
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