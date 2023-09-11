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
        :columns="columns"
        objectName="buckets"
        :query="sharedDrivesQuery"
        defaultSort="createdAt"
        :additionalTypenames="['Bucket']"
        @row-click="clickRow"
      >
        <template #name-data="{ column }">
          <div class="flex items-center gap-3">
            <Folder :size="18" class="fill-stone-700 stroke-colors-default" />
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

  <DDialogShareDrive :open="shareOpen" :item="(currentItem as Bucket)" @close="shareOpen = false"></DDialogShareDrive>
  <DDialogRenameDrive
    :open="renameOpen"
    :item="(currentItem as Bucket)"
    @close="renameOpen = false"
  ></DDialogRenameDrive>
</template>

<script setup lang="ts">
import DDriveHeaderBreadcrumbs from "@/components/drive/DDriveHeaderBreadcrumbs.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import PageHeader from "@/components/PageHeader.vue";
import PageContent from "@/components/PageContent.vue";
import DTable from "@/components/d-table/d-table.vue";
import DButton from "@/components/d-button/d-button.vue";
import { PageVariables } from "@/types/types";
import { ref } from "vue";
import { Plus, Folder, Edit2, Trash } from "lucide-vue-next";
import { graphql } from "@/gql";
import { useMutation } from "@urql/vue";
import router from "@/router";
import DDialogShareDrive from "@/components/drive/DDialogShareDrive.vue";
import DDialogRenameDrive from "@/components/drive/DDialogRenameDrive.vue";
import { Bucket } from "@/gql/graphql";
import { formatDate } from "@vueuse/core";
import i18n from "@/i18n";
import { Share2 } from "lucide-vue-next";

import DFileListDropdown from "@/components/drive/d-file-list-dropdown.vue";
import type { Option } from "@/components/drive/d-file-list-dropdown.vue";

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
  `)
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

async function clickRow(item: any) {
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
  `)
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
