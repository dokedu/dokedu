<script setup lang="ts">
import { ArrowLeftIcon } from "lucide-vue-next"

const route = useRoute()
const studentId = computed(() => route.params.id as string)
const competenceId = computed(() => route.params.competenceId as string)

const { data: student } = await useFetch(`/api/users/${studentId.value}`)
const { data: parentCompetence } = await useFetch(`/api/competences/${competenceId.value}`)
const { data: competences } = await useFetch(`/api/users/${studentId.value}/competences`, {
  params: {
    competenceId: competenceId.value
  }
})

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

function formatDate(date: Date, format: string): string {
  return formatDate(date, format)
}
</script>

<template>
  <DPage>
    <DHeader v-if="student">
      <div class="flex items-center gap-4">
        <DButton to="/students" :icon-left="ArrowLeftIcon" variant="secondary">Zurück</DButton>
        <DHeaderTitle>{{ fullName(student) }}</DHeaderTitle>
      </div>
    </DHeader>

    <div class="block min-h-0 px-4 pt-2.5">
      <div class="grid grid-cols-3 items-center justify-between gap-4 border-b border-neutral-200 px-2 pb-2" :style="{ gridTemplateColumns: '1fr 110px 50px' }">
        <div class="border-r border-neutral-200 text-sm font-medium text-neutral-900">Name</div>
        <div class="border-r border-neutral-200 text-sm font-medium text-neutral-900">Klassenstufen</div>
        <div class="text-center text-sm font-medium text-neutral-900">Niveau</div>
      </div>
    </div>

    <DPageContent>
      <NuxtLink
        :to="competence.competenceType === 'competence' ? undefined : `/students/${studentId}/competences/${competence.id}`"
        v-for="competence in competences"
        :key="competence.id"
        class="grid grid-cols-3 items-center justify-between gap-4 rounded px-2 py-2 hover:bg-neutral-100"
        :style="{ gridTemplateColumns: '1fr 110px 50px' }"
      >
        <div class="line-clamp-1 cursor-default text-sm text-neutral-700">
          <span v-if="competence.competenceType === 'competence'" class="cursor-default">{{ competence.name }}</span>
          <DTag v-else class="w-fit cursor-default" :color="competence.color || 'gray'">{{ competence.name }}</DTag>
        </div>
        <div class="line-clamp-1 text-right text-sm text-neutral-700">
          <template v-if="competence.grades">
            {{ (competence.grades as any[])[0] }} - {{ (competence.grades as any[])[(competence.grades as any[]).length - 1] }}
          </template>
        </div>
        <div class="text-center text-sm font-medium" :class="getLevelColor(competence.userLevel)">
          {{ getLevelText(competence.userLevel) }}
        </div>
      </NuxtLink>

      <div v-if="!competences || competences.length === 0" class="p-4 text-center text-sm text-neutral-500">Keine Unterkompetenzen gefunden.</div>
    </DPageContent>
  </DPage>
</template>
