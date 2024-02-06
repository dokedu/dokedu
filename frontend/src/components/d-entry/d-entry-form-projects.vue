<template>
  <div class="flex gap-4 text-sm">
    <label for="date" class="mt-2 min-w-[64px] text-neutral-500">{{ $t("project", 2) }}</label>

    <div class="flex grow inline-block flex-col gap-4">
      <DComboBox :placeholder="$t('project', 2)" :options="eventOptions" multiple v-model="selected">
      </DComboBox>
      <div v-if="entry.events && entry.events?.length > 0" class="gap-1.5 flex flex-wrap">
        <DTag v-for="event in entry.events" color="gray" removable @remove="removeEvent(event)">
          {{ event.title }}
        </DTag>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRef } from "vue"
import DTag from "../d-tag/d-tag.vue"
import DComboBox, { type Option } from '@/components/d-combobox/d-combobox.vue'
import { useDeleteEntryEventInputMutation } from "@/gql/mutations/entries/deleteEntryEvent"
import { useCreateEntryEventMutation } from "@/gql/mutations/entries/createEntryEvent"
import { useEventsQuery } from "@/gql/queries/events/events"
import type { Entry } from "@/gql/schema"
import type { Event } from "@/gql/schema"

const { executeMutation: deleteEntryEvent } = useDeleteEntryEventInputMutation()
const { executeMutation: createEntryEvent } = useCreateEntryEventMutation()

const props = defineProps<{
  entry: Partial<Entry>
}>()

const entry = toRef(props, "entry")
const eventSearch = ref("")

const { data: eventsData } = useEventsQuery({})

const selected = computed({
  get: () => {
    return entry.value.events?.map((el: any) => {
      return { label: el.title, value: el.id }
    }) || []
  },
  set: async (value: Option[]) => {
    const existing = entry.value.events?.map((el: any) => el.id) || []
    const removables = existing.filter((el) => !value.map((el) => el.value).includes(el))
    const creatables = value.filter((el) => !existing.includes(el.value))

    for (const creatable of creatables || []) {
      await createEntryEvent({ input: { entryId: entry.value.id as string, eventId: creatable.value } })
    }

    for (const removable of removables || []) {
      await deleteEntryEvent({ input: { entryId: entry.value.id as string, eventId: removable } })
    }
  }
})

const filteredEventData = computed(() => {
  const searchValid = eventSearch.value && eventSearch.value !== ""
  if (!searchValid) return eventsData?.value?.events?.edges || []

  return (
    eventsData?.value?.events?.edges?.filter((el: any) =>
      el.title.toLowerCase().includes(eventSearch.value.toLowerCase())
    ) || []
  )
})

async function removeEvent(event: Event) {
  await deleteEntryEvent({ input: { entryId: entry.value.id as string, eventId: event.id } })
}

const eventOptions = computed(
  () =>
    filteredEventData.value.map((edge: any) => ({
      label: edge.title,
      value: edge.id
    })) || []
)
</script>
