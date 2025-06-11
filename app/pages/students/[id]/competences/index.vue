<script setup lang="ts">
import { ArrowLeftIcon, ChevronDown, ChevronUp } from "lucide-vue-next"
import { formatDate } from "@vueuse/core"
import type { DCompetence } from "~/types/models"

const route = useRoute()
const studentId = computed(() => route.params.id as string)

const { data: student } = await useFetch(`/api/users/${studentId.value}`)
const { data: competences, refresh: refreshCompetences } = await useFetch(`/api/users/${studentId.value}/competences`)

const expandedCompetenceId = ref<string | null>(null)
const competenceHistory = ref<any[]>([])
const loadingHistory = ref(false)

function fullName(user: { firstName?: string; lastName?: string }) {
  return `${user.firstName} ${user.lastName}`
}

function getLevelText(level: number | null): string {
  if (level === null) return "-"
  const levels = ["0", "1", "2", "3"]
  return levels[level] || "-"
}

function getLevelColor(level: number | null): string {
  if (level === null) return "text-neutral-400"
  const colors = ["text-neutral-500", "text-amber-600", "text-orange-600", "text-green-600"]
  return colors[level] || "text-neutral-400"
}

async function toggleCompetence(competence: any) {
  if (competence.competenceType !== 'competence') {
    // Navigate to sub-competences for groups/subjects
    await navigateTo(`/students/${studentId.value}/competences/${competence.id}`)
    return
  }

  if (expandedCompetenceId.value === competence.id) {
    expandedCompetenceId.value = null
    competenceHistory.value = []
  } else {
    expandedCompetenceId.value = competence.id
    await loadHistory(competence.id)
  }
}

async function loadHistory(compId: string) {
  loadingHistory.value = true
  try {
    const data = await $fetch(`/api/users/${studentId.value}/competences/${compId}/history`)
    competenceHistory.value = data || []
  } catch (error) {
    console.error('Failed to load history:', error)
    competenceHistory.value = []
  } finally {
    loadingHistory.value = false
  }
}

async function updateLevel(competence: any, newLevel: number) {
  try {
    await $fetch(`/api/users/${studentId.value}/competences/${competence.id}/level`, {
      method: 'POST',
      body: { level: newLevel }
    })
    await refreshCompetences()
    if (expandedCompetenceId.value === competence.id) {
      await loadHistory(competence.id)
    }
  } catch (error) {
    console.error('Failed to update level:', error)
  }
}

function getLevelHistoryText(item: any): string {
  const levelText = getLevelText(item.level)
  const date = formatDate(new Date(item.createdAt), "DD.MM.YYYY HH:mm")
  const source = item.entryId ? 'Eintrag' : 'Manuell'
  return `Niveau ${levelText} - ${date} - ${source}`
}
</script>

<template>
  <DPage>
    <DHeader v-if="student">
      <div class="flex items-center gap-4">
        <DButton :to="`/students/${studentId}`" :icon-left="ArrowLeftIcon" variant="secondary">Zurück</DButton>
        <DHeaderTitle>Kompetenzen - {{ fullName(student) }}</DHeaderTitle>
      </div>
    </DHeader>

    <div class="block min-h-0 px-4 pt-2.5">
      <div class="grid grid-cols-3 items-center justify-between gap-4 border-b border-neutral-200 px-2 pb-2" :style="{ gridTemplateColumns: '1fr 110px 50px' }">
        <div class="border-r border-neutral-200 text-sm font-medium text-neutral-900">Name</div>
        <div class="border-r border-neutral-200 text-sm font-medium text-neutral-900">Klassenstufen</div>
        <div class="text-sm font-medium text-neutral-900 text-center">Niveau</div>
      </div>
    </div>

    <DPageContent>
      <div v-for="competence in competences" :key="competence.id">
        <div
          @click="toggleCompetence(competence)"
          class="grid grid-cols-3 items-center justify-between gap-4 rounded px-2 py-2 hover:bg-neutral-100 cursor-pointer"
          :style="{ gridTemplateColumns: '1fr 110px 50px' }"
        >
          <div class="line-clamp-1 text-sm text-neutral-700 flex items-center gap-2">
            <DTag class="w-fit" :color="competence.color ? competence.color : 'gray'">{{ competence.name }}</DTag>
            <ChevronDown v-if="competence.competenceType === 'competence' && expandedCompetenceId !== competence.id" class="w-4 h-4 text-neutral-400" />
            <ChevronUp v-if="competence.competenceType === 'competence' && expandedCompetenceId === competence.id" class="w-4 h-4 text-neutral-400" />
          </div>
          <div class="line-clamp-1 text-right text-sm text-neutral-700">
            <template v-if="competence.grades"> 
              {{ (competence.grades as any[])[0] }} - {{ (competence.grades as any[])[(competence.grades as any[]).length - 1] }} 
            </template>
          </div>
          <div class="text-center text-sm font-medium" :class="getLevelColor(competence.userLevel)">
            {{ getLevelText(competence.userLevel) }}
          </div>
        </div>

        <!-- Expanded section for competences -->
        <div v-if="competence.competenceType === 'competence' && expandedCompetenceId === competence.id" class="bg-neutral-50 px-4 py-3 border-t border-neutral-200">
          <div class="space-y-3">
            <!-- Level adjustment buttons -->
            <div>
              <p class="text-sm font-medium text-neutral-700 mb-2">Niveau anpassen:</p>
              <div class="flex gap-2">
                <button
                  v-for="level in [0, 1, 2, 3]"
                  :key="level"
                  @click.stop="updateLevel(competence, level)"
                  class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
                  :class="competence.userLevel === level 
                    ? 'bg-neutral-900 text-white' 
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-300'"
                >
                  {{ level }}
                </button>
              </div>
            </div>

            <!-- History -->
            <div>
              <p class="text-sm font-medium text-neutral-700 mb-2">Verlauf:</p>
              <div v-if="loadingHistory" class="text-sm text-neutral-500">Lade Verlauf...</div>
              <div v-else-if="competenceHistory.length === 0" class="text-sm text-neutral-500">Keine Historie vorhanden</div>
              <div v-else class="space-y-1">
                <div v-for="item in competenceHistory" :key="item.id" class="text-sm text-neutral-600">
                  {{ getLevelHistoryText(item) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!competences || competences.length === 0" class="p-4 text-center text-sm text-neutral-500">
        Keine Kompetenzen gefunden.
      </div>
    </DPageContent>
  </DPage>
</template> 