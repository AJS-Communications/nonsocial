<template>
  <div class="grid gap-4 p-4">
    <p>Select a user:</p>
    <button class="border px-4 py-2" @click="login('jason')">Login as Jason</button>
    <button class="border px-4 py-2" @click="login('george')">Login as George</button>
    <button class="border px-4 py-2" @click="login('will')">Login as William</button>
  </div>
</template>

<script setup lang="ts">
const { user } = useUser()

const login = async (value: string) => {
  if (value === 'jason') {
    user.value = await $fetch<User>('/api/users/1')
  } else if (value === 'george') {
    user.value = await $fetch<User>('/api/users/2')
  } else if (value === 'will') {
    user.value = await $fetch<User>('/api/users/3')
  }
  await navigateTo('/')
}
</script>