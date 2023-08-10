<template>
  <div class="flex gap-4 text-sm">
    <label for="date" class="mt-2 min-w-[64px] text-stone-500">{{ $t("project", 2) }}</label>
    <div class="w-full">
      <d-context-menu :show="contextMenu" @close="contextMenu = false" :alignment="ContextMenuAlignment.Overlay">
        <div v-if="events" class="flex flex-col gap-1 px-1 py-2">
          <div
            v-for="event in (events.events.edges as Event[])"
            :key="event.id"
            @click="toggleEvent(event)"
            class="flex w-full items-center justify-between rounded-md p-1 hover:bg-stone-100"
          >
            <div class="px-1 py-0.5 text-stone-700">{{ event.title }}</div>
            <svg
              v-show="hasProject(event as Event)"
              class="stroke-stone-700"
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
      <div class="flex w-full flex-wrap items-start gap-2 rounded-md p-2 hover:bg-stone-50" @click="contextMenu = true">
        <div v-for="event in entry?.events" class="rounded-full border px-3 py-1 text-stone-700">
          {{ event.title }}
        </div>
        <div v-if="entry.events?.length === 0 || entry.events === undefined" class="text-stone-400">
          {{ $t("add_project") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRef } from "vue";
import DContextMenu, { ContextMenuAlignment } from "@/components/d-context-menu/d-context-menu.vue";
import { Entry, Event } from "@/gql/graphql";
import { useQuery } from "@urql/vue";
import { graphql } from "@/gql";

const props = defineProps<{
  entry: Partial<Entry>;
}>();

const entry = toRef(props, "entry");
const contextMenu = ref(false);

function hasProject(event: Event) {
  return entry.value.events?.map((el) => el.id).includes(event.id);
}

const { data: events } = useQuery({
  query: graphql(`
    query events {
      events {
        edges {
          id
          title
        }
      }
    }
  `),
});

function toggleEvent(event: Event) {
  // if entry.events is undefined, create empty array
  if (!entry.value.events) {
    entry.value.events = [];
  }

  // create new event and add it to entry.events if it doesn't exist
  if (!entry.value.events.map((el) => el.id).includes(event.id)) {
    entry.value.events.push(event);
  } else {
    // remove event from entry.events if it exists
    entry.value.events = entry.value.events.filter((el) => el.id !== event.id);
  }
}
</script>
