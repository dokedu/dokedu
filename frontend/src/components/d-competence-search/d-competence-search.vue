<template>
  <div class="flex h-full w-full select-none flex-col gap-4 text-sm">
    <div v-show="!createCompetenceDialog" class="flex h-full w-full select-none flex-col gap-4 text-sm">
      <header class="flex min-h-0 w-full flex-col gap-1">
        <input
          v-model="search"
          class="block text-sm w-full rounded-md border-0 py-2.5 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-900"
          type="text"
          autocomplete="off"
          :placeholder="$t('search_competences')"
        />
        <div class="flex flex-wrap gap-0.5 mt-1 px-1 pt-1 text-subtle items-center">
          <div class="px-1 py-0.5 rounded-md hover:bg-neutral-100" @click="parentId = null">Fächer</div>
          <template v-for="parent in parentPath">
            <ChevronRight :size="16" />
            <div class="px-1 py-0.5 rounded-md hover:bg-neutral-100" @click="parentId = parent.id">
              {{ parent.name }}
            </div>
          </template>
        </div>
      </header>

      <div class="flex h-full flex-col overflow-scroll p-0.5 divide-y divide-neutral-200">
        <div v-for="competence in competences" :key="competence?.id" class="py-1">
          <d-competence
            :competence="competence as Competence"
            @click="onClick(competence)"
            :class="[
              selected.some((s) => s.id === competence?.id)
                ? 'bg-blue-50 border !border-blue-300 shadow-sm shadow-blue-200 hover:bg-blue-50 transition-all'
                : 'border border-transparent hover:bg-neutral-100 transition-all'
            ]"
          />
        </div>

        <div v-if="competences.length === 0">
          <div class="flex h-full items-center justify-center text-neutral-500">No competences found</div>
        </div>
      </div>

      <hr />

      <div class="flex justify-between items-center">
        <div class="text-neutral-700 hidden md:block">Nicht gefunden wonach du suchst?</div>
        <div
          @click="createCompetenceDialog = true"
          class="focus-visible:outline focus-visible:outline-2 w-full md:w-fit focus-visible:outline-offset-2 focus-visible:outline-neutral-950 transition-color group relative inline-flex h-fit select-none items-center justify-center gap-2 overflow-hidden rounded-lg border shadow-sm border-neutral-200 text-neutral-700 hover:bg-neutral-100 px-2.5 py-2 text-sm"
        >
          <PlusIcon :size="16" />
          <div>Eigene Kompetenz erstellen</div>
        </div>
      </div>
    </div>

    <DCreateCompetence
      v-if="createCompetenceDialog"
      @created="onClick"
      @close="() => (createCompetenceDialog = false)"
    />
  </div>
</template>

<script lang="ts" setup>
import DCompetence from "@/components/d-competence/d-competence.vue"
import { computed, reactive, ref } from "vue"
import { ChevronRight, PlusIcon } from "lucide-vue-next"
import DCreateCompetence from "@/components/d-competence-search/d-create-competence.vue"
import { useCompetenceSearchQuery } from "@/gql/queries/competences/competenceSearch"
import { useCompetencePathQuery } from "@/gql/queries/competences/competencePath"
import type { Competence } from "@/gql/schema"

defineProps({
  selected: {
    type: Array as () => { id: string }[],
    default: () => []
  }
})

const createCompetenceDialog = ref(false)

const search = ref("")
const parentId = ref<string | null>(null)
const parents = computed(() => {
  if (!parentId.value) return []
  return [parentId.value]
})

const filter = computed<any>(() => {
  const searchLength = search.value.length
  const hasParent = !!parentId.value
  if (!hasParent && searchLength === 0) return { type: "subject" }
  if (!hasParent && searchLength > 0) return { type: ["competence", "group"] }
  return { parents: parents.value }
})

const { data: competenceData } = useCompetenceSearchQuery({
  variables: reactive({
    search: search,
    filter: filter
  })
})

const { data: parentData } = useCompetencePathQuery({
  variables: reactive({
    id: parentId as unknown as string
  }),
  pause: !parentId
})

const parentPath = computed(() => {
  if (!parentId.value) return []
  if (!parentData.value?.competence?.parents) return []
  return [...parentData.value.competence.parents, parentData.value.competence]
})

const competences = computed(() => {
  if (!competenceData.value?.competences?.edges) return []
  return competenceData.value.competences.edges
})

const emit = defineEmits(["add"])

function onClick(competence: any) {
  if (competence.type !== "competence") {
    parentId.value = competence.id
  } else {
    emit("add", competence)
  }
}
</script>
