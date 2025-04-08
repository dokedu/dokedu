<script setup lang="ts">
import { formatDate } from "@vueuse/core"

const id = useRouteParams<string>("id")

const { data: event } = await useFetch(`/api/events/${id.value}`)
</script>

<template>
  <DPage v-if="event">
    <DHeader>
      <div class="flex items-center gap-4">
        <DHeaderTitle>Projekt</DHeaderTitle>
      </div>
    </DHeader>

    <DPageContent>
      <div class="max-w-xl px-2">
        <p class="mb-2 text-lg font-medium">{{ event.title }}</p>
        <div class="mb-2 flex items-center gap-2">
          <div class="text-sm text-neutral-500">
            {{ formatDate(new Date(event.startsAt), "DD.MM.YYYY") }}
          </div>
          <div class="text-sm text-neutral-500">{{ "-" }}</div>
          <div class="text-sm text-neutral-500">{{ formatDate(new Date(event.endsAt), "DD.MM.YYYY") }}</div>
        </div>
        <p class="mb-4 text-sm text-neutral-700">{{ event.body }}</p>
        <div class="rounded-md bg-orange-100 p-4 text-sm text-orange-700">
          <div class="mb-2 font-bold text-orange-900">Kompetenzen</div>
          <div>Derzeit werden die Projektkompetenzen nicht geladen, wir arbeiten daran, dass sie wieder angezeigt werden.</div>
        </div>
      </div>
    </DPageContent>
  </DPage>
</template>
