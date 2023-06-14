<template>
  <div class="mt-2 flex items-center justify-between border-t border-stone-200 py-2">
    <div class="text-sm font-medium">Entries</div>
    <ChevronDown class="h-5 w-5" @click="toggleEntries"></ChevronDown>
  </div>
  <div v-if="entriesOpen">
    <div v-for="competence in competences" class="text-subtle">
      <div v-if="competence.entry">
        <span class="font-medium text-strong">Level {{ competence.level }}</span> was documented by
        <span class="font-medium text-strong"
          >{{ competence.createdBy?.firstName }} {{ competence.createdBy?.lastName }}</span
        >
        at
        <span class="font-medium text-strong">
          {{ formatDate(new Date(Date.parse(competence.createdAt)), "DD.MM.YYYY HH:MM") }}
        </span>
        in
        <RouterLink
          :to="{ name: 'record-entries-entry', params: { id: competence.entry.id } }"
          class="font-medium text-strong"
          >Entry</RouterLink
        >
      </div>
      <div v-else="competence.entry">
        <span class="font-medium text-strong">Level {{ competence.level }}</span> was documented by
        <span class="font-medium text-strong"
          >{{ competence.createdBy?.firstName }} {{ competence.createdBy?.lastName }}</span
        >
        at
        <span class="font-medium text-strong">
          {{ formatDate(new Date(Date.parse(competence.createdAt)), "DD.MM.YYYY HH:MM") }}
        </span>
        manually
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { UserCompetence } from "@/gql/graphql";
import { ChevronDown } from "lucide-vue-next";
import { ref } from "vue";
import { formatDate } from "@vueuse/core";

export interface Props {
  competences: Partial<UserCompetence>[];
}

defineProps<Props>();

const entriesOpen = ref(false);
const toggleEntries = () => (entriesOpen.value = !entriesOpen.value);
</script>
