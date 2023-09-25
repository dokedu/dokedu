<template>
  <div class="flex gap-4 text-sm">
    <label for="date" class="mt-2 min-w-[64px] text-neutral-500">{{ $t("label", 2) }}</label>

    <div class="flex w-full flex-col gap-4">
      <DSelect
        :options="eventOptions"
        :label="$t('label', 2)"
        multiple
        v-model="selected"
        v-model:search="eventSearch"
        searchable
        class="w-full"
      >
        <template v-slot="{ option }">
          <d-tag color="stone">
            {{ option.label }}
          </d-tag>
        </template>
      </DSelect>

      <div class="flex flex-wrap gap-1.5">
        <d-tag v-for="event in entry.events" color="gray" removable @remove="removeEvent(event)">
          {{ event.title }}
        </d-tag>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRef } from "vue";
import { Entry, Event } from "@/gql/graphql";
import { useQuery } from "@urql/vue";
import DTag from "../d-tag/d-tag.vue";
import eventQuery from "@/queries/events";
import DSelect from "@/components/d-select/d-select.vue";

const props = defineProps<{
  entry: Partial<Entry>;
}>();

const entry = toRef(props, "entry");

const eventSearch = ref("");

const { data: eventsData } = useQuery({
  query: eventQuery,
});

const selected = computed({
  get: () => {
    return entry.value.events?.map((el: any) => el.id) || [];
  },
  set: (value: string[]) => {
    entry.value.events = eventsData.value.events.edges.filter((el: any) => value.includes(el.id));
  },
});

const filteredEventData = computed(() => {
  const searchValid = eventSearch.value && eventSearch.value !== "";
  if (!searchValid) return eventsData?.value?.events?.edges || [];

  return (
    eventsData?.value?.events?.edges?.filter((el: any) =>
      el.title.toLowerCase().includes(eventSearch.value.toLowerCase())
    ) || []
  );
});

function removeEvent(event: Event) {
  entry.value.events = entry.value.events?.filter((el: any) => el.id !== event.id);
}

const eventOptions = computed(
  () =>
    filteredEventData.value.map((edge: any) => ({
      label: edge.title,
      value: edge.id,
    })) || []
);
</script>
