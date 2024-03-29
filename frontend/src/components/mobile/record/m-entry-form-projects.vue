<template>
  <div class="px-2 py-4">
    <div class="mb-1 px-2 text-neutral-500">Projekte</div>
    <div class="mb-2 flex flex-col gap-2 px-2">
      <div
        v-for="project in projects"
        class="flex items-center justify-between rounded-lg border border-neutral-200 px-2 py-1"
      >
        <div>{{ project.title }}</div>
        <div class="rounded-md p-1 hover:bg-neutral-100" @click="toggleProject(project)">
          <X :size="20" class="stroke-neutral-500" />
        </div>
      </div>
    </div>
    <button
      type="button"
      @click="addProject"
      class="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-neutral-500"
    >
      <Plus :size="18" />
      <div>Projekt hinzufügen</div>
    </button>
    <template v-if="sheetOpen">
      <MSheet @close="sheetOpen = false">
        <div class="p-2 text-sm">
          <d-input v-model="search" type="text" name="search" id="search" placeholder="Search project" />
          <div class="mt-3 flex flex-col gap-2 overflow-scroll pb-4" :style="{ maxHeight: sheetHeight + 'px' }">
            <div
              v-for="project in data?.events.edges"
              class="flex items-center justify-between rounded-lg border border-neutral-200 px-2 py-2"
              @click="toggleProject(project)"
            >
              <div>{{ project?.title }}</div>
              <div class="rounded-md hover:bg-neutral-100">
                <Check v-if="activeProject(project)" :size="20" class="stroke-neutral-500" />
              </div>
            </div>
          </div>
        </div>
      </MSheet>
    </template>
  </div>
</template>

<script lang="ts" setup>
import MSheet from "@/components/mobile/m-sheet.vue"
import DInput from "@/components/d-input/d-input.vue"
import { useVModel, useWindowSize } from "@vueuse/core"
import { Plus, X, Check } from "lucide-vue-next"
import { computed, reactive, ref } from "vue"
import { useDeleteEntryEventInputMutation } from "@/gql/mutations/entries/deleteEntryEvent"
import { useCreateEntryEventMutation } from "@/gql/mutations/entries/createEntryEvent"
import { useMEventsQuery } from "@/gql/queries/events/mEvents"

const { executeMutation: deleteEntryEvent } = useDeleteEntryEventInputMutation()
const { executeMutation: createEntryEvent } = useCreateEntryEventMutation()

const search = ref("")
const sheetOpen = ref(false)

const { height } = useWindowSize()
const sheetHeight = computed(() => height.value - 125)

function addProject() {
  sheetOpen.value = true
}

const props = defineProps<{
  entry: any
  modelValue: any
}>()
const emit = defineEmits(["update:modelValue"])

const projects = useVModel(props, "modelValue", emit)

const { data } = useMEventsQuery({
  variables: reactive({ search })
})

async function toggleProject(project: any) {
  if (projects.value.find((p: any) => p.id === project.id)) {
    await deleteEntryEvent({ input: { entryId: props.entry.id, eventId: project.id } })
  } else {
    await createEntryEvent({ input: { entryId: props.entry.id, eventId: project.id } })
  }
}

function activeProject(project: any) {
  return projects.value.find((p: any) => p.id === project.id)
}
</script>
