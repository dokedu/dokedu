<template>
  <PageWrapper>
    <PageHeader>
      <div class="flex w-full items-center justify-between">
        <div>Shared drives</div>
        <DButton type="primary" size="md" :icon-left="Plus" @click="newSharedDrive">New</DButton>
      </div>
    </PageHeader>
    <PageContent>
      <DTable
        v-model:variables="pageVariables"
        :columns="columns"
        object-name="buckets"
        :query="sharedDrivesQuery"
        defaultSort="createdAt"
      >
        <template #name-data="{ column }">
          <div class="flex items-center gap-3">
            <Folder :size="18" class="fill-stone-700 stroke-colors-default" />
            <div class="text-default">{{ column }}</div>
          </div>
        </template>
        <template #id-data="{ item }">
          <div>
            <div class="flex w-[80px] justify-end gap-1 pr-4">
              <div class="group/icon w-fit rounded-lg p-1.5 hover:bg-blue-100" @click.stop="openDeleteFileDialog(item)">
                <MoreVertical class="stroke-colors-subtle group-hover/icon:stroke-blue-900" :size="16" />
              </div>
            </div>
          </div>
        </template>
        <template #empty>No shared drives found.</template>
      </DTable>
    </PageContent>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from "@/components/PageWrapper.vue";
import PageHeader from "@/components/PageHeader.vue";
import PageContent from "@/components/PageContent.vue";
import DTable from "@/components/d-table/d-table.vue";
import DButton from "@/components/d-button/d-button.vue";
import { PageVariables } from "@/types/types";
import { ref } from "vue";
import { Plus, Folder, MoreVertical } from "lucide-vue-next";

function newSharedDrive() {
  alert("new shared drive");
}

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

const sharedDrivesQuery = `
query buckets {
  buckets(input: {shared: true}) {
    edges {
      id
      name
      shared
      createdAt
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
`;
</script>
