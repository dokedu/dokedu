<script lang="ts" setup>
import { onMounted, ref, watch } from "vue"
// @ts-ignore
import * as pdfjs from "pdfjs-dist/build/pdf"
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?worker"

const props = defineProps({
  fileUrl: {
    type: String,
    required: true
  }
})

const canvas = ref<HTMLCanvasElement | null>(null)
const url = ref<string | null>()

onMounted(() => {
  renderPDF(props.fileUrl)
})

watch(
  () => props.fileUrl,
  async (fileUrl: string) => {
    if (fileUrl) {
      url.value = fileUrl

      renderPDF(url.value)
    }
  }
)

function init(): void {
  try {
    if (typeof window === "undefined" || !("Worker" in window)) {
      throw new Error("Web Workers not supported in this environment.")
    }

    // @ts-ignore
    window.pdfjsWorker = pdfjsWorker
    pdfjs.GlobalWorkerOptions.workerSrc = `/pdfjs-4.0.379-dist/build/pdf.worker.mjs`
  } catch (error) {
    throw new Error("PDF.js failed to load. ")
  }
}

// @ts-expect-error
async function renderPDF(url) {
  try {
    init()
  } catch (error) {
    console.error(error)
  }

  const loadingTask = pdfjs.getDocument(url)

  await loadingTask.promise.then(async (pdf: any) => {
    const page = await pdf.getPage(1)

    const viewport = page.getViewport({ scale: 2 })

    const context = canvas.value?.getContext("2d")

    if (context) {
      canvas.value!.height = viewport.height
      canvas.value!.width = viewport.width

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }

      await page.render(renderContext)
    }
  })
}
</script>

<template>
  <div class="w-full h-full">
    <canvas ref="canvas" class="mx-auto block w-full h-full max-h-full object-contain"></canvas>
  </div>
</template>
