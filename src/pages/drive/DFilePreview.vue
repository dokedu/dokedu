<template>
  <div
    v-if="file"
    class="absolute left-0 top-0 z-40 flex h-screen max-h-screen w-full select-none flex-col bg-stone-900/90"
    @click="emit('close')"
  >
    <div class="flex h-14 w-full items-center justify-between px-2 text-sm" @click.stop>
      <div class="flex items-center gap-2 text-white">
        <button type="button" class="rounded-lg p-2 hover:bg-white/10 focus:outline-none active:bg-white/20">
          <ArrowLeft class="stroke-white" :size="18" @click.stop="emit('close')" />
        </button>
        <div>
          {{ file.name }}
        </div>
      </div>
      <div class="flex items-center gap-1 text-white">
        <button type="button" class="rounded-lg p-2 hover:bg-white/10 focus:outline-none active:bg-white/20">
          <Download class="stroke-white" :size="18" @click.stop="download" />
        </button>
        <div class="rounded-lg p-2 hover:bg-white/10">
          <Printer class="stroke-white" :size="18" />
        </div>
        <div class="rounded-lg p-2 hover:bg-white/10">
          <Star class="stroke-white" :size="18" />
        </div>
        <div class="rounded-lg p-2 hover:bg-white/10">
          <MoreVertical class="stroke-white" :size="18" />
        </div>
      </div>
    </div>
    <div class="flex h-[calc(100%-14rem)] w-full flex-1 items-center p-8">
      <img
        @click.stop
        v-if="!file.name.includes('.pdf') && url"
        :src="url"
        alt=""
        class="block h-fit w-full bg-stone-900 object-contain"
      />
      <canvas
        @click.stop
        v-if="file.name.includes('.pdf')"
        ref="canvas"
        class="mx-auto block h-fit max-h-full w-fit object-contain"
      ></canvas>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { File } from "../../gql/graphql";
import { ref, watch } from "vue";
import { onKeyStroke } from "@vueuse/core";
import useDownloadFile from "@/composables/useDownloadFile";
import { ArrowLeft, Download, Star, Printer, MoreVertical } from "lucide-vue-next";

export interface Props {
  file: File | null;
}

const props = withDefaults(defineProps<Props>(), {
  file: null,
});

const emit = defineEmits(["close"]);

onKeyStroke("Escape", () => {
  emit("close");
});

const canvas = ref<HTMLCanvasElement | null>(null);
const url = ref<string | null>();

const { getFileURL, downloadFile } = useDownloadFile();

function download() {
  if (props.file) {
    downloadFile(props.file);
  }
}

watch(
  // @ts-expect-error
  () => props.file,
  async (file: File) => {
    if (file) {
      url.value = null;
      const { data } = await getFileURL({
        id: file.id,
      });

      url.value = data?.previewFile.url;

      if (file.name.includes(".pdf")) {
        renderPDF(url.value);
      }
    }
  }
);

// @ts-expect-error
async function renderPDF(url) {
  // @ts-expect-error
  const pdfjsLib = await import("pdfjs-dist/build/pdf");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs-3.7.107-dist/build/pdf.worker.js";

  const loadingTask = pdfjsLib.getDocument(url);

  // @ts-expect-error
  await loadingTask.promise.then(async (pdf) => {
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 2 });

    const context = canvas.value?.getContext("2d");

    if (context) {
      canvas.value!.height = viewport.height;
      canvas.value!.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext);
    }
  });
}
</script>
