<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
onMounted(() => {
  useEventListener(document, 'click', async (event) => {
    if (!event.target) return
    const target = (event.target as HTMLAnchorElement).closest('[data-link]')
    if (target) {
      const type = target.getAttribute('data-link') as 'external' | 'hashtag' | 'mention'
      const href = target.getAttribute('href')
      if (href && type !== 'external') {
        event.preventDefault()
        await navigateTo(href)
      }
    }
  })
})
</script>