<script setup lang="ts">
import type { DCompetence } from "~/types/models"

interface Props {
  entryId: string
  userCompetences: any[]
}

const { entryId, userCompetences } = defineProps<Props>()
const emit = defineEmits(["remove", "updateLevel"])

async function remove(competence: DCompetence) {
  emit("remove", competence)
}

const reduced = computed(() => {
  return Array.from(new Map(userCompetences.map((uc) => [uc.competence.id, uc])).values())
})

async function levelChange(competenceId: string, level: number) {
  emit("updateLevel", competenceId, level)
}
</script>

<template>
  <div v-show="reduced.length > 0">
    <DLabel>Kompetenzen</DLabel>
    <div class="divide-y divide-neutral-200">
      <div v-for="userCompetence in reduced" :key="userCompetence.id">
        <DUserCompetence
          :userCompetence="userCompetence"
          @remove="remove(userCompetence.competence)"
          @levelChange="(level) => levelChange(userCompetence.competenceId, level)"
        />
      </div>
    </div>
  </div>
</template>
