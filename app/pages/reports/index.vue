<script setup lang="ts">
type ReportSortBy = "firstName" | "lastName" | "studentGrade"

const search = ref("")

const sortBy = useSessionStorage<ReportSortBy>("reports/sortBy", "firstName")
const sortOrder = useSessionStorage<string>("reports/sortOrder", "asc")

const { data: reports } = await useFetch("/api/reports", {
  params: {
    sortBy: sortBy,
    sort: sortOrder,
    search: search
  }
})

function sort(key: ReportSortBy) {
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
      <DHeaderTitle>Berichte</DHeaderTitle>
      <DInputSearch v-model="search" />

      <!-- <template #right>
        <DButton :icon-left="DownloadIcon">Alle herunterladen</DButton>
      </template> -->
    </DHeader>

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
          <div>Status</div>

          <!-- <DTableHeaderSort :sort-by="sortBy" :sort-field="'studentBirthday'" :sort-order="sortOrder" @sort="sort" /> -->
        </div>
      </div>
    </div>

    <DPageContent>
      <RouterLink
        :to="`/reports/${report.id}`"
        v-for="report in reports"
        class="grid grid-cols-4 items-center justify-between gap-4 rounded px-2 py-2 hover:bg-neutral-100"
      >
        <div class="line-clamp-1 text-sm text-neutral-700">{{ report.student.firstName }}</div>
        <div class="line-clamp-1 text-sm text-neutral-700">{{ report.student.lastName }}</div>
        <div class="line-clamp-1 text-sm text-neutral-500">{{ report.student.studentGrade ? `${report.student.studentGrade}. Klasse` : `-` }}</div>
        <div class="line-clamp-1 text-sm text-neutral-500">
          <DTag color="gray">{{ reportStatusText(report.status) }}</DTag>
        </div>
      </RouterLink>
    </DPageContent>
  </DPage>
</template>
