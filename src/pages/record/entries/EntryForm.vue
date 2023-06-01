<template>
  <div class="flex h-full justify-between">
    <div class="w-full">
      <div class="flex justify-between border-b px-8 py-4">
        <div>
          <button
            type="button"
            class="rounded-md px-4 py-1 text-gray-500 outline-0 transition-all hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Cancel
          </button>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-md bg-red-50 px-4 py-1 text-red-500 outline-0 transition-all hover:bg-red-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            @click="archive"
          >
            Archive
          </button>
          <button
            type="button"
            class="rounded-md bg-gray-950 px-4 py-1 text-white outline-0 transition-all hover:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            @click="onSubmit"
          >
            {{ mode === "new" ? "Create" : "Save" }}
          </button>
        </div>
      </div>
      <textarea
        v-model="entry.body"
        placeholder="Write down your observations..."
        class="block w-full resize-none border-none border-transparent p-8 text-lg text-gray-900 placeholder:text-gray-400 focus:ring-0"
      />
    </div>
    <div class="flex min-h-full w-[400px] min-w-[400px] flex-col gap-4 border-l px-8 py-4">
      <div class="flex items-center gap-4">
        <label for="date" class="text-gray-500">Datum</label>
        <input
          v-model="formattedDate"
          type="date"
          name="date"
          id="date"
          class="w-full rounded-md border-none transition-all hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-black"
        />
      </div>
      <div class="flex gap-4">
        <label for="date" class="mt-2 text-gray-500">Projects</label>
      </div>
      <div class="flex gap-4">
        <label for="date" class="mt-2 text-gray-500">Labels</label>
        <div class="w-full">
          <d-context-menu
            :show="tagsContextMenuOpen"
            @close="tagsContextMenuOpen = false"
            :alignment="ContextMenuAlignment.Overlay"
          >
            <div class="flex flex-col gap-1 px-1 py-2">
              <div
                v-for="tag in tags?.tags"
                :key="tag.id"
                @click="toggleTag(tag)"
                class="flex w-full items-center justify-between rounded-md p-1 hover:bg-gray-100"
              >
                <d-tag :color="tag.color">
                  {{ tag.name }}
                </d-tag>
                <svg
                  v-show="entry?.tags?.length > 0 && entry?.tags.map((el) => el.id).includes(tag.id)"
                  class="stroke-gray-700"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.3327 8L9.99935 15.3333L6.66602 12"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </d-context-menu>
          <div
            class="flex min-h-[50px] w-full cursor-default flex-wrap items-start gap-2 rounded-md p-2 hover:bg-gray-50"
            @click="tagsContextMenuOpen = true"
          >
            <d-tag v-for="tag in entry.tags" :key="tag.id" :color="tag.color">
              {{ tag.name }}
            </d-tag>
            <div v-if="entry.tags?.length === 0" class="text-gray-500">Add label</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import DTag from "../../../components/d-tag/d-tag.vue";
import DContextMenu, { ContextMenuAlignment } from "../../../components/d-context-menu/d-context-menu.vue";
import { gql, useMutation, useQuery } from "@urql/vue";
import tagQuery from "../../../queries/tags";
import { computed, ref, toRef } from "vue";
import archiveEntryMutation from "../../../queries/archiveEntry.mutation.ts";
import { formatDate } from "@vueuse/core";

interface Tag {
  id: string;
  name: string;
  color: string;
}
interface Entry {
  id: string;
  date: string;
  body: string;
  createdAt: string;
  tags: Tag[];
}

const props = defineProps<{
  entry: Entry;
  mode: "new" | "edit";
}>();

const { data: tags } = useQuery({
  query: tagQuery,
});

const entry = toRef(props, "entry");
const tagsContextMenuOpen = ref(false);

const { executeMutation: archiveEntryMut } = useMutation(archiveEntryMutation);

function toggleTag(tag: Tag) {
  // if entry.entryTags is undefined, create empty array
  if (!entry.value.tags) {
    entry.value.tags = [];
  }

  // create new entryTag and add it to entry.entryTags if it doesn't exist
  if (!entry.value.tags.map((el) => el.id).includes(tag.id)) {
    entry.value.tags.push(tag);
  } else {
    // remove entryTag from entry.entryTags if it exists
    entry.value.tags = entry.value.tags.filter((el) => el.id !== tag.id);
  }
}

const { executeMutation: createEntry } = useMutation(gql`
  mutation createEntry($input: CreateEntryInput!) {
    createEntry(input: $input) {
      id
      date
      body
      createdAt
    }
  }
`);

const { executeMutation: updateEntry } = useMutation(gql`
  mutation updateEntry($input: UpdateEntryInput!) {
    updateEntry(input: $input) {
      id
      date
      body
      createdAt
      tags {
        id
        name
        color
      }
    }
  }
`);

const formattedDate = computed({
  get() {
    const date = new Date(entry.value.date);
    return formatDate(date, "YYYY-MM-DD");
  },
  set(value: string) {
    entry.value.date = value;
  },
});

async function archive() {
  await archiveEntryMut({ id: entry.value.id });
  await emit("archived");
}

// emits
const emit = defineEmits(["saved", "archived"]);

async function onSubmit() {
  const input: any = {
    date: entry.value.date,
    body: entry.value.body,
    tags: entry.value.tags.map((el) => el.id),
  };

  if (props.mode === "edit") {
    input["id"] = entry.value.id;
    await updateEntry({ input });
    emit("saved");
    return;
  }

  const { data } = await createEntry({ input });
  // TODO: handle error

  // emit saved event
  emit("saved", data?.createEntry);
}
</script>
