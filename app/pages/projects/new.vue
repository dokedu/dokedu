<script setup lang="ts">
import { ArrowRightIcon, Edit2Icon, XIcon } from "lucide-vue-next"

const name = ref("")
const description = ref("")
const startsAt = ref("")
const endsAt = ref("")

async function create() {
  const result = await $fetch(`/api/events`, {
    method: "POST",
    body: {
      title: name.value,
      body: description.value,
      startsAt: startsAt.value,
      endsAt: endsAt.value
    }
  })
  if (!result) return alert("Beim Erstellen ist ein Fehler aufgetreten. Bitte versuche es erneut.")
  await navigateTo(`/projects/${result.id}`)
}
</script>

<template>
  <DPage>
    <DHeader>
      <template #right>
        <div>
          <DButton :icon-left="XIcon" class="py-2" variant="secondary" to="/projects"></DButton>
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
          class="placehoder:text-gray-500 mb-2.5 field-sizing-content w-full resize-none text-gray-800 outline-0"
          placeholder="Füge eine Beschreibung hinzu"
        />

        <div class="mb-2 flex items-center gap-2">
          <d-input v-model="startsAt" type="date" placeholder="Startdatum" />
          <ArrowRightIcon class="h-5 w-5 text-gray-500" />
          <d-input v-model="endsAt" type="date" placeholder="Enddatum" />
        </div>

        <div>
          <d-button @click="create">Erstellen</d-button>
        </div>
      </div>
    </DPageContent>
  </DPage>
</template>
