<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="font-medium text-strong">{{ $t("tag", 2) }}</div>
      <div class="flex gap-2">
        <DButton @click="toggleCreateDialog()" type="primary" size="md" :icon-left="Plus">{{ $t("new") }}</DButton>
      </div>
    </PageHeader>
    <DTable
      :query="TagsQuery"
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
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import DButton from "../../../components/d-button/d-button.vue";
import { Plus } from "lucide-vue-next";
import DTag from "../../../components/d-tag/d-tag.vue";
import TagCreateDialog from "./TagCreateDialog.vue";
import TagEditDialog from "./TagEditDialog.vue";
import { ref } from "vue";
import { graphql } from "../../../gql";
import DTable from "@/components/d-table/d-table.vue";
import { PageVariables } from "@/types/types";

const createOpen = ref(false);
const editOpen = ref(false);
const currentTag = ref();

const toggleCreateDialog = () => {
  createOpen.value = !createOpen.value;
};

const toggleEditDialog = <Type>(tag: Type) => {
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

const TagsQuery = graphql(`
  query getTagWithLimit($limit: Int, $offset: Int) {
    tags(limit: $limit, offset: $offset) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        id
        name
        color
        deletedAt
        createdAt
      }
    }
  }
`);

const onTagCreate = () => {
  createOpen.value = false;
};

const onTagUpdate = () => {
  editOpen.value = false;
};
</script>
