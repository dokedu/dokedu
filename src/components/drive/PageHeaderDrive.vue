<template>
  <PageHeader class="flex min-h-0 select-none justify-between gap-4">
    <d-drive-header-breadcrumbs />
    <div class="flex gap-2">
      <DButton
        v-if="permission == FilePermission.Manager"
        type="transparent"
        size="md"
        :icon-left="FolderPlus"
        @click="addFolder"
        >Folder</DButton
      >
      <DDialog :open="newFolderDialog" @close="newFolderDialog = false">
        <input type="text" placeholder="Folder name" />
      </DDialog>
      <DButton v-if="permission == FilePermission.Manager" type="primary" size="md" :icon-left="Plus" @click="open()">
        New
      </DButton>
    </div>
  </PageHeader>
</template>

<script lang="ts" setup>
import DDriveHeaderBreadcrumbs from "./DDriveHeaderBreadcrumbs.vue";
import PageHeader from "@/components/PageHeader.vue";
import DButton from "@/components/d-button/d-button.vue";
import { FolderPlus, Plus } from "lucide-vue-next";
import DDialog from "@/components/d-dialog/d-dialog.vue";
import { useFileDialog } from "@vueuse/core";
import { ref, toRefs } from "vue";
import { useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { FilePermission } from "@/gql/graphql";

export interface Props {
  title: string;
  folderId: string | null;
  bucketId: string | null;
  permission: FilePermission;
}

const props = withDefaults(defineProps<Props>(), {
  bucketId: null,
  permission: FilePermission.Manager,
});

const { folderId, bucketId } = toRefs(props);

const { open, reset, onChange } = useFileDialog();
const newFolderDialog = ref(false);

const emit = defineEmits(["upload"]);

onChange(async (e) => {
  if (!e) return;
  emit("upload", {
    input: {
      file: e[0],
      parentId: folderId.value,
    },
  });
  reset();
});

async function addFolder() {
  const folderName = prompt("Folder name");

  if (folderName) {
    await createFolder({
      input: {
        name: folderName,
        parentId: folderId.value as string,
        ...(bucketId.value && { bucketId: bucketId.value }),
      },
    });
  }
}

const { executeMutation: createFolder } = useMutation(
  graphql(`
    mutation createFolder($input: CreateFolderInput!) {
      createFolder(input: $input) {
        id
      }
    }
  `)
);
</script>
