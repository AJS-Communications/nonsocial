<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const user = useUser()
user.value = await $fetch<User>('/api/users/1')
</script>