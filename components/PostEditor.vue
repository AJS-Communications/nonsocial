<template>
  <figure
    class="relative flex flex-col gap-2 p-4"
    @click="textarea.focus()"
  >
    <figcaption class="flex space-x-4 w-full">
      <img
        src="https://pbs.twimg.com/profile_images/1333160856188833792/tMNnHY9F_x96.jpg"
        alt="Jason Shimkoski"
        class="mb-auto flex-none w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
        loading="lazy"
        decoding="async"
      >
      <div class="grow space-y-4" :class="{ 'mt-2': !activated }">
        <label v-if="activated" @click.stop>
          <span class="sr-only">Who can see this?</span>
          <select v-model="visibility" class="cursor-pointer text-sm focus:ring-sky-500 focus:border-sky-500 w-28 rounded-full px-3 py-0.5 border border-neutral-300 dark:border-neutral-700 font-bold text-sky-600 dark:bg-black dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/40">
            <option v-for="option in visibilityOptions" :value="option.value">{{ option.text }}</option>
          </select>
        </label>
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
    </figcaption>
    <div class="ml-auto flex gap-2">
      <div v-if="text.length > 0" class="my-auto flex gap-1 text-xs font-bold text-gray-500 dark:text-gray-400">
        <span :class="{ 'text-rose-500 dark:text-rose-400': remainingLength < 0 }">{{ remainingLength }}</span>
        <span>/</span>
        <span>{{ maxLength }}</span>
      </div>
      <button
        :disabled="text.trim().length < 1 || remainingLength < 0"
        class="text-white bg-sky-500 rounded-full px-4 py-1 font-bold hover:bg-sky-600 disabled:opacity-50 disabled:pointer-events-none"
        @click="submit"
      >Post</button>
    </div>
  </figure>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: `What's happening?` },
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
const maxLength = ref(280)

const visibility = ref('PUBLIC')
const visibilityOptions = computed(() => [
  { value: 'PUBLIC', text: 'Everyone' },
  { value: 'PRIVATE', text: 'Only me' }
])

const setEditorHeight = () => {
  nextTick(() => {
    textarea.value.style.height = 0
    textarea.value.style.height = textarea.value.scrollHeight + 'px'
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
  await useFetch('/api/posts/1', {
    method: 'post',
    body: {
      text: text.value,
      visibility: visibility.value
    }
  })
  resetEditor()
  emit('submit')
}
</script>
