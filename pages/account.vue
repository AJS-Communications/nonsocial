<template>
  <div>
    <PageHeader />
    <div class="p-4">
      <div class="pb-8 mb-8 border-b dark:border-neutral-900">
        <button
          class="border rounded px-4 py-2 w-full justify-center flex items-center gap-4 bg-neutral-100 hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800"
          @click="logout()"
        >
          <span>Logout</span>
        </button>
      </div>
      <form
        class="grid gap-8"
        @submit.prevent="handleUpdate"
      >
        <h2 class="text-xl font-semibold">Update your profile</h2>
        <div class="grid gap-2">
          <label for="username" class="font-semibold">Username</label>
          <input
            v-model="username"
            name="username"
            type="text"
            placeholder="username"
            required
            class="rounded dark:border-neutral-800 dark:bg-black"
          >
        </div>
        <div class="grid gap-2">
          <label for="email" class="font-semibold">Email</label>
          <input
            v-model="email"
            name="email"
            type="email"
            placeholder="email"
            required
            class="rounded dark:border-neutral-800 dark:bg-black"
          >
        </div>
        <div class="grid gap-2">
          <label for="name" class="font-semibold">Name</label>
          <input
            v-model="name"
            name="name"
            type="text"
            placeholder="name"
            class="rounded dark:border-neutral-800 dark:bg-black"
          >
        </div>
        <div class="grid gap-2">
          <label for="photoUrl" class="font-semibold">Photo Url</label>
          <input
            v-model="photoUrl"
            name="photoUrl"
            type="text"
            placeholder="photo url"
            class="rounded dark:border-neutral-800 dark:bg-black"
          >
        </div>
        <div class="grid gap-2">
          <label for="bio" class="font-semibold">About me</label>
          <textarea
            v-model="bio"
            name="bio"
            class="rounded dark:border-neutral-800 dark:bg-black"
          />
        </div>
        <button
          type="submit"
          class="border rounded px-4 py-2 w-full justify-center flex items-center gap-4 bg-neutral-100 hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800"
        >Save changes</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $api, $auth: { user, logout } } = useNuxtApp()

if (!user.value) {
  throw createError({ statusCode: 501, message: 'Access Denied', fatal: true })
}

const title = useTitle()
title.value = 'Account'

const username = ref(user.value.username)
const name = ref(user.value.name)
const email = ref(user.value.email)
const bio = ref(user.value.bio)
const photoUrl = ref(user.value.photoUrl)

const handleUpdate = async (event: Event) => {
  event.preventDefault()
  await $api('/api/auth/user', {
    method: 'post',
    body: {
      id: user.value?.id,
      username: username.value,
      name: name.value,
      email: email.value,
      bio: bio.value,
      photoUrl: photoUrl.value,
    }
  })
  reloadNuxtApp({
    force: true,
    path: window.location.pathname
  })
}
</script>