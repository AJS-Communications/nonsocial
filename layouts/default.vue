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
            <small class="text-neutral-500">
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
const title = useTitle()
useHead({
  bodyAttrs: {
    class: 'bg-white text-neutral-900 dark:bg-black dark:text-white antialiased h-screen'
  },
  htmlAttrs: {
    class: 'h-screen'
  },
  titleTemplate: (title) => title ? `${title} | Nonsocial` : 'Nonsocial'
})
</script>