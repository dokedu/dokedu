<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="font-medium text-strong">Tags</div>
      <div class="flex gap-2">
        <DButton @click="toggleCreateDialog()" type="primary" size="md" :icon-left="Plus">New</DButton>
      </div>
    </PageHeader>
    <div class="flex flex-col overflow-scroll">
      <div
        @click="toggleEditDialog(tag)"
        v-for="tag in data?.tags"
        class="flex border-b border-stone-100 text-sm text-strong transition-all hover:bg-stone-50"
      >
        <div class="w-full p-2 pl-8">
          <DTag :color="tag.color" class="w-1/4 p-2">{{ tag.name }}</DTag>
        </div>
      </div>
    </div>

    <TagCreateDialog :open="createOpen" @close="createOpen = false" @created="onTagCreate()" />
    <TagEditDialog :open="editOpen" :tag="currentTag" @close="editOpen = false" @updated="onTagUpdate()" />
  </PageWrapper>
</template>
<script setup lang="ts">
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import { useQuery } from "@urql/vue";
import DButton from "../../../components/d-button/d-button.vue";
import { Plus } from "lucide-vue-next";
import DTag from "../../../components/d-tag/d-tag.vue";
import TagCreateDialog from "./TagCreateDialog.vue";
import TagEditDialog from "./TagEditDialog.vue";
import { ref } from "vue";
import { graphql } from "../../../gql";
import { Tag } from "../../../gql/graphql";

const createOpen = ref(false);
const editOpen = ref(false);
const currentTag = ref();

const toggleCreateDialog = () => {
  createOpen.value = !createOpen.value;
};

const toggleEditDialog = (tag: Tag) => {
  currentTag.value = tag;
  editOpen.value = true;
};

const { data, executeQuery: refreshTags } = useQuery({
  query: graphql(`
    query getTagWithLimit {
      tags(limit: 100) {
        id
        name
        color
        deletedAt
        createdAt
      }
    }
  `),
});

const onTagCreate = () => {
  createOpen.value = false;
  refreshTags();
};

const onTagUpdate = () => {
  editOpen.value = false;
  refreshTags();
};
</script>
