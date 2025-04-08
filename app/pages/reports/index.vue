<script setup lang="ts">
import { PlusIcon, ConstructionIcon, DownloadIcon } from "lucide-vue-next"
import type { DReport, DUser } from "~/types/models"

const { data: reports } = await useFetch("/api/reports")

function userFullName(user: DUser) {
  if (!user) return "-"
  return `${user.firstName} ${user.lastName}`
}

function statusText(status: string) {
  switch (status) {
    case "pending":
      return "Warteschlange"
    case "processing":
      return "In Bearbeitung"
    case "done":
      return "Fertig"
    case "error":
      return "Fehler"
    default:
      return "-"
  }
}

function statusColor(status: string) {
  switch (status) {
    case "pending":
      return "yellow"
    case "processing":
      return "blue"
    case "done":
      return "green"
    case "error":
      return "red"
    default:
      return "gray"
  }
}

async function downloadReport(report: DReport) {
  const request = await fetch(`/api/reports/${report.id}/download`, {
    credentials: "same-origin"
  })

  const blob = await request.blob()

  // Create filename with date and report ID
  const date = new Date().toISOString().split("T")[0] // yyyy-mm-dd
  const filename = `${date}-${report.id}.pdf`

  // Create download link and trigger download
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()

  // Cleanup
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

const sortBy = useSessionStorage<keyof DReport>("reports/sortBy", "createdAt")
const sortOrder = useSessionStorage<string>("reports/sortOrder", "asc")

const columns = [
  { name: "Kind", key: "" },
  { name: "Status", key: "status" },
  { name: "Erstellt von", key: "createdBy" },
  { name: "Erstellt am", key: "createdAt" },
  { name: "", key: "" }
]

// text-red-600 text-orange-600 text-amber-600 text-yellow-600 text-lime-600 text-green-600 text-emerald-600 text-teal-600 text-cyan-600 text-sky-600 text-blue-600 text-indigo-600 text-violet-600 text-purple-600 text-fuchsia-600 text-pink-600 text-rose-600
</script>

<template>
  <DPage>
    <DHeader>
      <DHeaderTitle>Berichte</DHeaderTitle>

      <template #right>
        <DButton to="/reports/new" :icon-left="PlusIcon" @click="">Bericht erstellen</DButton>
      </template>
    </DHeader>

    <div class="block min-h-0 px-4 pt-2.5">
      <div class="grid grid-cols-5 items-center justify-between gap-4 border-b border-neutral-200 px-2 pb-2">
        <div v-for="column in columns" class="flex items-center justify-between border-r border-neutral-200 pr-2 text-sm font-medium text-neutral-900">
          <div>{{ column.name }}</div>
        </div>
      </div>
    </div>

    <DPageContent>
      <div v-for="report in reports" class="grid grid-cols-5 items-center justify-between gap-4 rounded px-2 py-1 hover:bg-neutral-100">
        <div class="line-clamp-1 text-sm text-neutral-700">{{ "-" }}</div>
        <div class="line-clamp-1 text-sm text-neutral-700">
          <DTag class="w-fit" :color="statusColor(report.status)">{{ statusText(report.status) }}</DTag>
        </div>
        <div class="line-clamp-1 text-sm text-neutral-700">{{ userFullName(report.createdBy) }}</div>
        <div class="line-clamp-1 text-sm text-neutral-700">{{ formattiereZeitVergangen(Date.parse(report.createdAt)) }}</div>
        <div class="min-h-8">
          <!-- <DButton v-if="report.status === 'error'" :icon-left="RotateCcwIcon" variant="tertiary" @click="downloadReport(report)"> Wiederholen </DButton> -->
          <DButton v-if="report.status === 'done'" :icon-left="DownloadIcon" variant="secondary" @click="downloadReport(report)"> Herunterladen </DButton>
          <!-- <DButton
            v-if="report.status === 'pending' || report.status === 'processing'"
            :icon-left="StopCircleIcon"
            variant="danger-light"
            @click="cancelReport(report)"
          >
            Abbrechen
          </DButton> -->
        </div>
      </div>
    </DPageContent>
  </DPage>
</template>
