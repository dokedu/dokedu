<script setup lang="ts">
import { formatDate } from "@vueuse/core"
import { Edit2Icon, XIcon } from "lucide-vue-next"

const id = useRouteParams<string>("id")

const { data: event } = await useFetch(`/api/events/${id.value}`)

const name = computed({
  get: () => event.value?.title,
  set: async (value) => {
    event.value!.title = value
    await $fetch(`/api/events/${id.value}`, {
      method: "PATCH",
      body: {
        id: id.value,
        title: value
      }
    })
  }
})

const description = computed({
  get: () => event.value?.body,
  set: async (value) => {
    event.value!.body = value
    await $fetch(`/api/events/${id.value}`, {
      method: "PATCH",
      body: {
        id: id.value,
        body: value
      }
    })
  }
})

const startsAt = computed({
  get: () => (event.value?.startsAt ? formatDate(new Date(Date.parse(event.value?.startsAt)), "YYYY-MM-DD") : ""),
  set: async (value) => {
    event.value!.startsAt = value
    await $fetch(`/api/events/${id.value}`, {
      method: "PATCH",
      body: {
        id: id.value,
        startsAt: value
      }
    })
  }
})

const endsAt = computed({
  get: () => (event.value?.endsAt ? formatDate(new Date(Date.parse(event.value?.endsAt)), "YYYY-MM-DD") : ""),
  set: async (value) => {
    event.value!.endsAt = value
    await $fetch(`/api/events/${id.value}`, {
      method: "PATCH",
      body: {
        id: id.value,
        endsAt: value
      }
    })
  }
})

async function deleteEvent() {
  let confirmed = confirm("Möchtest du diesen Eintrag wirklich archivieren?")
  if (!confirmed) return

  await $fetch(`/api/events/${id.value}`, {
    method: "DELETE"
  })
  await navigateTo("/projects")
}
</script>

<template>
  <DPage v-if="event">
    <DHeader>
      <DButton :icon-left="XIcon" class="py-2" variant="secondary" to="/projects"></DButton>

      <template #right>
        <div class="flex items-center gap-2">
          <DButton :icon-left="XIcon" variant="danger-light" @click="deleteEvent">Archivieren</DButton>
        </div>
      </template>
    </DHeader>

    <DPageContent>
      <div class="mx-auto w-full max-w-3xl p-4">
        <textarea
          type="text"
          v-model="name"
          class="mb-2.5 field-sizing-content w-full resize-none text-2xl font-medium outline-0"
          placeholder="Veranstaltungsname"
        />

        <textarea
          type="text"
          v-model="description"
          class="mb-2.5 field-sizing-content w-full resize-none text-gray-800 outline-0"
          placeholder="Füge eine Beschreibung hinzu"
        />

        <div class="mb-2 flex items-center gap-2">
          <d-input v-model="startsAt" type="date" placeholder="Startdatum" />
          <d-input v-model="endsAt" type="date" placeholder="Enddatum" />
        </div>

        <div class="mt-8 rounded-md bg-orange-100 p-4 text-sm text-orange-700">
          <div class="mb-2 font-bold text-orange-900">Kompetenzen</div>
          <div>Derzeit werden die Projektkompetenzen nicht geladen, wir arbeiten daran, dass sie wieder angezeigt werden.</div>
        </div>
      </div>
    </DPageContent>
  </DPage>
</template>
