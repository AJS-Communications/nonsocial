<template>
  <div class="grid gap-4 p-4">
    <form
      class="grid gap-4 p-4"
      @submit.prevent="handleLogin"
    >
      <input v-model="username" type="text" placeholder="username" required>
      <input v-model="email" type="email" placeholder="email (register only)" required>
      <input v-model="password" type="password" placeholder="password" required>
      <button type="submit">Login</button>
      <button type="button" @click="handleRegister">Register</button>
    </form>
  </div>
</template>

<script setup lang="ts">
const { $auth: { login, register } } = useNuxtApp()

const username = ref('')
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  await login(username.value, password.value)
  await navigateTo('/')
}

const handleRegister = async () => {
  await register(username.value, email.value, password.value)
  alert('registered!')
}
</script>