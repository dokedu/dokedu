<script setup lang="ts">
import { DownloadIcon, FileArchiveIcon, AlertCircleIcon } from "lucide-vue-next"

definePageMeta({
  layout: "settings"
})

const { user } = useUserSession()

// Check if user is admin or owner
const canExport = computed(() => {
  return user.value?.role === "admin" || user.value?.role === "owner"
})

const isExporting = ref(false)
const exportError = ref<string | null>(null)

async function exportData() {
  if (!canExport.value) {
    exportError.value = "Sie haben keine Berechtigung, Daten zu exportieren."
    return
  }

  isExporting.value = true
  exportError.value = null

  try {
    // Fetch the export data
    const response = await fetch("/api/organisation/export-data", {
      method: "GET"
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Get the blob from the response
    const blob = await response.blob()

    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url

    // Extract filename from Content-Disposition header or use default
    const contentDisposition = response.headers.get("content-disposition")
    let filename = "dokedu-export.zip"
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1]
      }
    }

    link.download = filename
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Export failed:", error)
    exportError.value = "Fehler beim Exportieren der Daten. Bitte versuchen Sie es später erneut."
  } finally {
    isExporting.value = false
  }
}

// Success notification state
const showSuccess = ref(false)
watch(isExporting, (newVal, oldVal) => {
  if (oldVal === true && newVal === false && !exportError.value) {
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  }
})
</script>

<template>
  <DPage>
    <DHeader>
      <DHeaderTitle>Datenexport</DHeaderTitle>
    </DHeader>

    <DPageContent>
      <div class="flex flex-col gap-6">
        <!-- Info Section -->
        <div class="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <div class="flex gap-3">
            <FileArchiveIcon class="mt-0.5 size-5 flex-shrink-0 text-neutral-600" />
            <div class="flex flex-col gap-2">
              <h3 class="text-base font-semibold text-neutral-900">Kompletter Datenexport</h3>
              <p class="text-sm text-neutral-600">
                Exportieren Sie alle Daten Ihrer Organisation in einem ZIP-Archiv. Der Export enthält alle Tabellen als CSV-Dateien:
              </p>
              <ul class="ml-5 list-disc text-sm text-neutral-600">
                <li>Benutzer und Schüler</li>
                <li>Einträge und Dokumentationen</li>
                <li>Kompetenzen und Bewertungen</li>
                <li>Veranstaltungen und Events</li>
                <li>Tags und Kategorien</li>
                <li>Anwesenheitsdaten</li>
                <li>Gruppen und Berichte</li>
                <li>Dateien und Anhänge</li>
              </ul>
              <p class="text-sm text-neutral-600">Der Export kann je nach Datenmenge einige Sekunden dauern.</p>
            </div>
          </div>
        </div>

        <!-- Access Control Warning -->
        <div v-if="!canExport" class="rounded-lg border border-red-200 bg-red-50 p-4">
          <div class="flex gap-3">
            <AlertCircleIcon class="mt-0.5 size-5 flex-shrink-0 text-red-600" />
            <div class="flex flex-col gap-1">
              <h4 class="text-sm font-semibold text-red-900">Keine Berechtigung</h4>
              <p class="text-sm text-red-700">Nur Administratoren und Eigentümer können Organisationsdaten exportieren.</p>
            </div>
          </div>
        </div>

        <!-- Export Button -->
        <div class="flex flex-col gap-2">
          <DButton :icon-left="DownloadIcon" :disabled="!canExport || isExporting" :loading="isExporting" @click="exportData" size="md">
            {{ isExporting ? "Exportiere Daten..." : "Alle Daten exportieren" }}
          </DButton>

          <!-- Error Message -->
          <div v-if="exportError" class="rounded-md bg-red-100 p-3 text-sm text-red-800">
            {{ exportError }}
          </div>

          <!-- Success Message -->
          <div v-if="showSuccess" class="rounded-md bg-green-100 p-3 text-sm text-green-800">Daten wurden erfolgreich exportiert!</div>
        </div>

        <!-- Additional Information -->
        <div class="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div class="flex gap-3">
            <AlertCircleIcon class="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
            <div class="flex flex-col gap-2">
              <h4 class="text-sm font-semibold text-blue-900">Wichtige Informationen</h4>
              <ul class="ml-5 list-disc text-sm text-blue-700">
                <li>Der Export enthält sensible Daten. Behandeln Sie die Dateien vertraulich.</li>
                <li>Passwörter werden aus Sicherheitsgründen nicht exportiert.</li>
                <li>Das Export-Archiv enthält eine Metadaten-Datei mit Informationen zum Export.</li>
                <li>Die Daten werden im CSV-Format exportiert und können in Excel oder anderen Programmen geöffnet werden.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DPageContent>
  </DPage>
</template>
