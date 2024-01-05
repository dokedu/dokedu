<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-neutral-950">{{ $t("competence", 2) }}</div>
        <input v-model="search" type="text" name="search" id="search" :placeholder="$t('search')"
          class="h-8 rounded-md border border-neutral-100 text-sm text-strong outline-none ring-0 transition-all placeholder:text-subtle focus:border-neutral-200 focus:shadow-sm focus:ring-0" />
      </div>
    </PageHeader>
    <DTable :columns="columns" :query="CompetenceSubjectsDocument" v-model:variables="pageVariables"
      objectName="competences" hideHeader :watchers="[search]" :search="search" @row-click="goToCompetence">
      <template #name-data="{ item }">
        <Folder v-if="item.type !== 'competence'" :size="16" class="fill-neutral-700 stroke-neutral-700" />
        <DTag :color="item.color">{{ item.name }}</DTag>
      </template>
      <template #grade-data="{ item }">
        <div class="flex w-full items-center justify-end gap-2 text-right">
          <div class="rounded-lg p-1 hover:bg-neutral-200" @click.stop="editCompetence(item)">
            <Edit2 :size="16" class="stroke-neutral-700" />
          </div>
          <div>
            {{ grades(item) }}
          </div>
        </div>
      </template>
    </DTable>
  </PageWrapper>
  <router-view />
  <div v-if="competence">
    <DCompetenceEditDialog :competence="competence" @close="competence = null" />
  </div>
</template>

<script setup lang="ts">
import PageHeader from "@/components/page-header.vue"
import PageWrapper from "@/components/page-wrapper.vue"
import { ref } from "vue"
import { Edit2, Folder } from "lucide-vue-next"
import DCompetenceEditDialog from "@/components/d-competence/d-competence-edit-dialog.vue"
import DTag from "@/components/d-tag/d-tag.vue"
import DTable from "@/components/d-table/d-table.vue"
import { useRouter } from "vue-router/auto"
import { watchDebounced } from "@vueuse/core"
import type { PageVariables } from "@/types/types"
import type { Competence } from "@/gql/schema"
import { CompetenceSubjectsDocument } from "@/gql/queries/competences/competenceSubjects"

const search = ref("")
const competence = ref<Competence | null>(null)
const router = useRouter()

const pageVariables = ref<PageVariables[]>([
  {
    limit: 100,
    offset: 0,
    search: "",
    nextPage: undefined
  }
])

watchDebounced(
  search,
  () => {
    pageVariables.value = [
      {
        search: search.value,
        limit: 100,
        offset: 0,
        nextPage: undefined
      }
    ]
  },
  { debounce: 250, maxWait: 500 }
)

const columns = [
  {
    label: "name",
    key: "name",
    width: 0.8
  },
  {
    label: "grade",
    key: "grade"
  }
]

function editCompetence(value: Competence) {
  competence.value = value
}

function grades(competence: Competence) {
  // return first and last grade and if only one grade only that one as string
  if (competence.grades.length === 1) {
    return competence.grades[0].toString()
  }

  const sorted = competence.grades.sort((a, b) => a - b)

  return `${sorted[0]} - ${sorted[sorted.length - 1]}`
}

const goToCompetence = <Type extends { id: string }>(row: Type) => {
  router.push({
    name: "/record/competences/[id]",
    params: {
      id: row.id
    }
  })
}
</script>
