<template>
  <div>
    <slot :toggle="() => open = !open" />
    <Teleport to="body">
      <UseFocusTrap v-if="open" :options="{ immediate: true }">
        <div
          class="bg-neutral-900/40 dark:bg-sky-100/10 fixed inset-0 z-50 overflow-auto"
          ref="modal"
          @click.self="open = false"
        >
          <div class="m-4 my-12">
            <div class="flex flex-col-reverse mx-auto max-w-screen-sm p-4 rounded-xl bg-white dark:bg-black shadow-md shadow-neutral-500 dark:shadow-neutral-900">
              <PostEditor v-model="text" @submit="update" />
              <div>
                <button
                  class="hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full p-2"
                  @click="open = false"
                >
                  <IconClose />
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </UseFocusTrap>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { UseFocusTrap } from '@vueuse/integrations/useFocusTrap/component'

const modal = ref()
const open = ref(false)
const text = ref('')

watch(open, (value) => {
  if (!value) text.value = ''
})

onKeyStroke('Escape', (e) => {
  if (!open.value) return
  e.preventDefault()
  open.value = false
})

const update = async () => {
  useNuxtApp().callHook('compose')
  open.value = false
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>