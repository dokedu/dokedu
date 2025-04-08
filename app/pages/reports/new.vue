<script setup lang="ts">
import { FilePlus2Icon, UserPlus2Icon } from "lucide-vue-next"
import type { DReport, DUser } from "~/types/models"

const { data: reportTemplates } = await useFetch("/api/report_templates")

const selected = ref<DUser[]>([])
const selectedUsers = computed(() => {
  return selected.value.map((c) => c.id)
})

const showUserModal = ref(false)

function toggleEntryUser(user: DUser) {
  if (selected.value.includes(user)) {
    selected.value = selected.value.filter((c) => c.id !== user.id)
  } else {
    selected.value.push(user)
  }
}

function toggleUserModal() {
  showUserModal.value = !showUserModal.value
}

const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)
const templateId = ref<string | null>(null)

async function createReport() {
  // validation (must have 1 user (min, max), start and end date) and report template must be selected
  if (selectedUsers.value.length !== 1) {
    return alert("Bitte wähle genau einen Schüler aus!")
  }
  if (!startDate.value || !endDate.value) {
    return alert("Bitte wähle einen Start- und Enddatum!")
  }
  if (!templateId.value) {
    return alert("Bitte wähle ein Berichtsart!")
  }

  const report: Partial<DReport> = {
    templateId: templateId.value!,
    options: {
      start: startDate.value,
      end: endDate.value,
      users: selectedUsers.value
    } as any
  }
  // await store.createReport(report)

  await $fetch("/api/reports", {
    method: "POST",
    body: report
  })

  await navigateTo("/reports")
}

const options = reportTemplates.value?.map((c) => {
  return {
    value: c.id,
    display: c.description
  }
})
</script>

<template>
  <DPage>
    <DHeader>
      <DHeaderTitle>Bericht erstellen</DHeaderTitle>

      <template #right> </template>
    </DHeader>

    <DPageContent>
      <div class="flex max-w-lg flex-col gap-4 px-2">
        <div class="flex gap-2">
          <div class="w-full md:w-[280px]">
            <DLabel class="mb-1">Von</DLabel>
            <input
              v-model="startDate"
              type="date"
              name="date"
              id="date"
              class="w-full rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm outline-none focus:border-neutral-300 focus:ring-0 focus:outline-0"
              placeholder="Datum"
            />
          </div>
          <div class="w-full md:w-[280px]">
            <DLabel class="mb-1">Bis</DLabel>
            <input
              v-model="endDate"
              type="date"
              name="date"
              id="date"
              class="w-full rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm outline-none focus:border-neutral-300 focus:ring-0 focus:outline-0"
              placeholder="Datum"
            />
          </div>
        </div>

        <div>
          <DLabel class="mb-2">
            {{ selected.length === 0 ? "Schüler" : selected.length + " Schüler" }}
          </DLabel>

          <div class="flex flex-wrap gap-2">
            <DButton variant="secondary" :icon-left="UserPlus2Icon" @click="toggleUserModal"> Schüler auswählen </DButton>
          </div>
        </div>

        <div>
          <DLabel class="mb-2">Berichtsart</DLabel>
          <DSelect v-model="templateId" placeholder="Bitte wählen..." :options="options"> </DSelect>
        </div>

        <div>
          <DButton @click="createReport" :icon-left="FilePlus2Icon" variant="primary">In Auftrag stellen</DButton>
        </div>
        <div>
          <p class="text-sm text-neutral-500">
            Der Bericht wird in eine Warteschlange eingereiht und im Hintergrund verarbeitet. Je nach Anzahl der Schüler und des Zeitraums kann es einige
            Sekunden bis Minuten dauern.
          </p>
        </div>

        <!-- <DButton @click="createRandomReport" class="w-fit" :icon-left="DicesIcon" variant="primary">Random report</DButton> -->
      </div>

      <DModal titel="Schüler" v-if="showUserModal" @close="showUserModal = false" @confirm="showUserModal = false">
        <DUserSearch show-group-filters :selected="selectedUsers" @toggle="toggleEntryUser" />
      </DModal>
    </DPageContent>
  </DPage>
</template>
