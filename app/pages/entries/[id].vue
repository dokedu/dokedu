<script setup lang="ts">
import { formatDate } from "@vueuse/core"
import { ArrowLeftIcon, FilePlusIcon, PlusIcon, Trash2Icon, SaveIcon } from "lucide-vue-next"
import type { DUser, DCompetence, DTag, DEvent } from "~/types/models"

const router = useRouter()
const route = useRoute()

const entryId = route.params.id as unknown as string

const { data: entry, refresh } = await useFetch(`/api/entries/${entryId}`, { cache: "no-cache" })

// STATE

const _date = ref(new Date(entry.value!.date! ?? new Date()))

const date = computed({
  set: (value: string) => (_date.value = new Date(value)),
  get: () => formatDate(_date.value, "YYYY-MM-DD")
})

const _body = ref(entry.value?.body)

const body = computed({
  set: (value) => (_body.value = value),
  get: () => _body.value
})

watchDebounced(_body, saveEntry, { debounce: 500 })
watchDebounced(_date, saveEntry, { debounce: 500 })

// SELECTED ITEMS

const selectedUsers = computed(() => {
  const values = entry.value?.entryUsers?.map((c) => c.user.id)
  return Array.from(new Set(values))
})

const selectedCompetences = computed(() => {
  const ucs = entry.value?.userCompetences?.map((c) => c.competenceId)
  return Array.from(new Set(ucs))
})

const selectedTags = computed(() => {
  const values = entry.value?.entryTags?.map((c) => c.tag.id)
  return Array.from(new Set(values))
})

const selectedEvents = computed(() => {
  const values = entry.value?.entryEvents?.map((c) => c.event.id)
  return Array.from(new Set(values))
})

// MODALS

const showUserModal = ref(false)

function toggleUserModal() {
  showUserModal.value = !showUserModal.value
}

const showCompetenceSearch = ref(false)

function toggleCompetenceModal() {
  showCompetenceSearch.value = !showCompetenceSearch.value
}

/// USER COMPETENCES ///

async function toggleUserCompetence(competence: DCompetence) {
  // await saveEntry()

  if (selectedCompetences.value.includes(competence.id)) {
    await $fetch(`/api/entries/${entryId}/competences/${competence.id}`, {
      method: "DELETE"
    })
  } else {
    await $fetch(`/api/entries/${entryId}/competences/${competence.id}`, {
      method: "POST"
    })
  }

  await refresh()
}

/// USERS

async function toggleEntryUser(user: DUser) {
  // await saveEntry()

  // if selected users includes the user, remove it
  if (selectedUsers.value.includes(user.id)) {
    await $fetch(`/api/entries/${entryId}/users/${user.id}`, {
      method: "DELETE"
    })
  } else {
    await $fetch(`/api/entries/${entryId}/users/${user.id}`, {
      method: "POST"
    })
  }

  await refresh()
}

const showFileModal = ref(false)

function toggleFileModal() {
  showFileModal.value = !showFileModal.value
}

const showProjectModal = ref(false)

function toggleProjectModal() {
  showProjectModal.value = !showProjectModal.value
}

const showTagModal = ref(false)

function toggleTagModal() {
  showTagModal.value = !showTagModal.value
}

async function toggleTag(tag: DTag) {
  // if selected tags includes the tag, remove it
  if (selectedTags.value.includes(tag.id)) {
    // await useStore().deleteEntryTag(entry.value!.id, tag.id)

    await $fetch(`/api/entries/${entryId}/tags/${tag.id}`, {
      method: "DELETE"
    })
  } else {
    await $fetch(`/api/entries/${entryId}/tags/${tag.id}`, {
      method: "POST"
    })
  }

  await refresh()
}

async function toggleEvent(event: DEvent) {
  if (selectedEvents.value.includes(event.id)) {
    await $fetch(`/api/entries/${entryId}/events/${event.id}`, {
      method: "DELETE"
    })
  } else {
    await $fetch(`/api/entries/${entryId}/events/${event.id}`, {
      method: "POST"
    })
  }

  await refresh()
}

async function updateUserCompetenceLevel(competenceId: string, level: number) {
  await $fetch(`/api/entries/${entryId}/competences/${competenceId}`, {
    method: "POST",
    body: {
      level: level
    }
  })

  await refresh()
}

// Modal for archiving an entry
const showArchiveModal = ref(false)

async function archive() {
  showArchiveModal.value = false
  await $fetch(`/api/entries/${entryId}`, {
    method: "DELETE"
  })
  await router.push(`/entries`)
}

function archiveModal() {
  showArchiveModal.value = true
}

function fullName(user: any) {
  return `${user.firstName} ${user.lastName}`
}

const saving = ref(false)

async function saveEntry() {
  if (!entry.value) return

  try {
    saving.value = true

    const payload = {
      id: entry.value.id,
      body: _body.value,
      date: _date.value
    }

    await $fetch(`/api/entries/${entryId}`, {
      method: "PUT",
      body: payload
    })

    // 1 second delay
    await Promise.resolve(new Promise((r) => setTimeout(r, 1000)))
  } catch (e) {
    console.log(e)
    alert("Beim Speichern ist ein Fehler aufgetreten. Bitte versuche es erneut.")
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <DPage>
    <DPageContent>
      <div v-if="entry" class="flex flex-col gap-4">
        <header class="flex items-center justify-between">
          <DButton to="/entries" :icon-left="ArrowLeftIcon" variant="secondary">Zurück</DButton>

          <div class="flex items-center gap-2.5">
            <DButton :icon-left="Trash2Icon" variant="danger-light" @click="archiveModal">Archivieren</DButton>
            <DButton :loading="saving" :icon-left="SaveIcon" @click="saveEntry">Speichern</DButton>
          </div>
        </header>

        <div class="mx-auto flex w-full max-w-screen-lg flex-col-reverse gap-4 lg:flex-row">
          <div class="w-full flex-1">
            <DLabel class="mb-1">Beschreibung</DLabel>
            <textarea
              v-model="body"
              name="body"
              id="body"
              placeholder="Hier ist Platz für deine Beobachtungen..."
              class="mb-1 field-sizing-content max-h-[60vh] min-h-36 w-full resize-none rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-0 focus:outline-0"
            ></textarea>

            <div class="mb-4 flex flex-wrap items-center gap-1">
              <DButton variant="secondary" :icon-left="PlusIcon" @click="toggleUserModal"> Schüler</DButton>
              <DButton variant="secondary" :icon-left="PlusIcon" @click="toggleCompetenceModal"> Kompetenzen</DButton>
              <DButton variant="secondary" :icon-left="PlusIcon" @click="toggleProjectModal"> Projekte</DButton>
              <DButton variant="secondary" :icon-left="PlusIcon" @click="toggleTagModal"> Tags</DButton>
              <DButton variant="secondary" :icon-left="FilePlusIcon" @click="toggleFileModal"> Dateien</DButton>
            </div>

            <div v-if="entry.entryUsers && entry.entryUsers.length > 0" class="mb-4">
              <DLabel class="mb-1">Schüler</DLabel>
              <div class="flex flex-wrap gap-2">
                <div v-for="entryUser in entry.entryUsers" class="flex items-center justify-between rounded-md bg-neutral-100 px-2.5 py-1">
                  <div class="text-sm text-neutral-700">
                    {{ fullName(entryUser.user) }}
                  </div>
                </div>
              </div>
            </div>

            <div v-if="entry.entryTags && entry.entryTags.length > 0" class="mb-4">
              <DLabel class="mb-1">Tags</DLabel>
              <div class="flex flex-wrap gap-2">
                <DTag v-for="entryTag in entry.entryTags" :color="entryTag.tag.color">
                  {{ entryTag.tag.name }}
                </DTag>
              </div>
            </div>

            <div v-if="entry.entryEvents && entry.entryEvents.length > 0" class="mb-4">
              <DLabel class="mb-1">Projekte</DLabel>
              <div class="flex flex-wrap gap-2">
                <DTag v-for="entryEvent in entry.entryEvents" :color="'gray'">
                  {{ entryEvent.event.title }}
                </DTag>
              </div>
            </div>

            <DUserCompetenceList
              :entryId="entry.id!"
              :user-competences="entry.userCompetences!"
              @remove="toggleUserCompetence"
              @update-level="updateUserCompetenceLevel"
            />

            <DModal titel="Kompetenzen" v-if="showCompetenceSearch" @close="showCompetenceSearch = false" @confirm="showCompetenceSearch = false">
              <template v-if="entry && entry.entryUsers && entry?.entryUsers?.length > 0">
                <DCompetenceSearch :selected="selectedCompetences" @toggle="toggleUserCompetence" />
              </template>
              <template v-else>
                <div class="p-4">
                  <div class="mb-2 text-sm text-neutral-700">Bitte wähle zuerst Schüler aus...</div>
                  <div class="text-xs text-neutral-500">Um eine Kompetenz hinzuzufügen, muss mindestens ein Schüler ausgewählt sein.</div>
                </div>
              </template>
            </DModal>

            <DModal titel="Schüler" v-if="showUserModal" @close="showUserModal = false" @confirm="showUserModal = false">
              <DUserSearch show-group-filters :selected="selectedUsers" @toggle="toggleEntryUser" />
            </DModal>

            <DModal titel="Dateien" v-if="showFileModal" @close="showFileModal = false" confirm-text="Schließen" @confirm="showFileModal = false">
              <div class="p-4 text-sm text-neutral-500">
                Diese Version von Dokedu unterstützt aktuell kein Hochladen von Dateien. Wir arbeiten daran, dass diese Funktion bald verfügbar ist.
              </div>
            </DModal>

            <DModal titel="Tags" v-if="showTagModal" @close="showTagModal = false" confirm-text="Speichern" @confirm="showTagModal = false">
              <DTagSearch :selected="selectedTags" @toggle="toggleTag" />
            </DModal>

            <DModal titel="Projekte" v-if="showProjectModal" @close="showProjectModal = false" confirm-text="Schließen" @confirm="showProjectModal = false">
              <DEventSearch :selected="selectedEvents" @toggle="toggleEvent" />
            </DModal>

            <DModal titel="Archivieren" v-if="showArchiveModal" @close="showArchiveModal = false" confirm-text="Archivieren" @confirm="archive">
              <div class="p-4 text-sm text-neutral-500">Möchtest du diesen Eintrag wirklich archivieren?</div>
            </DModal>
          </div>
          <div class="w-full md:w-[280px]">
            <DLabel class="mb-1">Datum</DLabel>
            <input
              type="date"
              name="date"
              id="date"
              v-model="date"
              class="w-full rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm outline-none focus:border-neutral-300 focus:ring-0 focus:outline-0"
              placeholder="Datum"
            />
          </div>
        </div>
      </div>
      <div v-else class="p-4">
        <div>Wir laden den Eintrag...</div>
      </div>
    </DPageContent>
  </DPage>
</template>
