<script setup lang="ts">
import { ChevronRight, CircleCheckIcon, CircleIcon, FolderIcon } from "lucide-vue-next"
import type { DCompetence } from "~/types/models"

const emit = defineEmits(["toggle"])

interface Props {
  selected: string[]
}

const props = defineProps<Props>()

const navigationItems = ref<DCompetence[]>([])

const competenceId = computed(() => {
  if (navigationItems.value.length > 0) {
    return navigationItems.value[navigationItems.value.length - 1]?.id
  }
})

const search = ref("")

const { data: competences } = useFetch("/api/competences", {
  params: {
    competenceId: competenceId,
    search: useDebounce(search, 100)
  }
})

const filtered = computed(() => competences.value)

async function onClick(competence: DCompetence) {
  if (competence.competenceType == "competence") {
    return emit("toggle", competence)
  }
  search.value = ""
  navigationItems.value.push(competence)
}

async function navigateTo(competenceId: string | null) {
  if (competenceId === null) {
    navigationItems.value = []
  }

  // find index of the competence in the navigation items
  const index = navigationItems.value.findIndex((c) => c.id === competenceId)

  // remove all the items after the index
  navigationItems.value = navigationItems.value.slice(0, index + 1)
}

function levels(competence: DCompetence) {
  // find first and last level
  const first = competence.grades[0]
  const last = competence.grades[competence.grades.length - 1]

  // if first and last are the same level, return just the level
  if (first === last) return `${first}`

  return `${first} - ${last}`
}

// fill-red-600 fill-orange-600 fill-amber-600 fill-yellow-600 fill-lime-600 fill-green-600 fill-emerald-600 fill-teal-600 fill-cyan-600 fill-sky-600 fill-blue-600 fill-indigo-600 fill-violet-600 fill-purple-600 fill-fuchsia-600 fill-pink-600 fill-rose-600
// stroke-gray-600 stroke-red-600 stroke-orange-600 stroke-amber-600 stroke-yellow-600 stroke-lime-600 stroke-green-600 stroke-emerald-600 stroke-teal-600 stroke-cyan-600 stroke-sky-600 stroke-blue-600 stroke-indigo-600 stroke-violet-600 stroke-purple-600 stroke-fuchsia-600 stroke-pink-600 stroke-rose-600
</script>

<template>
  <div class="flex h-[500px] w-full flex-col">
    <div class="w-full border-b border-neutral-200">
      <input
        type="text"
        name="search"
        id="search"
        class="w-full border-none px-4 py-2 pb-1.5 text-sm outline-none focus:border-neutral-300 focus:ring-0 focus:outline-0"
        placeholder="Suche..."
        v-model="search"
      />
    </div>
    <div v-if="competences" class="flex cursor-default flex-wrap items-center gap-0.5 border-b border-neutral-200 px-3 py-2 text-sm text-neutral-500">
      <div class="rounded-md p-0.5 leading-none hover:bg-neutral-100" @click="navigateTo(null)">Fächer</div>
      <template v-for="item in navigationItems">
        <ChevronRight class="size-4" />
        <div class="rounded-md p-0.5 leading-none hover:bg-neutral-100" @click="navigateTo(item.id)">
          {{ item.name }}
        </div>
      </template>
    </div>
    <div class="flex-1 divide-y divide-neutral-200 overflow-auto">
      <div
        v-for="competence in filtered"
        :key="competence.id"
        class="flex cursor-default items-start justify-between gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
        @click="onClick(competence)"
      >
        <div class="flex items-start gap-1.5">
          <FolderIcon
            v-if="competence.competenceType !== 'competence'"
            class="mt-0.5 size-4"
            :class="
              competence.competenceType === 'subject'
                ? `fill-${competence.color ? competence.color : 'neutral'}-600 stroke-${competence.color ? competence.color : 'gray'}-600`
                : `fill-neutral-600`
            "
          />
          <template v-else>
            <CircleCheckIcon v-if="selected.includes(competence.id)" class="mt-0.5 size-4 text-blue-600" />
            <CircleIcon v-else class="mt-0.5 size-4 text-neutral-400" />
          </template>
          <div class="flex-1">{{ competence.name }}</div>
        </div>
        <div class="cursor-default whitespace-nowrap text-neutral-500">
          {{ levels(competence) }}
        </div>
      </div>
      <div v-show="filtered.length === 0" class="px-4 py-2">
        <div class="text-sm text-neutral-500">Keine Ergebnisse...</div>
      </div>
    </div>
  </div>
</template>
