<template>
  <div class="flex items-center gap-2">
    <div class="w-20 text-sm font-medium text-strong">Tags</div>
    <div class="w-full">
      <DContextMenu
        :show="contextMenuOpen"
        @close="contextMenuOpen = false"
        :alignment="ContextMenuAlignment.Overlay"
        class="max-h-[150px] overflow-y-auto p-1"
      >
        <div class="flex w-full flex-col items-start rounded-md">
          <div
            @click="toggleTag(tag)"
            v-for="tag in data?.tags"
            :key="tag.id"
            class="flex w-full cursor-pointer items-center justify-between p-1 hover:bg-stone-100"
          >
            <DTag :color="tag.color">{{ tag.name }}</DTag>
            <Check
              v-show="selectedTags?.length > 0 && selectedTags.map((el) => el.id).includes(tag.id)"
              class="h-4 w-4"
            ></Check>
          </div>
        </div>
      </DContextMenu>
      <div
        class="flex w-full flex-wrap items-start gap-2 rounded-md p-2 hover:bg-stone-50"
        @click="contextMenuOpen = true"
      >
        <div v-if="selectedTags?.length > 0" class="flex flex-wrap gap-2 text-sm text-strong">
          <DTag v-for="tag in selectedTags" :key="tag.id" :color="tag.color">{{ tag.name }}</DTag>
        </div>
        <div v-else class="text-sm text-subtle">Select tags</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useQuery } from "@urql/vue";
import { graphql } from "@/gql";
import DContextMenu from "@/components/d-context-menu/d-context-menu.vue";
import { ContextMenuAlignment } from "@/components/d-context-menu/d-context-menu.vue";
import { ref } from "vue";
import { Check } from "lucide-vue-next";
import { Tag } from "@/gql/graphql";
import DTag from "@/components/d-tag/d-tag.vue";

const emit = defineEmits(["update"]);

const contextMenuOpen = ref(false);
const selectedTags = ref<Tag[]>([]);

const { data } = useQuery({
  query: graphql(`
    query GetTags {
      tags {
        id
        name
        color
        deletedAt
        createdAt
      }
    }
  `),
});

const toggleTag = (tag: Tag) => {
  if (selectedTags.value?.find((t) => t.id === tag.id)) {
    selectedTags.value = selectedTags.value?.filter((t) => t.id !== tag.id);
  } else {
    selectedTags.value = [...(selectedTags.value ?? []), tag];
  }

  emit("update", selectedTags.value);
};
</script>
