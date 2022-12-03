<template>
  <div>
    <slot :toggle="() => open = !open" />
    <Teleport to="body">
      <UseFocusTrap v-if="open" :options="{ immediate: true }">
        <div
          class="bg-sky-100/10 fixed inset-0 z-50"
          ref="modal"
          @click.self="open = false"
        >
          <div class="flex flex-col-reverse mx-auto max-w-screen-sm mt-12 p-4 rounded-xl bg-white dark:bg-black shadow-md shadow-neutral-100 dark:shadow-neutral-900">
            <PostEditor v-model="text" @submit="update" />
            <div>
              <button
                class="hover:bg-neutral-900 rounded-full p-2"
                @click="open = false"
              >
                <IconClose />
                <span class="sr-only">Close modal</span>
              </button>
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
  useNuxtApp().callHook('compose' as any)
  open.value = false
}
</script>