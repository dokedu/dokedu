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
          <div>
            <div class="flex w-[80px] justify-end gap-1 pr-4">
              <div>
                <div class="group/icon w-fit rounded-lg p-1.5 hover:bg-blue-100" @click.stop="item.open = true">
                  <MoreVertical class="stroke-colors-subtle group-hover/icon:stroke-blue-900" :size="16" />
                </div>
                <DContextMenu
                  :key="item.id"
                  :show="!!item.open"
                  :alignment="ContextMenuAlignment.BottomRight"
                  @close="item.open = false"
                >
                  <div class="px-1 py-1">
                    <button
                      class="w-full rounded-md px-2 py-1.5 text-left font-medium text-strong transition ease-in-out hover:bg-blue-100 hover:text-blue-900"
                      @click.stop="toggleShareModal(item)"
                    >
                      {{ $t("share") }}
                    </button>
                  </div>
                </DContextMenu>
              </div>
            </div>
          </div>
        </template>
        <template #empty>{{ $t("no_shared_drives") }}</template>
      </DTable>
    </PageContent>
  </PageWrapper>

  <DDialogShareDrive :open="shareOpen" :item="(currentItem as Bucket)" @close="shareOpen = false"></DDialogShareDrive>
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
import { Plus, Folder, MoreVertical } from "lucide-vue-next";
import { graphql } from "@/gql";
import { useMutation } from "@urql/vue";
import router from "@/router";
import DContextMenu from "@/components/d-context-menu/d-context-menu.vue";
import { ContextMenuAlignment } from "@/components/d-context-menu/d-context-menu.vue";
import DDialogShareDrive from "@/components/drive/DDialogShareDrive.vue";
import { Bucket } from "@/gql/graphql";
import { formatDate } from "@vueuse/core";

const currentItem = ref<Bucket>();
const shareOpen = ref(false);

function toggleShareModal(item: any) {
  item.open = false;
  currentItem.value = item;
  shareOpen.value = true;
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
</script>
