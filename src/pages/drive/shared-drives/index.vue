<template>
  <PageWrapper>
    <PageHeader>
      <div class="flex w-full items-center justify-between">
        <d-drive-header-breadcrumbs />
        <DButton type="primary" size="md" :icon-left="Plus" @click="newSharedDrive">{{ $t("new") }}</DButton>
      </div>
    </PageHeader>
    <PageContent>
      <DTable
        v-model:variables="pageVariables"
        v-model:selected="selected"
        :columns="columns"
        objectName="buckets"
        :query="sharedDrivesQuery"
        defaultSort="createdAt"
        :additionalTypenames="['Bucket']"
        @row-click="clickRow"
        ref="dFileList"
      >
        <template #name-data="{ column }">
          <div class="flex items-center gap-3">
            <Folder :size="18" class="fill-neutral-700 stroke-colors-default" />
            <div class="text-default">{{ column }}</div>
          </div>
        </template>
        <template #createdAt-data="{ column }">
          <div class="text-default">{{ formatDate(new Date(Date.parse(column)), "DD.MM.YYYY hh:mm") }} Uhr</div>
        </template>
        <template #id-data="{ item }">
          <div class="flex w-full justify-end">
            <d-file-list-dropdown :option-list="optionListWithItem(item)" />
          </div>
        </template>
        <template #empty>{{ $t("no_shared_drives") }}</template>
      </DTable>
    </PageContent>
  </PageWrapper>

  <DDialogShareDrive :open="shareOpen" :item="currentItem as Bucket" @close="shareOpen = false"></DDialogShareDrive>
  <DDialogRenameDrive :open="renameOpen" :item="currentItem as Bucket" @close="renameOpen = false"></DDialogRenameDrive>
</template>

<script setup lang="ts">
import DDriveHeaderBreadcrumbs from "@/components/_drive/d-drive-header-breadcrumbs.vue";
import PageWrapper from "@/components/page-wrapper.vue";
import PageHeader from "@/components/page-header.vue";
import PageContent from "@/components/page-content.vue";
import DTable from "@/components/d-table/d-table.vue";
import DButton from "@/components/d-button/d-button.vue";
import type { PageVariables } from "@/types/types.ts";
import { ref } from "vue";
import { Plus, Folder, Edit2, Trash } from "lucide-vue-next";
import { graphql } from "@/gql";
import { useMutation } from "@urql/vue";
import router from "@/router/router.ts";
import DDialogShareDrive from "@/components/_drive/d-dialog/d-dialog-share-drive.vue";
import DDialogRenameDrive from "@/components/_drive/d-dialog/d-dialog-rename-drive.vue";
import { Bucket } from "@/gql/graphql";
import { formatDate, onClickOutside } from "@vueuse/core";
import i18n from "@/i18n.ts";
import { Share2 } from "lucide-vue-next";

import DFileListDropdown from "@/components/_drive/d-file-list-dropdown.vue";
import type { Option } from "@/components/_drive/d-file-list-dropdown.vue";

const dFileList = ref<any>(null);

const currentItem = ref<Bucket>();
const shareOpen = ref(false);
const renameOpen = ref(false);

const { executeMutation } = useMutation(
  graphql(`
    mutation deleteSharedDrive($id: ID!) {
      deleteSharedDrive(id: $id) {
        id
      }
    }
  `),
);

async function deleteSharedDrive(item: any) {
  item.open = false;
  if (confirm("Are you sure?")) {
    const { error } = await executeMutation({ id: item.id });
    if (error) {
      alert(error.message);
    }
  }
}

function toggleShareModal(item: any) {
  item.open = false;
  currentItem.value = item;
  shareOpen.value = true;
}

function toggleRenameModal(item: any) {
  item.open = false;
  currentItem.value = item;
  renameOpen.value = true;
}

async function newSharedDrive() {
  const name = prompt("Enter name");

  if (name) {
    await createSharedDrive({ name });
  }
}

const selected = ref<{ id: string }[]>([]);

onClickOutside(dFileList, () => {
  console.log("click outside", selected.value);
  selected.value = [];
});

async function clickRow(item: any) {
  console.log("click row", item);
  const isSelected = selected.value.find((f) => f.id === item.id);
  if (!isSelected) return;

  await router.push({
    name: "/drive/shared-drives/[id]/",
    params: {
      id: item.id,
    },
  });
}

const { executeMutation: createSharedDrive } = useMutation(
  graphql(`
    mutation createSharedDrive($name: String!) {
      createSharedDrive(name: $name) {
        id
        name
      }
    }
  `),
);

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
    label: "-",
    key: "id",
    width: 0.1,
  },
];

interface Variables extends PageVariables {}

const pageVariables = ref<Variables[]>([
  {
    limit: 25,
    offset: 0,
  },
]);

const sharedDrivesQuery = graphql(`
  query buckets {
    buckets(input: { shared: true }) {
      edges {
        id
        name
        shared
        createdAt
        permission
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);

function optionListWithItem(item: File): Option[][] {
  return [
    [
      {
        text: i18n.global.t("rename"),
        icon: Edit2,
        func: () => toggleRenameModal(item),
      },
      {
        text: i18n.global.t("share"),
        icon: Share2,
        func: () => toggleShareModal(item),
      },
    ],
    [
      {
        text: i18n.global.t("delete"),
        icon: Trash,
        func: () => deleteSharedDrive(item),
      },
    ],
  ];
}
</script>
