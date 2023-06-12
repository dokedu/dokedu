<template>
  <div class="flex gap-4">
    <label for="date" class="mt-2 min-w-[64px] text-stone-500">Labels</label>
    <div class="w-full">
      <d-context-menu :show="contextMenu" @close="contextMenu = false" :alignment="ContextMenuAlignment.Overlay">
        <div class="flex flex-col gap-1 px-1 py-2">
          <div v-for="tag in tags?.tags" :key="tag.id" @click="toggleTag(tag)"
            class="flex w-full items-center justify-between rounded-md p-1 hover:bg-stone-100">
            <d-tag :color="tag.color">
              {{ tag.name }}
            </d-tag>
            <svg v-show="entry?.tags?.length > 0 && entry?.tags.map((el) => el.id).includes(tag.id)"
              class="stroke-stone-700" width="24" height="24" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M17.3327 8L9.99935 15.3333L6.66602 12" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </d-context-menu>
      <div class="flex w-full flex-wrap items-start gap-2 rounded-md p-2 hover:bg-stone-50" @click="contextMenu = true">
        <d-tag v-for="tag in entry.tags" :key="tag.id" :color="tag.color">
          {{ tag.name }}
        </d-tag>
        <div v-if="entry.tags?.length === 0" class="text-stone-400">Add label</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRef } from 'vue';
import DContextMenu, { ContextMenuAlignment } from "../../../components/d-context-menu/d-context-menu.vue";
import { Entry, Tag } from '../../../gql/graphql';
import { useQuery } from '@urql/vue';
import DTag from '../../../components/d-tag/d-tag.vue';
import tagQuery from "../../../queries/tags";

const props = defineProps<{
  entry: Partial<Entry>;
}>();

const entry = toRef(props, "entry");
const contextMenu = ref(false);

const { data: tags } = useQuery({
  query: tagQuery,
});

function toggleTag(tag: Tag) {
  // if entry.tags is undefined, create empty array
  if (!entry.value.tags) {
    entry.value.tags = [];
  }

  // create new tag and add it to entry.tags if it doesn't exist
  if (!entry.value.tags.map((el) => el.id).includes(tag.id)) {
    entry.value.tags.push(tag);
  } else {
    // remove tag from entry.tags if it exists
    entry.value.tags = entry.value.tags.filter((el) => el.id !== tag.id);
  }
}

</script>