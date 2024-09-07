<template>
  <div class="flex flex-col h-screen">
    <div class="container mx-auto h-full">
      <div class="flex flex-row grow">
        <header class="xl:w-64 shrink-0 z-10 min-h-screen border-r border-neutral-100 dark:border-neutral-900">
          <div class="sticky top-0 p-4">
            <NavMenu />
          </div>
        </header>
        <main class="grow">
          <slot />
        </main>
        <footer class="hidden lg:block w-80 shrink-0 min-h-screen border-l border-neutral-100 dark:border-neutral-900">
          <div class="sticky top-0 p-4">
            <div
              v-if="isAuthenticated"
              class="mb-4"
            >
              <button
                @click="logout"
              >Logout</button>
            </div>
            <small class="text-neutral-600 dark:text-neutral-400">
              Available under MIT License<br/>
              Copyright &copy; 2022-present,<br />AJS Communications
            </small>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const { $auth: { isAuthenticated, logout } } = useNuxtApp()

useHead({
  bodyAttrs: {
    class: 'bg-white text-neutral-900 dark:bg-black dark:text-white antialiased h-screen'
  },
  htmlAttrs: {
    class: 'h-screen',
    lang: 'en'
  },
  meta: [
    {
      name: 'description',
      content: runtimeConfig.public.APP_META_DESCRIPTION
    }
  ],
  titleTemplate: (title) => title ?
    `${title} | ${runtimeConfig.public.APP_TITLE}` :
    runtimeConfig.public.APP_TITLE
})
</script>