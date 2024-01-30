<template>
  <div
    v-html="md"
    class="prose-pre:p-0 prose-pre:rounded-xl prose-code:text-sm prose prose-neutral prose-sm whitespace-normal prose-pre:bg-[#0d1117]"
    :class="inverted ? 'prose-invert' : ''"
  ></div>
</template>

<script lang="ts" setup>
// @ts-ignore
import MarkdownIt from "markdown-it"
// @ts-ignore
import MarkDownItHighlightjs from "markdown-it-highlightjs"
import { onMounted, onUpdated, ref, nextTick } from "vue"
// @ts-ignore
import DOMPurify from "dompurify"
// @ts-ignore
import hljs from "highlight.js/lib/common"
import "highlight.js/styles/github-dark.css" // Import the desired highlight.js theme

interface Props {
  source: string
  inverted?: boolean
}

const props = defineProps<Props>()

const md = ref()

const renderMarkdown = () => {
  const markdown = new MarkdownIt().use(MarkDownItHighlightjs, { hljs })
  const dirtyHtml = markdown.render(props.source)

  const safeHtml = DOMPurify.sanitize(dirtyHtml)

  // Create a temporary DOM element to manipulate the HTML
  const tempElement = document.createElement("div")
  tempElement.innerHTML = safeHtml

  // Add the header and copy button before each code block
  const codeBlocks = tempElement.querySelectorAll("code")
  codeBlocks.forEach((codeBlock) => {
    let language = codeBlock.classList.contains("hljs") ? codeBlock.className.split(" ").pop()?.split("-").pop() : null
    if (!language) return
    if (language == "hljs") language = "code"
    language = language[0].toUpperCase() + language.slice(1)

    const headerElement = document.createElement("div")
    headerElement.className = "px-4 py-2 flex mt-1 justify-between items-center bg-black/10 text-xs"
    headerElement.innerHTML = `<span class="uppercase"></span><button class="copy-button rounded px-2 py-0.5 bg-black/10">Copy</button>`
    headerElement.children[0].textContent = language

    codeBlock.insertAdjacentElement("beforebegin", headerElement)

    // add margin class to the codeblock y-2
    codeBlock.classList.add("mb-2")
  })

  md.value = tempElement.innerHTML
}

const copyCode = (code: string) => {
  const textArea = document.createElement("textarea")
  textArea.value = code
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand("copy")
  document.body.removeChild(textArea)
}

onMounted(async () => {
  renderMarkdown()

  await nextTick()
  // Get all the code buttons and add a click event listener
  const copyButtons: NodeListOf<HTMLElement> = document.querySelectorAll(".copy-button")
  copyButtons.forEach((copyButton) => {
    copyButton.addEventListener("click", () => {
      if (!copyButton.parentElement || !copyButton.parentElement.nextElementSibling) return
      const code = (copyButton.parentElement.nextElementSibling as HTMLElement).innerText
      copyCode(code)
      copyButton.innerText = "Copied!"
      setTimeout(() => {
        copyButton.innerText = "Copy"
      }, 2000)
    })
  })
})

onUpdated(async () => {
  renderMarkdown()

  await nextTick()
  // Get all the code buttons and add a click event listener
  const copyButtons: NodeListOf<HTMLElement> = document.querySelectorAll(".copy-button")
  copyButtons.forEach((copyButton) => {
    copyButton.addEventListener("click", () => {
      if (!copyButton.parentElement || !copyButton.parentElement.nextElementSibling) return
      const code = (copyButton.parentElement.nextElementSibling as HTMLElement).innerText
      copyCode(code)
      copyButton.innerText = "Copied!"
      setTimeout(() => {
        copyButton.innerText = "Copy"
      }, 2000)
    })
  })
})
</script>
