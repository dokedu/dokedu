<template>
  <div class="mt-2 flex items-center justify-between border-t border-neutral-200 py-2" @click.prevent="toggleEntries">
    <div class="text-sm font-medium">{{ $t("entry", 2) }}</div>
    <ChevronDown class="h-5 w-5"></ChevronDown>
  </div>
  <div v-if="entriesOpen">
    <div v-for="competence in competences" class="text-subtle">
      <div v-if="competence.entry">
        <span class="font-medium text-strong">{{ $t("level") }} {{ competence.level }}</span>
        {{ $t("was_documented_by") }}
        <span class="font-medium text-strong">{{ competence.createdBy?.firstName }} {{ competence.createdBy?.lastName
        }}</span>
        {{ $t("at") }}
        <span class="font-medium text-strong">
          {{ formatDate(new Date(Date.parse(competence.createdAt)), "DD.MM.YYYY HH:MM") }}
        </span>
        {{ $t("in") }}
        <RouterLink :to="{ name: '/record/entries/[id]', params: { id: competence.entry.id } }"
          class="font-medium text-strong">{{ $t("entry") }}</RouterLink>
      </div>
      <div v-else>
        <span class="font-medium text-strong">{{ $t("level") }} {{ competence.level }}</span>
        {{ $t("was_documented_by") }}
        <span class="font-medium text-strong">{{ competence.createdBy?.firstName }} {{ competence.createdBy?.lastName
        }}</span>
        {{ $t("at") }}
        <span class="font-medium text-strong">
          {{ formatDate(new Date(Date.parse(competence.createdAt)), "DD.MM.YYYY HH:MM") }}
        </span>
        {{ $t("manually") }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ChevronDown } from "lucide-vue-next"
import { ref } from "vue"
import { formatDate } from "@vueuse/core"
import type { UserCompetence } from "@/gql/schema"

export interface Props {
  competences: UserCompetence[]
}

defineProps<Props>()

const entriesOpen = ref(false)

function toggleEntries() {
  entriesOpen.value = !entriesOpen.value
}
</script>
