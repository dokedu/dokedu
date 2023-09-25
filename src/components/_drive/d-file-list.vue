<template>
  <d-table
    v-bind="$attrs"
    v-model:variables="pageVariables"
    v-model:selected="selected"
    :columns="columns"
    objectName="files"
    :query="filesQuery"
    defaultSort="createdAt"
    :additionalTypenames="['File']"
    :draggable="true"
    dragDataType="dokedu/vnd.dokedu-drive-file"
    @row-click="clickFile"
    ref="dFileList"
  >
    <template #name-data="{ column, item }">
      <div class="flex items-center gap-3">
        <component
          :is="useFileIcon(item)"
          :size="18"
          class="stroke-colors-default"
          :class="{ 'fill-neutral-700': isFolder(item) }"
        />
        <div class="text-default">{{ column }}</div>
      </div>
    </template>
    <template #createdAt-data="{ column }">
      <div class="text-default">{{ formatDate(new Date(Date.parse(column)), "DD.MM.YYYY hh:mm") }} Uhr</div>
    </template>
    <template #size-data="{ column, item }">
      <div class="text-default">{{ isBlob(item) ? prettyBytes(column) : "-" }}</div>
    </template>
    <template #id-data="{ item }">
      <div class="h-7">
        <div class="flex w-[80px] justify-end gap-1 pr-4">
          <div
            v-if="isBlob(item)"
            class="group/icon hidden w-fit rounded-lg p-1.5 hover:bg-blue-100 group-hover/row:block"
            @click.stop="downloadFile(item)"
          >
            <Download class="stroke-colors-subtle group-hover/icon:stroke-blue-900" :size="16" />
          </div>
          <div
            class="group/icon hidden w-fit rounded-lg p-1.5 hover:bg-blue-100 group-hover/row:block"
            @click.stop="onRenameFile(item)"
          >
            <Edit class="stroke-colors-subtle group-hover/icon:stroke-blue-900" :size="16" />
          </div>
          <div
            class="group/icon hidden w-fit rounded-lg p-1.5 hover:bg-blue-100 group-hover/row:block"
            @click.stop="openDeleteFileDialog(item)"
          >
            <Trash class="stroke-colors-subtle group-hover/icon:stroke-blue-900" :size="16" />
          </div>
          <div>
            <d-file-list-dropdown :option-list="optionListWithItem(item)" />
          </div>
        </div>
      </div>
    </template>
    <template #empty>
      <div class="flex h-[75vh] w-full flex-1 items-center justify-center gap-3 px-8 py-3">
        <div class="flex select-none flex-col items-center justify-center rounded-xl bg-muted p-8">
          <div class="mb-4 w-fit rounded-xl bg-strong p-2.5">
            <FileText class="stroke-colors-strong" :size="24" />
          </div>
          <div class="mb-2 text-center text-sm font-medium text-strong">{{ $t("drop_file_here") }}</div>
          <div class="text-center text-sm text-subtle">{{ $t("or_use_new_button") }}</div>
        </div>
      </div>
    </template>
  </d-table>

  <d-dialog-rename-file :open="showRenameDialog" v-model="renameDialogFile" @close="closeRenameDialog" />
  <d-dialog-delete-file
    :open="showDeleteDialog"
    v-model="deleteDialogFile"
    @close="closeDeleteDialog"
    @delete="onDeleteFile"
  />
</template>

<script lang="ts">
export interface Props {
  folderId: string | null;
  bucketId: string | null;
}
</script>

<script lang="ts" setup>
import {
  FileText,
  Download,
  Edit,
  FileImage,
  Folder,
  Archive,
  File as FileFile,
  Trash,
  FileVideo,
  Edit2,
} from "lucide-vue-next";
import DFileListDropdown from "./d-file-list-dropdown.vue";
import type { Option } from "./d-file-list-dropdown.vue";
import useDownloadFile from "@/composables/useDownloadFile";
import DDialogRenameFile from "./d-dialog/d-dialog-rename-file.vue";
import DDialogDeleteFile from "./d-dialog/d-dialog-delete-file.vue";
import DTable from "@/components/d-table/d-table.vue";
import type { PageVariables } from "@/types/types.ts";
import { computed, reactive, ref, toRefs } from "vue";
import { formatDate } from "@vueuse/core";
import { File } from "@/gql/graphql";
import { graphql } from "@/gql";
import { useMutation } from "@urql/vue";
import i18n from "@/i18n.ts";
import { onClickOutside } from "@vueuse/core";

const dFileList = ref<any>(null);

const props = withDefaults(defineProps<Props>(), {
  folderId: null,
  bucketId: null,
});

const { folderId: parentId, bucketId } = toRefs(props);

interface Variables extends PageVariables {}

const showRenameDialog = ref(false);
const renameDialogFile = ref<File | null>(null);
function onRenameFile(file: File) {
  renameDialogFile.value = file;
  showRenameDialog.value = true;
}
function closeRenameDialog() {
  showRenameDialog.value = false;
}

const showDeleteDialog = ref(false);
const deleteDialogFile = ref<File | null>(null);
function closeDeleteDialog() {
  showDeleteDialog.value = false;
}
function openDeleteFileDialog(file: File) {
  deleteDialogFile.value = file;
  showDeleteDialog.value = true;
}
async function onDeleteFile(file: File) {
  deleteFile({ id: file.id });
}

const { executeMutation: deleteFile } = useMutation(
  graphql(`
    mutation deleteFile($id: ID!) {
      deleteFile(input: { id: $id }) {
        success
        file {
          id
        }
      }
    }
  `)
);

const pageVariables = computed<Variables[]>(() => [
  {
    limit: 25,
    offset: 0,
    filter: reactive({
      parentId: parentId,
      myBucket: !bucketId.value,
      ...(bucketId.value ? { bucketId: bucketId } : {}),
    }),
  },
]);

const selected = ref<{ id: string }[]>([]);

onClickOutside(dFileList, () => {
  console.log("click outside", selected.value);
  selected.value = [];
});

function isFolder(file: File) {
  return file.fileType === "folder";
}

function useFileIcon(file: File) {
  if (isFolder(file)) {
    return Folder;
  }

  switch (file.MIMEType) {
    case "application/pdf":
      return FileText;
    case "image/png":
      return FileImage;
    case "image/jpeg":
      return FileImage;
    case "image/gif":
      return FileImage;
    case "image/webp":
      return FileImage;
    case "image/jpg":
      return FileImage;
    case "application/zip":
      return Archive;
    // video
    case "video/mp4":
      return FileVideo;
    default:
      return FileFile;
  }
}

function isBlob(file: File) {
  return file.fileType === "blob";
}

const { downloadFile } = useDownloadFile();

const emit = defineEmits(["click"]);

const columns = [
  {
    label: "name",
    key: "name",
    width: 0.5,
  },
  {
    label: "created_at",
    key: "createdAt",
  },
  {
    label: "filesize",
    key: "size",
  },
  {
    label: "-",
    key: "id",
    width: 0.1,
  },
];

const filesQuery = graphql(`
  query files($offset: Int, $limit: Int, $filter: FilesFilterInput) {
    files(input: $filter, limit: $limit, offset: $offset) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        id
        name
        fileType
        MIMEType
        size
        createdAt
      }
    }
  }
`);

function clickFile(file: any) {
  const isSelected = selected.value.find((f) => f.id === file.id);
  if (!isSelected) return;

  emit("click", file);
}

function prettyBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  if (Math.abs(bytes) < 1) {
    return bytes + "B";
  }

  const u = Math.min(Math.floor(Math.log10(bytes) / 3), units.length - 1);
  const n = Number((bytes / Math.pow(1000, u)).toFixed(2));
  return `${n} ${units[u]}`;
}

function optionListWithItem(item: File): Option[][] {
  const downloadAction = {
    text: i18n.global.t("download"),
    icon: Download,
    func: () => downloadFile(item),
  };

  return [
    [
      {
        text: i18n.global.t("rename"),
        icon: Edit2,
        func: () => onRenameFile(item),
      },
      ...(isBlob(item) ? [downloadAction] : []),
    ],
    [
      {
        text: i18n.global.t("delete"),
        icon: Trash,
        func: () => openDeleteFileDialog(item),
      },
    ],
  ];
}
</script>
