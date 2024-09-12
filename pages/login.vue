<template>
  <div class="grid gap-4 p-4">
    <form
      class="grid gap-4 p-4"
      @submit.prevent="handleRegister"
    >
      <input
        v-model="username"
        type="text"
        placeholder="username"
        required
        class="rounded dark:border-neutral-800 dark:bg-black"
      >
      <input
        v-model="email"
        type="email"
        placeholder="email"
        required
        class="rounded dark:border-neutral-800 dark:bg-black"
      >
      <button
        type="submit"
        class="border rounded px-4 py-2 w-full justify-center flex items-center gap-4 bg-neutral-100 hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800"
      >Register</button>
      <p class="text-center">or</p>
      <button
        type="button"
        class="border rounded px-4 py-2 w-full justify-center flex items-center gap-4 bg-neutral-100 hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800"
        @click="handleLogin"
      >Login</button>
    </form>
  </div>
</template>

<script setup lang="ts">
const { $auth: { login, register } } = useNuxtApp()

const username = ref('')
const email = ref('')

const handleLogin = async () => {
  try {
    await login()
    await navigateTo('/', { external: true })
  } catch (e) {
    console.error(e)
  }
}

const handleRegister = async () => {
  try {
    await register(username.value, email.value)
    await handleLogin()
  } catch (e) {
    console.error(e)
  }
}
</script>