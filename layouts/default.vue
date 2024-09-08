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
          <div class="sticky top-0 p-4 pr-8">
            <div
              v-if="isAuthenticated"
              class="mb-4 space-y-4"
            >
              <div v-if="user">
                <NuxtLink
                  class="border rounded px-4 py-2 w-full flex items-center gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 dark:border-neutral-800"
                  to="/account"
                >
                  <img
                    :src="user?.photoUrl"
                    :alt="user?.username"
                    class="mb-auto flex-none w-8 h-8 rounded-full object-cover ring-4 ring-white dark:ring-black bg-white dark:bg-black"
                    loading="lazy"
                    decoding="async"
                  >
                  <span>{{ user.username }}</span>
                </NuxtLink>
              </div>
              <small class="block text-neutral-600 dark:text-neutral-400">
                Available under MIT License<br/>
                Copyright &copy; 2022-present,<br />AJS Communications
              </small>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const { $auth: { isAuthenticated, user } } = useNuxtApp()

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