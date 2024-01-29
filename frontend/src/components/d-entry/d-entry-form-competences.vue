<template>
  <div class="px-8 text-sm">
    <div>
      <header class="mb-2 flex items-center justify-between">
        <div class="text-neutral-500">{{ $t("competence", 2) }}</div>
        <d-button @click="dialogOpen = true" size="xs" type="transparent" :icon-left="Plus">
          {{ $t("add_competence") }}
        </d-button>
      </header>
      <div class="mb-2 flex flex-col gap-2">
        <d-competence v-for="competence in competences" :key="competence.id" :competence="competence">
          <d-competence-level
            :id="competence.id"
            :level="competence.level"
            :editable="true"
            @update="updateCompetenceLevel"
          />
          <div class="rounded-md p-1 hover:bg-neutral-100" @click="toggleCompetence(competence)">
            <X :size="20" class="stroke-neutral-500" />
          </div>
        </d-competence>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <div
      v-if="dialogOpen"
      ref="dialog"
      class="absolute right-0 top-0 h-screen w-full max-w-xl bg-white shadow-lg backdrop:bg-neutral-950/20"
    >
      <div class="flex h-full flex-col p-4">
        <d-competence-search :selected="competences" @add="toggleCompetence" />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Plus, X } from "lucide-vue-next"
import { computed, ref, toRef } from "vue"
import { onClickOutside } from "@vueuse/core"
import { onKeyStroke } from "@vueuse/core"
import DCompetenceLevel from "@/components/d-competence/d-competence-level.vue"
import DCompetence from "@/components/d-competence/d-competence.vue"
import DCompetenceSearch from "@/components/d-competence-search/d-competence-search.vue"
import DButton from "../d-button/d-button.vue"
import { useDeleteEntryCompetenceInputMutation } from "@/gql/mutations/entries/deleteEntryCompetence"
import { useCreateEntryCompetenceMutation } from "@/gql/mutations/entries/createEntryCompetence"
import { useUpdateEntryUserCompetenceLevelMutation } from "@/gql/mutations/entries/updateEntryUserCompetence"
import type { Competence, Entry } from "@/gql/schema"

const { executeMutation: deleteEntryCompetence } = useDeleteEntryCompetenceInputMutation()
const { executeMutation: createEntryCompetence } = useCreateEntryCompetenceMutation()
const { executeMutation: updateEntryUserCompetenceLevel } = useUpdateEntryUserCompetenceLevelMutation()

const dialog = ref(null)
const dialogOpen = ref(false)
const parents = ref<Competence[]>([])

// on keystroke escape close dialog
onKeyStroke("Escape", () => {
  dialogOpen.value = false
})

onClickOutside(dialog, () => {
  dialogOpen.value = false
})

const props = defineProps<{ entry: Partial<Entry> }>()

const entry = toRef(props, "entry")

async function updateCompetenceLevel(data: { id: string; level: number }) {
  await updateEntryUserCompetenceLevel({
    input: { entryId: entry.value.id as string, competenceId: data.id, level: data.level }
  })
}

const competences = computed(() => {
  const items = entry.value.userCompetences?.map((eac) => ({ ...eac.competence, level: eac.level })) || []
  // return unique items by item.id
  return items.filter((item, index, self) => self.findIndex((t) => t.id === item.id) === index)
})

defineEmits(["toggle"])

function toggleCompetence(competence: { id: string; type: string }) {
  if (competence.type === "subject" || competence.type === "group") {
    // @ts-expect-error
    parents.value = [...parents.value, competence]
  }

  // @ts-expect-error
  emitToggleCompetence(competence)
}

async function emitToggleCompetence(competence: Competence) {
  if (competence.type !== "competence") return

  // create new competence and add it to entry.userCompetences if it doesn't exist
  if (!entry.value.userCompetences?.map((el) => el.competence.id).includes(competence.id)) {
    // if entry.users does not have any users, alert user to add users first
    if (entry.value.users?.length === 0) {
      alert("Bitte füge zuerst Schüler*innen hinzu.")
      return
    }
    await createEntryCompetence({ input: { entryId: entry.value.id as string, competenceId: competence.id } })
  } else {
    await deleteEntryCompetence({ input: { entryId: entry.value.id as string, competenceId: competence.id } })
  }
}
</script>
