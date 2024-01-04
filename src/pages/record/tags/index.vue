<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="font-medium text-strong">{{ $t("tag", 2) }}</div>
      <div class="flex gap-2">
        <DButton @click="toggleCreateDialog()" type="primary" size="md" :icon-left="Plus">{{ $t("new") }}</DButton>
      </div>
    </PageHeader>
    <DTable
      :query="GetTagWithLimitDocument"
      objectName="tags"
      @row-click="toggleEditDialog"
      :columns="columns"
      v-model:variables="pageVariables"
      hideHeader
    >
      <template #name-data="{ item }">
        <DTag :color="item.color">{{ item.name }}</DTag>
      </template>
    </DTable>

    <TagCreateDialog :open="createOpen" @close="createOpen = false" @created="onTagCreate()" />
    <TagEditDialog :open="editOpen" :tag="currentTag" @close="editOpen = false" @updated="onTagUpdate()" />
  </PageWrapper>
</template>

<script setup lang="ts">
import PageHeader from "../../../components/page-header.vue";
import PageWrapper from "../../../components/page-wrapper.vue";
import DButton from "../../../components/d-button/d-button.vue";
import { Plus } from "lucide-vue-next";
import DTag from "../../../components/d-tag/d-tag.vue";
import TagCreateDialog from "@/components/d-tag-create-dialog.vue";
import TagEditDialog from "@/components/d-tag-edit-dialog.vue";
import { ref } from "vue";
import DTable from "@/components/d-table/d-table.vue";
import type { PageVariables } from "@/types/types.ts";
import { GetTagWithLimitDocument } from "@/gql/queries/tags/getTagWithLimit.ts";

const createOpen = ref(false);
const editOpen = ref(false);
const currentTag = ref();

function toggleCreateDialog() {
  createOpen.value = !createOpen.value;
}

const toggleEditDialog = <Type,>(tag: Type) => {
  currentTag.value = tag;
  editOpen.value = true;
};

const columns = [
  {
    key: "name",
    label: "name",
  },
];

const pageVariables = ref<PageVariables[]>([
  {
    limit: 50,
    offset: 0,
  },
]);

function onTagCreate() {
  createOpen.value = false;
}

function onTagUpdate() {
  editOpen.value = false;
}
</script>
