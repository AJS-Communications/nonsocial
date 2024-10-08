export const parsePostText = (text?: string, readonly = false) => {
  if (!text) return ''
  return text
    .replaceAll(
      /((https:\/\/)(?!https:\/\/)\S+)/gm,
      readonly ?
        `<span
          data-link="external"
          class="text-sky-700 font-medium dark:text-sky-300"
        >$1</span>` :
        `<a
          data-link="external"
          href="$1"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sky-700 font-medium hover:underline dark:text-sky-300"
        >$1</a>`
    )
    .replaceAll(
      /(@((?!@)\w+))/gm,
      readonly ?
        `<span
          data-link="mention"
          class="text-sky-700 font-medium dark:text-sky-300"
        >$1</span>` :
        `<a
          data-link="mention"
          href="/$2"
          class="text-sky-700 font-medium hover:underline dark:text-sky-300"
        >$1</a>`
    )
    .replaceAll(
      /(#((?!#)\w+))/gm,
      readonly ?
        `<span
          data-link="hashtag"
          class="text-sky-700 font-medium dark:text-sky-300"
        >$1</span>` :
        `<a
          data-link="hashtag"
          href="/explore/$2"
          class="text-sky-700 font-medium hover:underline dark:text-sky-300"
        >$1</a>`
    )
}