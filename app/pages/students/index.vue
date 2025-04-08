<script setup lang="ts">
import { formatDate } from "@vueuse/core"
import { FilterIcon, PlusIcon, ArrowDownNarrowWideIcon, ArrowUpNarrowWideIcon, ArrowUpDownIcon } from "lucide-vue-next"
import type { DUser } from "~/types/models"

const search = ref("")

const sortBy = useSessionStorage<keyof DUser>("students/sortBy", "firstName")
const sortOrder = useSessionStorage<string>("students/sortOrder", "asc")

const { data: users } = await useFetch("/api/users", {
  params: {
    role: "student",
    sortBy: sortBy,
    sort: sortOrder,
    search: search
  }
})

// Filter modal
const showFilterModal = ref(false)

function toggleFilterModal() {
  showFilterModal.value = !showFilterModal.value
}

function sort(key: keyof DUser) {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc"
  } else {
    sortBy.value = key
    sortOrder.value = "asc"
  }
}
</script>

<template>
  <DPage>
    <DHeader>
      <DHeaderTitle>Schüler</DHeaderTitle>
      <DInputSearch v-model="search" />
      <DButton :icon-left="FilterIcon" variant="secondary" @click="toggleFilterModal">Filter</DButton>
    </DHeader>

    <DModal titel="Filter" v-if="showFilterModal" @close="showFilterModal = false" confirm-text="Schließen" @confirm="showFilterModal = false">
      <div class="p-4 text-sm text-neutral-500">
        Diese Version von Dokedu unterstützt aktuell das Filtern von Schülern nicht. Wir arbeiten daran, dass diese Funktion bald verfügbar ist.
      </div>
    </DModal>

    <div class="block min-h-0 px-4 pt-2.5">
      <div class="grid grid-cols-4 items-center justify-between gap-4 border-b border-neutral-200 px-2 pb-2">
        <div class="flex items-center justify-between border-r border-neutral-200 pr-2 text-sm font-medium text-neutral-900">
          <div>Vorname</div>

          <DTableHeaderSort :sort-by="sortBy" :sort-field="'firstName'" :sort-order="sortOrder" @sort="sort" />
        </div>
        <div class="flex items-center justify-between border-r border-neutral-200 pr-2 text-sm font-medium text-neutral-900">
          <div>Nachname</div>

          <DTableHeaderSort :sort-by="sortBy" :sort-field="'lastName'" :sort-order="sortOrder" @sort="sort" />
        </div>
        <div class="flex items-center justify-between border-r border-neutral-200 pr-2 text-sm font-medium text-neutral-900">
          <div>Klasse</div>

          <DTableHeaderSort :sort-by="sortBy" :sort-field="'studentGrade'" :sort-order="sortOrder" @sort="sort" />
        </div>
        <div class="flex items-center justify-between border-neutral-200 text-sm font-medium text-neutral-900">
          <div>Geburtstag</div>

          <DTableHeaderSort :sort-by="sortBy" :sort-field="'studentBirthday'" :sort-order="sortOrder" @sort="sort" />
        </div>
      </div>
    </div>

    <DPageContent>
      <RouterLink
        :to="`/students/${student.id}`"
        v-for="student in users"
        class="grid grid-cols-4 items-center justify-between gap-4 rounded px-2 py-2 hover:bg-neutral-100"
      >
        <div class="line-clamp-1 text-sm text-neutral-700">{{ student.firstName }}</div>
        <div class="line-clamp-1 text-sm text-neutral-700">{{ student.lastName }}</div>
        <div class="line-clamp-1 text-sm text-neutral-500">{{ student.studentGrade ? `${student.studentGrade}. Klasse` : `-` }}</div>
        <div class="line-clamp-1 text-sm text-neutral-500">
          {{ student.studentBirthday ? formatDate(new Date(student.studentBirthday), "DD.MM.YYYY") : "-" }}
        </div>
      </RouterLink>
    </DPageContent>
  </DPage>
</template>
