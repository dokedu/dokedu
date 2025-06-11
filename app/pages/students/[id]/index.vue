<script setup lang="ts">
import { ArrowLeftIcon, Edit2, BookOpen } from "lucide-vue-next"
import type { DUser } from "~/types/models"
import { formatDate } from "@vueuse/core"

const route = useRoute()
const id = route.params.id

const { data: student } = await useFetch(`/api/users/${id}`)

function fullName(user: { firstName?: string; lastName?: string }) {
  return `${user.firstName} ${user.lastName}`
}
</script>

<template>
  <DPage>
    <DHeader v-if="student">
      <div class="flex items-center gap-4">
        <DButton to="/students" :icon-left="ArrowLeftIcon" variant="secondary">Zurück</DButton>
        <DHeaderTitle>{{ fullName(student) }}</DHeaderTitle>
        <div class="flex items-center gap-2">
          <DTag v-if="student.studentGrade">{{ student.studentGrade }}. Klasse</DTag>
          <div v-if="student.studentBirthday" class="text-sm text-neutral-700">
            geboren am {{ formatDate(new Date(student.studentBirthday), "DD.MM.YYYY") }}
          </div>
        </div>
      </div>
    </DHeader>

    <DPageContent>
      <div class="p-4 space-y-4">
        <DButtonGroup>
          <DButton 
          :to="`/students/${id}/competences`" 
          :icon-left="BookOpen" 
          variant="secondary"
          class="w-full justify-start"
        >
          Kompetenzen
        </DButton>
        </DButtonGroup>
      </div>
    </DPageContent>
  </DPage>
</template>
