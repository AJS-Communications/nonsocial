<template>
  <div>
    <PageHeader />
    <div class="p-4">
      <div class="grid gap-4 pb-8 mb-8 border-b dark:border-neutral-900">
        <h2 class="text-lg font-semibold">Logout of your account?</h2>
        <button
          class="border rounded px-4 py-2 w-full justify-center flex items-center gap-4 bg-neutral-100 hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800"
          @click="logout()"
        >
          <span>Logout</span>
        </button>
      </div>
      <form
        class="grid gap-4"
        @submit.prevent="handleUpdate"
      >
        <h2 class="text-lg font-semibold">Update your profile</h2>
        <div class="grid gap-2">
          <label for="username" class="font-semibold">
            Username
            <span
              class="text-red-600 dark:text-red-400 text-xs align-super"
            >* required</span>
          </label>
          <input
            v-model="username"
            id="username"
            name="username"
            type="text"
            autocomplete="off"
            required
            class="rounded dark:border-neutral-800 dark:bg-black"
          >
        </div>
        <div class="grid gap-2">
          <label for="email" class="font-semibold">
            Email
            <span
              class="text-red-600 dark:text-red-400 text-xs align-super"
            >* required</span>
          </label>
          <input
            v-model="email"
            id="email"
            name="email"
            type="email"
            autocomplete="off"
            required
            class="rounded dark:border-neutral-800 dark:bg-black"
          >
        </div>
        <div class="grid gap-2">
          <label for="name" class="font-semibold">Name</label>
          <input
            v-model="name"
            id="name"
            name="name"
            type="text"
            autocomplete="off"
            class="rounded dark:border-neutral-800 dark:bg-black"
          >
        </div>
        <div class="grid gap-2">
          <label for="photoUrl" class="font-semibold">Photo Url</label>
          <input
            v-model="photoUrl"
            id="photoUrl"
            name="photoUrl"
            type="text"
            autocomplete="off"
            class="rounded dark:border-neutral-800 dark:bg-black"
          >
        </div>
        <div class="grid gap-2">
          <label for="bio" class="font-semibold">About me</label>
          <textarea
            v-model="bio"
            id="bio"
            name="bio"
            class="rounded dark:border-neutral-800 dark:bg-black"
          />
        </div>
        <div class="pt-4">
          <button
            type="submit"
            class="border rounded px-4 py-2 w-full justify-center flex items-center gap-4 bg-neutral-100 hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800"
          >Save changes</button>
        </div>
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