<template>
  <div class="flex h-full justify-between">
    <div class="flex h-full max-h-full w-full flex-col">
      <EntryFormHeader @archive="archive" />
      <div class="mx-auto h-full w-full max-w-4xl overflow-scroll pb-8">
        <div>
          <textarea
            ref="textarea"
            v-model="body"
            :placeholder="$t('entry_create_placeholder')"
            class="block w-full resize-none border-none border-transparent p-8 text-base text-neutral-900 placeholder:text-neutral-400 focus:ring-0"
          />
        </div>
        <EntryFormCompetences :entry="entry" />
      </div>
    </div>
    <div
      class="flex min-h-full w-[400px] min-w-[400px] flex-col gap-4 overflow-auto border-l border-neutral-100 px-8 py-4"
    >
      <div class="flex items-center gap-4">
        <label for="date" class="min-w-[64px] text-sm text-neutral-500">{{ $t("date") }}</label>
        <input
          v-model="formattedDate"
          type="date"
          name="date"
          id="date"
          class="rounded-lg border border-neutral-200 shadow-sm focus:!outline-none w-full text-sm transition-all hover:bg-neutral-100 focus:bg-neutral-100 focus:ring-2 focus:ring-neutral-950"
        />
      </div>
      <EntryFormProjects :entry="entry" />
      <EntryFormLabels :entry="entry" />
      <EntryFormStudents :entry="entry" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue"
import { formatDate, useTextareaAutosize, watchDebounced } from "@vueuse/core"
import EntryFormHeader from "./d-entry-form-header.vue"
import EntryFormCompetences from "./d-entry-form-competences.vue"
import EntryFormProjects from "./d-entry-form-projects.vue"
import EntryFormLabels from "./d-entry-form-labels.vue"
import EntryFormStudents from "./d-entry-form-students.vue"
import { useArchiveEntryMutation } from "@/gql/mutations/entries/archiveEntry"
import { useUpdateEntryMutation } from "@/gql/mutations/entries/updateEntry"
import type { Entry } from "@/gql/schema"

const { executeMutation: archiveEntryMut } = useArchiveEntryMutation()
const { executeMutation: updateEntry } = useUpdateEntryMutation()

const props = defineProps<{
  entry: Partial<Entry>
}>()

const emit = defineEmits(["archived"])

const entry = toRef(props, "entry")

const { textarea, input: body } = useTextareaAutosize({ input: entry.value.body as string })

watchDebounced(
  body,
  async (value) => {
    await updateEntry({ input: { id: entry.value.id as string, body: value } })
  },
  { debounce: 250, maxWait: 1000 }
)

const formattedDate = computed({
  get() {
    const date = new Date(entry.value.date as string)
    return formatDate(date, "YYYY-MM-DD")
  },
  async set(value: string) {
    await updateEntry({ input: { id: entry.value.id as string, date: value } })
  }
})

async function archive() {
  await archiveEntryMut({ id: entry.value.id })
  emit("archived")
}
</script>
