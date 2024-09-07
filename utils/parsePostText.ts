export const parsePostText = (text?: string) => {
  if (!text) return ''
  return text
    .replaceAll(
      /((https:\/\/)(?!https:\/\/)\S+)/gm,
      `<a
        data-link="true"
        href="$1"
        target="_blank"
        rel="noopener noreferrer"
        class="text-sky-700 font-medium hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300"
      >$1</a>`
    )
    .replaceAll(
      /((#|@)(?!#|@)\w+)/gm,
      `<a
        href="$1"
        target="_blank"
        rel="noopener noreferrer"
        class="text-sky-700 font-medium hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300"
      >$1</a>`
    )
}