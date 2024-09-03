<template>
  <div
    class="relative flex gap-2"
    :class="{ 'flex-col': activated }"
    @click="textarea.focus()"
  >
    <div class="flex space-x-4 w-full">
      <img
        :src="user?.photoUrl"
        :alt="user?.username"
        class="mb-auto flex-none w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-4 ring-white dark:ring-black bg-white dark:bg-black"
        loading="lazy"
        decoding="async"
      >
      <div class="grow space-y-4 mt-2">
        <div class="relative">
          <textarea
            v-model="text"
            ref="textarea"
            class="w-full border-0 p-0 m-0 focus:ring-0 bg-transparent focus:outline-none text-xl resize-none placeholder:text-neutral-500 placeholder:font-medium"
            :placeholder="placeholder"
            rows="1"
            @focus="activated = true"
            @select="onCompose"
            @copy="onCompose"
            @paste="onCompose"
            @cut="onCompose"
            @mouseup="onCompose"
            @input="onCompose"
          />
          <div
            class="text-xl inset-0 absolute break-words whitespace-pre-wrap font-base pointer-events-none [&_[data-error]]:bg-rose-500/30 dark:[&_[data-error]]:bg-rose-400/30 [&_[data-link]]:text-sky-600 dark:[&_[data-link]]:text-sky-400"
            aria-hidden="true"
            v-html="fauxTextareaContent"
          />
        </div>
      </div>
    </div>
    <div class="ml-auto my-auto flex gap-2">
      <div v-if="text.length > 0" class="my-auto flex gap-1 text-xs font-bold text-gray-500 dark:text-gray-400">
        <span :class="{ 'text-rose-500 dark:text-rose-400': remainingLength < 0 }">{{ remainingLength }}</span>
        <span>/</span>
        <span>{{ maxLength }}</span>
      </div>
      <button
        :disabled="text.trim().length < 1 || remainingLength < 0"
        class="text-white bg-sky-700 rounded-full px-4 py-1 font-bold hover:bg-sky-700/90 disabled:opacity-50 disabled:pointer-events-none"
        @click="submit"
      >Post</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $api, $auth: { user } } = useNuxtApp()

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Post your reply' },
  item: { type: Object, required: true }
})

const emit = defineEmits(['update:model-value', 'submit'])

const text = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:model-value', value)
  }
})

const activated = ref(false)

const textarea = ref()
const fauxTextareaContent = ref('')
const maxLength = ref(1000)

const setEditorHeight = () => {
  nextTick(() => {
    if (textarea.value) {
      textarea.value.style.height = 0
      textarea.value.style.height = textarea.value.scrollHeight + 'px'
    }
  })
}

const remainingLength = computed(() => maxLength.value - text.value.length)

const onCompose = () => {
  setEditorHeight()

  if (0 > remainingLength.value) {
    const allowedValuePart = text.value.slice(0, maxLength.value)
    const refusedValuePart = text.value.slice(maxLength.value)
    fauxTextareaContent.value = 
      encodeHTMLEntities(allowedValuePart)
        .replaceAll(/<br>/g, '\n')
        .replaceAll(/((https:\/\/)(?!https:\/\/)\S+)/gm, '<span data-link="true">$1</span>')
        .replaceAll(/((#|@)(?!#|@)\w+)/gm, '<span data-link="true">$1</span>') +
        '<span data-error="true">' +
      encodeHTMLEntities(refusedValuePart)
        .replaceAll(/<br>/g, '\n')
        .replaceAll(/((https:\/\/)(?!https:\/\/)\S+)/gm, '<span data-link="true">$1</span>')
        .replaceAll(/((#|@)(?!#|@)\w+)/gm, '<span data-link="true">$1</span>') +
        '</span>'
  } else {
    fauxTextareaContent.value = encodeHTMLEntities(text.value)
      .replaceAll(/<br>/g, '\n')
      .replaceAll(/((https:\/\/)(?!https:\/\/)\S+)/gm, '<span data-link="true">$1</span>')
      .replaceAll(/((#|@)(?!#|@)\w+)/gm, '<span data-link="true">$1</span>')
  }
}

const encodeHTMLEntities = (value: string) => {
  var textArea = document.createElement('textarea')
  textArea.innerText = value
  return textArea.innerHTML
}

onMounted(() => {
  setEditorHeight()
})

const resetEditor = () => {
  text.value = ''
  fauxTextareaContent.value = ''
  activated.value = false
  setEditorHeight()
}

const submit = async () => {
  if (!user.value) return
  await $api(`/api/users/${user.value.id}/posts`, {
    method: 'post',
    body: {
      text: text.value,
      parentId: props.item.id
    }
  })
  resetEditor()
  emit('submit')
}
</script>
