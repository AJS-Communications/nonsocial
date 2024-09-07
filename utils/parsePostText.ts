export const parsePostText = (text?: string, readonly = false) => {
  if (!text) return ''
  return text
    .replaceAll(
      /((https:\/\/)(?!https:\/\/)\S+)/gm,
      readonly ?
        `<span
          data-link="true"
          class="text-sky-700 font-medium dark:text-sky-400"
        >$1</span>` :
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
      readonly ?
        `<span
          data-link="true"
          class="text-sky-700 font-medium dark:text-sky-400"
        >$1</span>` :
        `<a
          href="$1"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sky-700 font-medium hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300"
        >$1</a>`
    )
}