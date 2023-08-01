<template>
  <PageHeader class="flex min-h-0 select-none justify-between">
    <div class="flex items-center gap-2 text-strong">
      <router-link
        :to="{ name: 'drive-my-drive' }"
        class="w-fit whitespace-nowrap rounded-lg px-1 py-0.5 hover:bg-stone-100"
      >
        My Drive
      </router-link>
      <template v-if="!queryFolder && folder">
        <template v-for="parent in folder.file.parents" class="stroke-colors">
          <span>/</span>
          <router-link
            :to="{ name: 'drive-my-drive-folders-folder', params: { id: parent.id } }"
            class="line-clamp-1 text-ellipsis rounded-lg px-1 py-0.5 hover:bg-stone-100"
          >
            {{ parent.name }}
          </router-link>
        </template>
        <span>/</span>
        <router-link
          :to="{ name: 'drive-my-drive-folders-folder', params: { id: folder.file.id } }"
          class="whitespace-nowrap rounded-lg px-1 py-0.5 hover:bg-stone-100"
        >
          {{ folder?.file.name }}
        </router-link>
      </template>
    </div>
    <div class="flex gap-2">
      <DButton type="transparent" size="md" :icon-left="FolderPlus" @click="addFolder">Folder</DButton>
      <DDialog :open="newFolderDialog" @close="newFolderDialog = false">
        <input type="text" placeholder="Folder name" />
      </DDialog>
      <DButton type="primary" size="md" :icon-left="Plus" @click="open()"> New </DButton>
    </div>
  </PageHeader>
</template>

<script lang="ts" setup>
import PageHeader from "@/components/PageHeader.vue";
import DButton from "@/components/d-button/d-button.vue";
import { FolderPlus, Plus } from "lucide-vue-next";
import DDialog from "@/components/d-dialog/d-dialog.vue";
import { useFileDialog } from "@vueuse/core";
import { computed, reactive, ref } from "vue";
import { useMutation, useQuery } from "@urql/vue";
import { graphql } from "@/gql";
import { useRoute } from "vue-router";

const { open, reset, onChange } = useFileDialog();
const newFolderDialog = ref(false);

const route = useRoute();

const folderId = computed<string>(() => route.params.id as string);
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
  // newFolderDialog.value = true
  // alert with input
  const folderName = prompt("Folder name");
  if (folderName) {
    await createFolder({
      input: {
        name: folderName,
        parentId: folderId.value as string,
      },
    });
    // refreshFiles();
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

const queryFolder = computed(() => {
  return folderId.value === undefined || folderId.value === null;
});

const { data: folder } = useQuery({
  query: graphql(`
    query fileById($id: ID!) {
      file(id: $id) {
        id
        name
        parents {
          id
          name
        }
      }
    }
  `),
  variables: reactive({
    id: folderId,
  }),
  pause: queryFolder,
});
</script>
