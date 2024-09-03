<template>
  <div class="grid gap-4 p-4">
    <form
      class="grid gap-4 p-4"
      @submit.prevent="handleRegister"
    >
      <input v-model="username" type="text" placeholder="username" required>
      <input v-model="email" type="email" placeholder="email" required>
      <button type="submit" class="border p-2">Register</button>
      <p class="text-center">or</p>
      <button type="button" class="border p-2" @click="handleLogin">Login</button>
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