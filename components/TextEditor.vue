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
      <div class="mt-2 grow">
        <div class="relative">
          <textarea
            v-model="text"
            ref="textarea"
            class="w-full bg-transparent focus:outline-none text-xl resize-none placeholder:text-neutral-500"
            placeholder="What's happening?"
            rows="1"
            @select="onCompose"
            @copy="onCompose"
            @paste="onCompose"
            @cut="onCompose"
            @mouseup="onCompose"
            @input="onCompose"
          />
          <div
            class="text-xl inset-0 absolute break-words whitespace-pre-wrap font-base pointer-events-none [&_[data-error]]:bg-red-500/30 dark:[&_[data-error]]:bg-red-400/30 [&_[data-link]]:text-sky-600 dark:[&_[data-link]]:text-sky-400"
            aria-hidden="true"
            v-html="placeholder"
          />
        </div>
      </div>
    </figcaption>
    <div class="ml-auto flex gap-2">
      <div class="my-auto flex gap-1 text-xs font-bold text-gray-500 dark:text-gray-400">
        <span :class="{ 'text-red-500 dark:text-red-400': remainingLength < 0 }">{{ remainingLength }}</span>
        <span>/</span>
        <span>{{ maxLength }}</span>
      </div>
      <button
        :disabled="text.trim().length < 1 || remainingLength < 0"
        class="text-white bg-sky-500 rounded-full px-4 py-1 font-bold hover:bg-sky-600 disabled:opacity-50 disabled:pointer-events-none"
      >Post</button>
    </div>
  </figure>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:model-value'])

const text = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:model-value', value)
  }
})

const textarea = ref()
const placeholder = ref('')
const maxLength = ref(280)

const setEditorHeight = () => {
  textarea.value.style.height = 0
  textarea.value.style.height = textarea.value.scrollHeight + 'px'
}

const remainingLength = computed(() => maxLength.value - text.value.length)

const onCompose = () => {
  setEditorHeight()

  if (0 > remainingLength.value) {
    const allowedValuePart = text.value.slice(0, maxLength.value)
    const refusedValuePart = text.value.slice(maxLength.value)
    placeholder.value = 
      encodeHTMLEntities(allowedValuePart).replaceAll(/(((https:\/\/|#|@)(?!https:\/\/|#|@)\S+(?=\.(\s|$)))|(https:\/\/|#|@)(?!https:\/\/|#|@)\S+)/g, '<span data-link="true">$1</span>') +
      '<span data-error="true">' +
      encodeHTMLEntities(refusedValuePart).replaceAll(/(((https:\/\/|#|@)(?!https:\/\/|#|@)\S+(?=\.(\s|$)))|(https:\/\/|#|@)(?!https:\/\/|#|@)\S+)/g, '<span data-link="true">$1</span>') +
      '</span>'
  } else {
    placeholder.value = encodeHTMLEntities(text.value).replaceAll(/(((https:\/\/|#|@)(?!https:\/\/|#|@)\S+(?=\.(\s|$)))|(https:\/\/|#|@)(?!https:\/\/|#|@)\S+)/g, '<span data-link="true">$1</span>')
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
</script>
