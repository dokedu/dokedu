<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div>
        <span @click="folder = ''">My Drive</span>
      </div>
      <div class="flex gap-2">
        <DButton type="transparent" size="md" :icon-left="FolderPlus" @click="addFolder">
          Folder
        </DButton>
        <DDialog :open="newFolderDialog" @close="newFolderDialog = false">
          <input type="text" placeholder="Folder name">
        </DDialog>
        <DButton type="primary" size="md" :icon-left="Plus" @click="open()">
          New
        </DButton>
      </div>
    </PageHeader>
    <PageContent>
      <div class="flex flex-col transition-all h-full" @drop.prevent="dropHandler" @dragover="dragover"
        :class="{ 'bg-blue-100': hasDragover }">
        <div class="text-sm flex gap-3 items-center px-4 py-3 w-full ">
          <div class="w-2 flex justify-center group">
            <input type="checkbox"
              class="rounded border-transparent bg-transparent group-hover:border-stone-300 group-hover:bg-white">
          </div>
          <div class="flex-1 text-strong flex gap-1 items-center">
            <div>Name</div>
            <ArrowDownWideNarrow :size="16" class="stroke-colors-strong" />
          </div>
          <div class="text-muted w-[230px]">Last modified</div>
          <div class="w-[120px] text-muted">Size</div>
        </div>
        <div v-for=" file  in filesSorted" class="flex gap-3 text-sm items-center px-4 py-3 w-full hover:bg-stone-100 "
          @click="clickFile(file)">
          <div class="w-2 flex justify-center " @click.stop="">
            <input v-model="checkedFiles[file.id]" type="checkbox" :name="file.id" :id="file.id"
              class="w-4 h-4 rounded border-transparent text-gray-500 focus:ring-gray-500 focus:ring-2">
          </div>

          <svg v-if="file.fileType === 'folder'" width="20" height="20" viewBox="0 0 20 20" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3.33366 16.6667H16.667C17.109 16.6667 17.5329 16.4911 17.8455 16.1785C18.1581 15.8659 18.3337 15.442 18.3337 15V6.66667C18.3337 6.22464 18.1581 5.80072 17.8455 5.48816C17.5329 5.17559 17.109 5 16.667 5H10.0587C9.78415 4.99858 9.51424 4.92937 9.27291 4.79853C9.03158 4.66769 8.82631 4.47927 8.67533 4.25L7.99199 3.25C7.84101 3.02073 7.63574 2.83231 7.39441 2.70147C7.15308 2.57063 6.88317 2.50142 6.60866 2.5H3.33366C2.89163 2.5 2.46771 2.67559 2.15515 2.98816C1.84259 3.30072 1.66699 3.72464 1.66699 4.16667V15C1.66699 15.9167 2.41699 16.6667 3.33366 16.6667Z"
              fill="#6B7280" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg v-if="file.fileType === 'blob' && !file.name.includes('pdf')" width="20" height="20" viewBox="0 0 20 20"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="20" rx="5" fill="#E5E7EB" />
            <path
              d="M15.25 11.75L13.4498 9.94983C13.2311 9.73112 12.9344 9.60825 12.625 9.60825C12.3156 9.60825 12.0189 9.73112 11.8002 9.94983L6.5 15.25M5.91667 4.75H14.0833C14.7277 4.75 15.25 5.27233 15.25 5.91667V14.0833C15.25 14.7277 14.7277 15.25 14.0833 15.25H5.91667C5.27233 15.25 4.75 14.7277 4.75 14.0833V5.91667C4.75 5.27233 5.27233 4.75 5.91667 4.75ZM9.41667 8.25C9.41667 8.89433 8.89433 9.41667 8.25 9.41667C7.60567 9.41667 7.08333 8.89433 7.08333 8.25C7.08333 7.60567 7.60567 7.08333 8.25 7.08333C8.89433 7.08333 9.41667 7.60567 9.41667 8.25Z"
              stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg v-if="file.fileType === 'blob' && file.name.includes('pdf')" width="20" height="20" viewBox="0 0 20 20"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="20" rx="5" fill="#DC2626" />
            <path
              d="M3.56584 13V7.18182H5.86129C6.30258 7.18182 6.67853 7.2661 6.98913 7.43466C7.29974 7.60133 7.53648 7.83333 7.69936 8.13068C7.86413 8.42614 7.94652 8.76705 7.94652 9.15341C7.94652 9.53977 7.86319 9.88068 7.69652 10.1761C7.52985 10.4716 7.28838 10.7017 6.97209 10.8665C6.65769 11.0312 6.27701 11.1136 5.83004 11.1136H4.36697V10.1278H5.63118C5.86792 10.1278 6.063 10.0871 6.21641 10.0057C6.37171 9.92235 6.48724 9.80777 6.563 9.66193C6.64065 9.5142 6.67947 9.3447 6.67947 9.15341C6.67947 8.96023 6.64065 8.79167 6.563 8.64773C6.48724 8.50189 6.37171 8.3892 6.21641 8.30966C6.0611 8.22822 5.86413 8.1875 5.6255 8.1875H4.79595V13H3.56584ZM10.408 13H8.34553V7.18182H10.4251C11.0103 7.18182 11.5141 7.2983 11.9364 7.53125C12.3588 7.76231 12.6836 8.0947 12.9109 8.52841C13.14 8.96212 13.2546 9.48106 13.2546 10.0852C13.2546 10.6913 13.14 11.2121 12.9109 11.6477C12.6836 12.0833 12.3569 12.4176 11.9308 12.6506C11.5065 12.8835 10.9989 13 10.408 13ZM9.57564 11.946H10.3569C10.7205 11.946 11.0264 11.8816 11.2745 11.7528C11.5245 11.6222 11.712 11.4205 11.837 11.1477C11.9639 10.8731 12.0273 10.5189 12.0273 10.0852C12.0273 9.6553 11.9639 9.30398 11.837 9.03125C11.712 8.75852 11.5254 8.55777 11.2773 8.42898C11.0292 8.30019 10.7234 8.2358 10.3597 8.2358H9.57564V11.946ZM13.7658 13V7.18182H17.6181V8.19602H14.996V9.58239H17.3624V10.5966H14.996V13H13.7658Z"
              fill="white" />
          </svg>

          <div class="flex-1 text-default select-none">{{ file.name }}</div>
          <div class="text-sm text-subtle w-[230px]">
            Feb 10, 2023 Peter Schwan
          </div>
          <div v-if="file.fileType !== 'folder'" class="w-[120px] text-subtle">{{ prettyBytes(file.size) }}
          </div>
          <div v-else class="w-[120px]"></div>
        </div>
      </div>
    </PageContent>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageWrapper from "../../components/PageWrapper.vue";
import PageHeader from "../../components/PageHeader.vue";
import PageContent from "../../components/PageContent.vue";
import { useMutation, useQuery } from "@urql/vue";
import { graphql } from "../../gql";
import { useFileDialog } from "@vueuse/core";
import { useRouteQuery } from '@vueuse/router'
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import DButton from "../../components/d-button/d-button.vue";
import { FolderPlus, Plus, ArrowDownWideNarrow } from "lucide-vue-next";
import DDialog from "../../components/d-dialog/d-dialog.vue";

const { open, reset, onChange } = useFileDialog()

const checkedFiles = ref<string[]>([])

const newFolderDialog = ref(false)

const folder = useRouteQuery('folder', "", {
  transform: String
})

const folderId = computed(() => {
  return folder.value.length > 0 ? folder.value : null
})

onChange(async (e) => {
  await uploadFile({
    input: {
      file: e[0],
      parentId: folderId.value,
    }
  })
  reset()
  refreshFiles()
})

async function dropHandler(event: any) {
  // console.log(event)
  if (event.dataTransfer) {
    if (event.dataTransfer.files.length > 0) {
      await uploadFile({
        input: {
          file: event.dataTransfer.files[0],
          parentId: folderId.value,
        }
      })
      refreshFiles()
      hasDragover.value = false
    }
  }
}

async function addFolder() {
  // newFolderDialog.value = true
  // alert with input
  const folderName = prompt("Folder name")
  if (folderName) {
    await createFolder({
      input: {
        name: folderName,
        parentId: folder.value,
      }
    })
    refreshFiles()
  }
}

function dragover(event: any) {
  hasDragover.value = true
}

const hasDragover = ref(false)

const events = ['dragenter', 'dragover', 'dragleave', 'drop']

function preventDefaults(e) {
  e.preventDefault()
}

function prettyBytes(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (Math.abs(bytes) < 1) {
    return bytes + 'B'
  }

  const u = Math.min(Math.floor(Math.log10(bytes) / 3), units.length - 1)
  const n = Number((bytes / Math.pow(1000, u)).toFixed(2))
  return n + units[u]
}

onMounted(() => {
  events.forEach((eventName) => {
    document.body.addEventListener(eventName, preventDefaults)
  })
})

onUnmounted(() => {
  events.forEach((eventName) => {
    document.body.removeEventListener(eventName, preventDefaults)
  })
})

const { executeMutation: uploadFile } = useMutation(
  graphql(`
    mutation singleUpload($input: FileUploadInput!) {
      singleUpload(input: $input) {
       id
      }
    }
  `),
);

const { executeMutation: createFolder } = useMutation(
  graphql(`
    mutation createFolder($input: CreateFolderInput!) {
      createFolder(input: $input) {
       id
      }
    }
  `),
);

const filesSorted = computed(() => {
  // sort by fileType
  return files.value?.myFiles.edges.sort((a, b) => {
    if (a.fileType === "folder" && b.fileType !== "folder") {
      return -1;
    }
    if (a.fileType !== "folder" && b.fileType === "folder") {
      return 1;
    }
    return 0;
  });
})


function clickFile(file) {
  if (file.fileType === "folder") {
    folder.value = file.id;
  }
}

const { data: files, executeQuery: refreshFiles } = useQuery({
  query: graphql(`
    query myFiles($input: MyFilesFilterInput) {
      myFiles(input: $input) {
        edges {
          id
          name
          fileType
          size
        }
      }
    }
  `),
  variables: {
    input: {
      parentId: folderId,
    }
  },
});
</script>
