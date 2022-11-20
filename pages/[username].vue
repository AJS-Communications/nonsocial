<template>
  <div>
    <div class="border-b border-neutral-100 dark:border-neutral-900 bg-white/80 dark:bg-black/80 backdrop-blur sticky top-0 z-20">
      <h1 class="p-4 text-xl font-bold">{{ title }}</h1>
    </div>
    <div class="p-4">
      <p>Hello, there</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const title = useTitle()
title.value = 'Profile'
</script>