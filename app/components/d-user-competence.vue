<script setup lang="ts">
import { XIcon } from "lucide-vue-next"
import type { DUserCompetence } from "~/types/models"

interface Props {
  userCompetence: DUserCompetence
}

const { userCompetence } = defineProps<Props>()

const competence = ref(null)
const parents = ref([])

const emit = defineEmits(["remove", "levelChange"])

function upgradeLevel() {
  const level = userCompetence.level >= 3 ? 0 : userCompetence.level + 1
  emit("levelChange", level)
}

// bg-red-100 bg-orange-100 bg-amber-100 bg-yellow-100 bg-lime-100 bg-green-100 bg-emerald-100 bg-teal-100 bg-cyan-100 bg-sky-100 bg-blue-100 bg-indigo-100 bg-violet-100 bg-purple-100 bg-fuchsia-100 bg-pink-100 bg-rose-100
// text-red-800 text-orange-800 text-amber-800 text-yellow-800 text-lime-800 text-green-800 text-emerald-800 text-teal-800 text-cyan-800 text-sky-800 text-blue-800 text-indigo-800 text-violet-800 text-purple-800 text-fuchsia-800 text-pink-800 text-rose-800
</script>

<template>
  <div v-if="userCompetence" class="flex flex-col gap-1 py-1">
    <div class="flex items-center justify-between gap-2 rounded-md pr-1">
      <div class="flex items-center gap-2 pl-0.5">
        <div class="text-sm text-neutral-700">
          {{ userCompetence.competence.name }}
          {{ userCompetence.deletedAt === null ? "" : "- deleted" }}
        </div>
      </div>
      <div class="flex items-center gap-1">
        <button type="button" class="flex size-6 items-center justify-center rounded-md bg-blue-600 text-sm text-white hover:bg-blue-700" @click="upgradeLevel">
          {{ userCompetence.level }}
        </button>
        <DButton :icon-left="XIcon" variant="secondary" class="!px-1" @click="emit('remove', competence)" />
      </div>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <template v-for="(parent, index) in parents" :key="parent.id">
        <div class="text-neutral-300" v-if="index !== 0">{{ "/" }}</div>
        <DTag size="small" :color="parent.color ?? 'gray'">{{ parent.name }}</DTag>
      </template>
    </div>
  </div>
</template>
