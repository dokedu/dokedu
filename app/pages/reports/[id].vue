<script setup lang="ts">
import { DownloadIcon, PencilIcon, SquareCheckBigIcon, SquareIcon } from "lucide-vue-next"

const { id } = useRoute().params as { id: string }

const { data: report } = await useFetch(`/api/reports/${id}`)
const { data: competences } = await useFetch(`/api/competences`)

const selectedCompetences = ref<string[]>(report.value?.content?.competences ?? [])

function toggleCompetence(competenceId: string) {
  if (selectedCompetences.value.includes(competenceId)) {
    selectedCompetences.value = selectedCompetences.value.filter((id) => id !== competenceId)
  } else {
    selectedCompetences.value.push(competenceId)
  }
}

function isCompetenceSelected(competenceId: string) {
  return selectedCompetences.value.includes(competenceId)
}

function toggleAllCompetences() {
  if (selectedCompetences.value.length === competences.value?.length) {
    selectedCompetences.value = []
  } else {
    selectedCompetences.value = competences.value?.map((competence) => competence.id) ?? []
  }
}

const firstName = computed(() => report.value?.student.firstName)
const lastName = computed(() => report.value?.student.lastName)
const birthdate = computed(() => (report.value?.student.studentBirthday ? formatDate(report.value?.student.studentBirthday) : ""))
const birthplace = computed(() => report.value?.student.studentBirthplace)

const status = ref(report.value?.content?.status ?? "draft")

const statusOptions = [
  { display: "Entwurf", color: "gray", value: "draft" },
  { display: "In Arbeit", color: "orange", value: "in_progress" },
  { display: "In Prüfung", color: "blue", value: "in_review" },
  { display: "Abgeschlossen", color: "green", value: "completed" }
]

const schoolYear = ref(report.value?.content?.schoolYear ?? "")

const header = ref(report.value?.content?.introduction ?? "")

function formatDate(date: string) {
  return Intl.DateTimeFormat("de-DE", { dateStyle: "long" }).format(new Date(Date.parse(date)))
}

let lastHash = ref(new Date().getTime().toString())

watchDebounced(
  [selectedCompetences, status, schoolYear, header],
  async () => {
    await save()
    lastHash.value = new Date().getTime().toString()
  },
  { debounce: 1000, maxWait: 5_000, deep: true }
)

async function save() {
  await $fetch(`/api/reports/${id}`, {
    method: "PUT",
    body: {
      status: status.value,
      schoolYear: schoolYear.value,
      introduction: header.value,
      competences: selectedCompetences.value
    }
  })
}
</script>

<template>
  <DPage>
    <DHeader>
      <DHeaderTitle>Berichte</DHeaderTitle>

      <template #right>
        <DButton :icon-left="DownloadIcon">Herunterladen</DButton>
      </template>
    </DHeader>

    <DPageContent class="!p-0">
      <div class="flex h-full flex-col">
        <div class="grid h-full grid-cols-2 overflow-auto">
          <form class="flex flex-1 flex-col gap-4 overflow-auto px-6 py-4" @submit.prevent="save">
            <div>
              <DLabel class="mb-1">Status</DLabel>
              <DSelect v-model="status" :options="statusOptions" placeholder="Status" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="">
                <DLabel class="mb-1">Vorname</DLabel>
                <DInput type="text" v-model="firstName" placeholder="Vorname" class="w-full" disabled />
              </div>

              <div class="">
                <DLabel class="mb-1">Nachname</DLabel>
                <DInput type="text" v-model="lastName" placeholder="Nachname" class="w-full" disabled />
              </div>

              <!-- birthdate -->
              <div class="">
                <DLabel class="mb-1">Geburtstag</DLabel>
                <DInput type="text" v-model="birthdate" placeholder="Geburtstag" class="w-full" disabled />
              </div>

              <!-- birthplace -->
              <div class="">
                <DLabel class="mb-1">Geburtsort</DLabel>
                <DInput type="text" v-model="birthplace" placeholder="Geburtsort" class="w-full" disabled />
              </div>

              <div class="col-span-2 flex flex-col gap-2 rounded bg-blue-100 p-4">
                <div class="text-sm text-blue-900">Dieser Schüler kann nicht hier bearbeitet werden. Bitte bearbeite ihn in den Admin-Einstellungen.</div>
                <DButton variant="primary" :icon-left="PencilIcon" :to="`/settings/students/${id}`" class="w-fit">Bearbeiten</DButton>
              </div>
            </div>

            <div>
              <DLabel class="mb-1">Schuljahr</DLabel>
              <DInput type="text" v-model="schoolYear" placeholder="Schuljahr" class="w-full" />
            </div>

            <div class="">
              <DLabel class="mb-1">Einleitung</DLabel>
              <textarea
                v-model="header"
                placeholder="Schreibe eine Einleitung für den Lernstandsbericht..."
                class="mb-1 field-sizing-content max-h-[60vh] min-h-36 w-full resize-none rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-0 focus:outline-0"
              ></textarea>
            </div>

            <div class="flex w-full flex-col gap-2">
              <div class="flex items-center justify-between">
                <DLabel class="mb-1">Kompetenzen</DLabel>
                <DButton variant="secondary" @click="toggleAllCompetences">
                  Alle Kompetenzen {{ selectedCompetences.length === competences?.length ? "abwählen" : "auswählen" }}
                </DButton>
              </div>
              <div class="rounded-md bg-neutral-100 p-2 text-sm text-neutral-500">
                Wird eine Kompetenz ausgewählt, werden die entsprechenden Kompetenzen und Niveaus dafür mit ausgegeben.
              </div>
              <div class="flex flex-col gap-0.5">
                <div
                  v-for="competence in competences"
                  :key="competence.id"
                  class="flex w-full cursor-default items-center gap-2 rounded-lg p-1 hover:bg-neutral-50"
                  @click="toggleCompetence(competence.id)"
                >
                  <DButton variant="secondary" :icon-left="isCompetenceSelected(competence.id) ? SquareCheckBigIcon : SquareIcon"></DButton>
                  <DTag :color="competence.color" class="h-7">{{ competence.name }}</DTag>
                </div>
              </div>
            </div>

            <DButton type="submit" class="w-fit">Speichern</DButton>
          </form>
          <iframe :src="`/api/reports/${id}/preview?s=${lastHash}`" class="h-full w-full bg-black p-2" frameborder="0"></iframe>
        </div>
      </div>
    </DPageContent>
  </DPage>
</template>
