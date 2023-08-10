<template>
  <div
    v-if="file"
    class="absolute left-0 top-0 z-40 flex h-screen max-h-screen w-full select-none flex-col bg-stone-900/90"
    @click="emit('close')"
  >
    <div class="flex h-14 w-full items-center justify-between px-2 text-sm" @click.stop>
      <div class="flex items-center gap-2 text-white">
        <button
          type="button"
          class="rounded-lg p-2 hover:bg-white/10 focus:outline-none active:bg-white/20"
          @click.stop="emit('close')"
        >
          <ArrowLeft class="stroke-white" :size="18" />
        </button>
        <div>
          {{ file.name }}
        </div>
      </div>
      <div class="flex items-center gap-1 text-white">
        <button
          type="button"
          class="rounded-lg p-2 hover:bg-white/10 focus:outline-none active:bg-white/20"
          @click.stop="download"
        >
          <Download class="stroke-white" :size="18" />
        </button>
        <div
          v-if="(isFileOfType(file) === 'image' || isFileOfType(file) === 'pdf') && url"
          @click="print"
          class="rounded-lg p-2 hover:bg-white/10"
        >
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
        v-if="isFileOfType(file) === 'image' && url"
        :src="url"
        alt=""
        class="mx-auto block h-fit max-h-full w-fit max-w-full bg-stone-900 object-contain"
      />
      <canvas
        @click.stop
        v-if="isFileOfType(file) === 'pdf' && url"
        ref="canvas"
        class="mx-auto block h-fit max-h-full w-fit object-contain"
      ></canvas>
      <video
        @click.stop
        v-if="isFileOfType(file) === 'video' && url"
        :src="url"
        controls
        class="mx-auto block h-fit max-h-full w-fit object-contain"
      ></video>
      <audio @click.stop v-if="isFileOfType(file) === 'audio' && url" :src="url" controls class="mx-auto"></audio>
      <div v-if="!isFileOfType(file)" class="mx-auto text-center text-white">
        Previewing this file is not supported yet.
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { File } from "@/gql/graphql";
import { ref, watch } from "vue";
import { onKeyStroke } from "@vueuse/core";
import useDownloadFile from "@/composables/useDownloadFile";
import { ArrowLeft, Download, Star, Printer, MoreVertical } from "lucide-vue-next";

export interface Props {
  file: File | null;
}

function isFileOfType(file: File) {
  switch (file.MIMEType) {
    case "image/jpeg":
    case "image/png":
    case "image/gif":
      return "image";
    case "application/pdf":
      return "pdf";
    case "video/mp4":
    case "video/ogg":
    case "video/webm":
      return "video";
    case "audio/mpeg":
    case "audio/ogg":
    case "audio/wav":
      return "audio";
    default:
      return false;
  }
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

function print() {
  if (props.file && url.value) {
    if (isFileOfType(props.file) === "pdf") {
      window.open(url.value, "_blank");
      return;
    }
    // is image
    if (isFileOfType(props.file) === "image") {
      // open print modal with image on a page
      const img = document.createElement("img");
      img.src = url.value;

      // Wait for the image to load before opening the print modal
      img.onload = function () {
        // Create a new window to display the image
        const printWindow = window.open();

        if (!printWindow) {
          return;
        }

        // Append the image to the new window's document
        printWindow.document.write('<html><body style="margin: 0;">');
        printWindow.document.write('<img src="' + url.value + '" style="max-width: 100%; max-height: 100%;">');
        printWindow.document.write("</body></html>");
        printWindow.document.close();

        // Wait for the image to be fully loaded in the new window before printing
        printWindow.onload = function () {
          // Trigger the print modal for the new window
          printWindow.print();
        };
      };

      // destroy image
      img.remove();
    }
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
