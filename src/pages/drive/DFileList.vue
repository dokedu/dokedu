<template>
  <div class="flex h-full flex-col">
    <div class="flex w-full items-start gap-3 px-4 py-3 text-sm">
      <div class="group flex h-fit w-2 items-start justify-center">
        <input
          type="checkbox"
          class="rounded border-transparent bg-transparent group-hover:border-stone-300 group-hover:bg-white"
        />
      </div>
      <div class="flex flex-1 items-center gap-1 text-strong">
        <div>Name</div>
        <ArrowDownWideNarrow :size="16" class="stroke-colors-strong" />
      </div>
      <div class="w-[230px] text-muted">Last modified</div>
      <div class="w-[120px] text-muted">Size</div>
      <div class="w-[80px]"></div>
    </div>
    <div
      v-for="file in files"
      class="group/item flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-stone-100"
      @click="clickFile(file)"
    >
      <div class="flex w-2 justify-center" @click.stop="">
        <input
          type="checkbox"
          :name="file.id"
          :id="file.id"
          class="h-4 w-4 rounded border-transparent text-gray-500 focus:ring-2 focus:ring-gray-500"
        />
      </div>

      <svg
        v-if="file.fileType === 'folder'"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.33366 16.6667H16.667C17.109 16.6667 17.5329 16.4911 17.8455 16.1785C18.1581 15.8659 18.3337 15.442 18.3337 15V6.66667C18.3337 6.22464 18.1581 5.80072 17.8455 5.48816C17.5329 5.17559 17.109 5 16.667 5H10.0587C9.78415 4.99858 9.51424 4.92937 9.27291 4.79853C9.03158 4.66769 8.82631 4.47927 8.67533 4.25L7.99199 3.25C7.84101 3.02073 7.63574 2.83231 7.39441 2.70147C7.15308 2.57063 6.88317 2.50142 6.60866 2.5H3.33366C2.89163 2.5 2.46771 2.67559 2.15515 2.98816C1.84259 3.30072 1.66699 3.72464 1.66699 4.16667V15C1.66699 15.9167 2.41699 16.6667 3.33366 16.6667Z"
          fill="#6B7280"
          stroke="#6B7280"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <svg
        v-if="file.fileType === 'blob' && !file.name.includes('pdf')"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="20" height="20" rx="5" fill="#E5E7EB" />
        <path
          d="M15.25 11.75L13.4498 9.94983C13.2311 9.73112 12.9344 9.60825 12.625 9.60825C12.3156 9.60825 12.0189 9.73112 11.8002 9.94983L6.5 15.25M5.91667 4.75H14.0833C14.7277 4.75 15.25 5.27233 15.25 5.91667V14.0833C15.25 14.7277 14.7277 15.25 14.0833 15.25H5.91667C5.27233 15.25 4.75 14.7277 4.75 14.0833V5.91667C4.75 5.27233 5.27233 4.75 5.91667 4.75ZM9.41667 8.25C9.41667 8.89433 8.89433 9.41667 8.25 9.41667C7.60567 9.41667 7.08333 8.89433 7.08333 8.25C7.08333 7.60567 7.60567 7.08333 8.25 7.08333C8.89433 7.08333 9.41667 7.60567 9.41667 8.25Z"
          stroke="#6B7280"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <svg
        v-if="file.fileType === 'blob' && file.name.includes('pdf')"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="20" height="20" rx="5" fill="#DC2626" />
        <path
          d="M3.56584 13V7.18182H5.86129C6.30258 7.18182 6.67853 7.2661 6.98913 7.43466C7.29974 7.60133 7.53648 7.83333 7.69936 8.13068C7.86413 8.42614 7.94652 8.76705 7.94652 9.15341C7.94652 9.53977 7.86319 9.88068 7.69652 10.1761C7.52985 10.4716 7.28838 10.7017 6.97209 10.8665C6.65769 11.0312 6.27701 11.1136 5.83004 11.1136H4.36697V10.1278H5.63118C5.86792 10.1278 6.063 10.0871 6.21641 10.0057C6.37171 9.92235 6.48724 9.80777 6.563 9.66193C6.64065 9.5142 6.67947 9.3447 6.67947 9.15341C6.67947 8.96023 6.64065 8.79167 6.563 8.64773C6.48724 8.50189 6.37171 8.3892 6.21641 8.30966C6.0611 8.22822 5.86413 8.1875 5.6255 8.1875H4.79595V13H3.56584ZM10.408 13H8.34553V7.18182H10.4251C11.0103 7.18182 11.5141 7.2983 11.9364 7.53125C12.3588 7.76231 12.6836 8.0947 12.9109 8.52841C13.14 8.96212 13.2546 9.48106 13.2546 10.0852C13.2546 10.6913 13.14 11.2121 12.9109 11.6477C12.6836 12.0833 12.3569 12.4176 11.9308 12.6506C11.5065 12.8835 10.9989 13 10.408 13ZM9.57564 11.946H10.3569C10.7205 11.946 11.0264 11.8816 11.2745 11.7528C11.5245 11.6222 11.712 11.4205 11.837 11.1477C11.9639 10.8731 12.0273 10.5189 12.0273 10.0852C12.0273 9.6553 11.9639 9.30398 11.837 9.03125C11.712 8.75852 11.5254 8.55777 11.2773 8.42898C11.0292 8.30019 10.7234 8.2358 10.3597 8.2358H9.57564V11.946ZM13.7658 13V7.18182H17.6181V8.19602H14.996V9.58239H17.3624V10.5966H14.996V13H13.7658Z"
          fill="white"
        />
      </svg>

      <div class="flex-1 select-none text-default">{{ file.name }}</div>
      <div class="w-[230px] select-none text-sm text-subtle">Feb 10, 2023 Peter Schwan</div>
      <div v-if="file.fileType !== 'folder'" class="w-[120px] select-none text-subtle">
        {{ prettyBytes(file.size) }}
      </div>
      <div v-else class="w-[120px]"></div>
      <div class="flex w-[80px] gap-1 pr-4 opacity-0 group-hover/item:opacity-100">
        <div class="group/icon w-fit rounded-lg p-1.5 hover:bg-blue-100" @click.stop="downloadFile(file)">
          <Download class="stroke-colors-subtle group-hover/icon:stroke-blue-900" :size="16" />
        </div>
        <div class="group/icon w-fit rounded-lg p-1.5 hover:bg-blue-100">
          <Edit class="stroke-colors-subtle group-hover/icon:stroke-blue-900" :size="16" />
        </div>
      </div>
    </div>
    <div v-if="files.length === 0" class="flex w-full flex-1 items-center justify-center gap-3 px-8 py-3">
      <div class="flex select-none flex-col items-center justify-center rounded-xl bg-muted p-8">
        <div class="mb-4 w-fit rounded-xl bg-strong p-2.5">
          <FileText class="stroke-colors-strong" :size="24" />
        </div>
        <div class="mb-2 text-center text-sm font-medium text-strong">Drop file here</div>
        <div class="text-center text-sm text-subtle">or use the "New" button.</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDownWideNarrow, FileText, Download, Edit } from "lucide-vue-next";
import { File } from "../../gql/graphql";
import { useMutation } from "@urql/vue";
import { graphql } from "../../gql";

export interface Props {
  files: Partial<File>[];
}

defineProps<Props>();

const emit = defineEmits(["click"]);

function clickFile(file: File) {
  emit("click", file);
}

async function downloadFile(file: File) {
  const { data } = await getFileURL({ input: { id: file.id } });

  // data?.generateFileURL.url
  // download file from url directly

  const url = data?.generateFileURL.url as string;

  forceDownload(url, file.name);
}

const { executeMutation: getFileURL } = useMutation(
  graphql(`
    mutation generateFileURL($input: GenerateFileURLInput!) {
      generateFileURL(input: $input) {
        url
      }
    }
  `)
);

function forceDownload(url, fileName) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(this.response);
    const tag = document.createElement("a");
    tag.href = imageUrl;
    tag.download = fileName;
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
  };
  xhr.send();
}

function prettyBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  if (Math.abs(bytes) < 1) {
    return bytes + "B";
  }

  const u = Math.min(Math.floor(Math.log10(bytes) / 3), units.length - 1);
  const n = Number((bytes / Math.pow(1000, u)).toFixed(2));
  return n + units[u];
}
</script>
