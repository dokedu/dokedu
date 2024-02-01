<template>
  <div class="flex-1 divide-y divide-neutral-200 overflow-scroll text-sm">
    <textarea
      ref="textarea"
      v-model="body"
      name="description"
      id="description"
      class="min-h-[10em] w-full resize-none border-none p-4 text-neutral-950 placeholder:text-neutral-400 focus:ring-0"
      placeholder="Beschreibung..."
    />
    <MEntryFormCompetences :entry="entry" v-model="entry" />
    <MEntryFormProjects :entry="entry" v-model="entry.events" />
    <MEntryFormTags :entry="entry" v-model="entry.tags" />
    <MEntryFormStudents :entry="entry" v-model="entry.users" />
    <MEntryFormDate v-model="entry.date" />
    <div class="py-4">
      <DEntryFormFiles :entry="entry" />
    </div>
  </div>
</template>

<script setup lang="ts">
import MEntryFormProjects from "@/components/mobile/record/m-entry-form-projects.vue"
import MEntryFormStudents from "@/components/mobile/record/m-entry-form-students.vue"
import MEntryFormTags from "@/components/mobile/record/m-entry-form-tags.vue"
import MEntryFormCompetences from "@/components/mobile/record/m-entry-form-competences.vue"
import MEntryFormDate from "@/components/mobile/record/m-entry-form-date.vue"
import { useTextareaAutosize, useVModel, watchDebounced } from "@vueuse/core"
import { useUpdateEntryMutation } from "@/gql/mutations/entries/updateEntry"
import DEntryFormFiles from "../d-entry/d-entry-form-files.vue"

const { executeMutation: updateEntry } = useUpdateEntryMutation()

const props = defineProps<{
  modelValue: any
}>()
const emit = defineEmits(["update:modelValue"])

const entry = useVModel(props, "modelValue", emit)

const { textarea, input: body } = useTextareaAutosize({
  input: entry.value.body as string
})

watchDebounced(
  body,
  async (value: string) => {
    await updateEntry({ input: { id: entry.value.id as string, body: value } })
  },
  { debounce: 250, maxWait: 1000 }
)

watchDebounced(
  () => entry.value.date,
  async (value: string) => {
    await updateEntry({ input: { id: entry.value.id as string, date: value } })
  }
)
</script>
