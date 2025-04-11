<script setup lang="ts">
import { formatDate } from "@vueuse/core"
import { FilterIcon, PlusIcon, SquareChartGanttIcon } from "lucide-vue-next"

const search = ref("")

const { data: events } = await useFetch("/api/events", {
  params: {
    search: search
  }
})

// Filter modal
const showFilterModal = ref(false)

function toggleFilterModal() {
  showFilterModal.value = !showFilterModal.value
}

function createEvent() {
  // TODO: create event
}
</script>

<template>
  <DPage>
    <DHeader>
      <DHeaderTitle>Veranstaltungen</DHeaderTitle>
      <DInputSearch v-model="search" />
      <DButton :icon-left="FilterIcon" variant="secondary" @click="toggleFilterModal">Filter</DButton>

      <template #right>
        <DButton :icon-left="SquareChartGanttIcon" to="/projects/export" variant="secondary">Export</DButton>
        <DButton :icon-left="PlusIcon" to="/projects/new">Veranstaltung erstellen</DButton>
      </template>
    </DHeader>

    <DModal titel="Filter" v-if="showFilterModal" @close="showFilterModal = false" confirm-text="Schließen" @confirm="showFilterModal = false">
      <div class="p-4 text-sm text-neutral-500">
        Diese Version von Dokedu unterstützt aktuell das Filtern von Veranstaltungen nicht. Wir arbeiten daran, dass diese Funktion bald verfügbar ist.
      </div>
    </DModal>

    <div class="block min-h-0 px-4 pt-2.5">
      <div class="grid grid-cols-3 items-center justify-between gap-4 border-b border-neutral-200 px-2 pb-2" :style="{ gridTemplateColumns: '2fr 1fr 1fr' }">
        <div class="border-r border-neutral-200 text-sm font-medium text-neutral-900">Titel</div>
        <div class="border-r border-neutral-200 text-sm font-medium text-neutral-900">Start</div>
        <div class="text-sm font-medium text-neutral-900">Ende</div>
      </div>
    </div>

    <DPageContent>
      <RouterLink
        :to="`/projects/${project.id}`"
        v-for="project in events"
        class="grid grid-cols-3 items-center justify-between gap-4 rounded px-2 py-2 hover:bg-neutral-100"
        :style="{ gridTemplateColumns: '2fr 1fr 1fr' }"
      >
        <div class="line-clamp-1 text-sm text-ellipsis text-neutral-700">{{ project.title }}</div>
        <div class="line-clamp-1 text-sm text-neutral-500">
          {{ formatDate(new Date(project.startsAt), "DD.MM.YYYY") }}
        </div>
        <div class="line-clamp-1 text-sm text-neutral-500">
          {{ formatDate(new Date(project.endsAt), "DD.MM.YYYY") }}
        </div>
      </RouterLink>
    </DPageContent>
  </DPage>
</template>
