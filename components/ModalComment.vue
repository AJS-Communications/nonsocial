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
            <div class="relative flex flex-col-reverse gap-4 mx-auto max-w-screen-sm p-4 rounded-xl bg-white dark:bg-black shadow-md shadow-neutral-500 dark:shadow-neutral-900">
              <div
                class="bg-neutral-200 dark:bg-neutral-800 w-1 absolute top-[7.75rem] left-[2.35rem] bottom-24"
              />
              <CommentEditor
                v-model="text"
                :item="item"
                @submit="update"
              />
              <div>
                <button
                  class="hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full p-2"
                  @click="open = false"
                >
                  <IconClose />
                  <span class="sr-only">Close modal</span>
                </button>
                <div class="flex items-center space-x-4 pt-4">
                  <img
                    :src="item.author.photoUrl"
                    :alt="item.author.username"
                    class="mb-auto flex-none w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-4 ring-white dark:ring-black bg-white dark:bg-black"
                    loading="lazy"
                    decoding="async"
                  >
                  <div class="flex-auto">
                    <div class="text-base font-semibold flex gap-2">
                      <NuxtLink
                        :to="`/${item.author.username}`"
                        class="my-auto hover:underline z-10"
                      >
                        <span>{{ item.author.username }}</span>
                      </NuxtLink>
                      <div class="mt-0.5 text-sm text-neutral-500 whitespace-nowrap space-x-2">
                        <span>&middot;</span>
                        <span>{{ createdDate(item.createdDate) }}</span>
                      </div>
                    </div>
                    <blockquote class="mt-0.5 max-w-prose">
                      <div class="font-sans whitespace-pre-line">{{ item.text }}</div>
                    </blockquote>
                  </div>
                </div>
                <p class="ml-16 pt-4 mt-4 text-neutral-500 font-medium">
                  Replying to
                  <NuxtLink :to="`/${item.author.username}`" class="text-sky-600 dark:text-sky-400 group">
                    @<span class="group-hover:underline">{{ item.author.username }}</span>
                  </NuxtLink>
                </p>
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

const { createdDate } = await usePost()

defineProps({
  item: { type: Object, required: true }
})

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