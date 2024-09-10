<template>
  <div class="flex h-screen w-full select-none flex-col text-sm @container">
    <div
      class="flex h-[56px] min-h-0 w-full items-center justify-between border-b border-neutral-100 px-8 py-2 text-sm text-neutral-700">
      <div class="flex items-center gap-2">
        <router-link to="/record/projects/" class="select-none text-sm font-medium text-strong">
          {{ $t("project", 2) }}
        </router-link>
        <ChevronRight :size="16" />
        <router-link v-if="$route.name !== '/record/projects/new'" :to="{ name: '/record/projects/[id]' }"
          class="select-none text-sm font-medium text-strong">
          {{ $t("project", 1) }}
        </router-link>
        <div v-if="$route.name === '/record/projects/new'" class="select-none text-sm font-medium text-strong">
          {{ $t("project", 1) }}
        </div>
      </div>
      <d-button v-if="project.id" type="transparent" size="xs" :icon-left="Trash" @click="trash">
        {{ $t("delete") }}
      </d-button>
    </div>
    <div class="grid h-[calc(100%-56px)] flex-1 grid-cols-1 gap-4 px-8 py-4 @3xl:grid-cols-2">
      <div class="h-full">
        <div class="mb-4 flex flex-col gap-2">
          <div v-if="false" class="flex min-h-[8rem] w-full items-center justify-start rounded-lg bg-neutral-100">
            <div class="mx-auto text-center">
              <Image class="mx-auto mb-1 stroke-neutral-300" :size="48" v-bind="{ 'stroke-width': 1 }" />
              <div class="select-none text-center text-xs text-neutral-500">
                Add a cover image <br />
                by clicking or dropping a file
              </div>
            </div>
          </div>
          <d-input v-model="project.title" name="name" label="Name" :placeholder="$t('name_of_project')"
            :required="true" />
          <div class="grid grid-cols-2 gap-2">
            <d-input v-model="startsAt" name="starts-at" type="date" />
            <d-input v-model="endsAt" name="ends-at" type="date" />
          </div>
        </div>

        <div class="mt-2">
          <textarea ref="textarea" v-model="body"
            class="block min-h-[6rem] w-full resize-none rounded-md border-0 py-2 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-950 sm:text-sm sm:leading-6"
            name="description" id="description" cols="30" rows="3" :placeholder="$t('project_description_placeholder')"
            required />
        </div>
        <div class="mt-4 flex justify-between">
          <div class="flex gap-2">
            <d-button type="outline" @click="cancel">{{ $t("cancel") }}</d-button>
          </div>
          <d-button v-if="!project.id" type="primary" :icon-left="Plus" @click="create">{{ $t("create") }}</d-button>
          <d-button v-if="project.id" type="primary" :icon-left="Save" @click="update">{{ $t("save") }}</d-button>
        </div>
      </div>
      <div v-if="$route.name !== '/record/projects/new'" class="flex h-full select-none flex-col gap-2 overflow-scroll">
        <header class="flex min-h-0 items-baseline justify-between">
          <div class="text-sm text-subtle">{{ $t("competence", 2) }}</div>
          <div v-if="isFullPage">
            <d-button type="transparent" size="xs" @click="editCompetences = true">{{ $t("add") }}</d-button>
          </div>
        </header>
        <div v-if="project.competences && project.competences.length > 0"
          class="flex flex-1 flex-col gap-1 overflow-scroll">
          <d-competence v-for="competence in project.competences" :key="competence.id" :competence="competence">
            <div class="rounded-lg p-0.5 hover:bg-neutral-100" @click="toggleCompetence(competence)">
              <X :size="18" class="stroke-colors-default" />
            </div>
          </d-competence>
        </div>
        <div v-else class="text-neutral-500">
          <div class="mx-auto mt-4 w-fit rounded-lg bg-neutral-50 p-8 text-center">
            {{ $t("no_competences") }}
          </div>
        </div>
      </div>
    </div>
    <Teleport v-if="editCompetences" to="body">
      <div class="absolute left-0 top-0 h-screen w-screen bg-neutral-900/20">
        <div class="flex h-full w-full">
          <div ref="edit" class="mx-auto mt-24 h-full max-h-[70vh] w-[520px] rounded-md bg-white p-4 shadow-md">
            <d-competence-search :selected="project.competences" @add="toggleCompetence" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import dButton from "@/components/d-button/d-button.vue"
import { Plus, Image, ChevronRight } from "lucide-vue-next"
import { computed, ref, toRef } from "vue"
import { onClickOutside, onKeyStroke, useTextareaAutosize } from "@vueuse/core"
import { Save } from "lucide-vue-next"
import DCompetence from "@/components/d-competence/d-competence.vue"
import { Trash, X } from "lucide-vue-next"
import DInput from "@/components/d-input/d-input.vue"
import DCompetenceSearch from "@/components/d-competence-search/d-competence-search.vue"
import { useRoute } from "vue-router/auto"
import { useToggleEventCompetenceMutation } from "@/gql/mutations/events/toggleEventCompetence"
import type { Competence } from "@/gql/schema"
import { useArchiveEventMutation } from "@/gql/mutations/events/archiveEvent"
import { useCreateEventMutation } from "@/gql/mutations/events/createEvent"
import { useUpdateEventMutation } from "@/gql/mutations/events/updateEvent"

const route = useRoute()
const editCompetences = ref(false)
const edit = ref()

const isFullPage = computed(() => {
  return route.name === "/record/projects/[id]"
})

onClickOutside(edit, () => {
  editCompetences.value = false
})

onKeyStroke("Escape", async () => {
  editCompetences.value = false
})

async function toggleCompetence(competence: Competence) {
  await toggleEventCompetence({
    input: {
      eventId: project?.value?.id,
      competenceId: competence.id
    }
  })
}

const { executeMutation: toggleEventCompetence } = useToggleEventCompetenceMutation()

export interface Props {
  project: Event
}

const props = defineProps<Props>()

const project = toRef(props, "project")

const startsAt = computed({
  get: () => project.value.startsAt.slice(0, 10),
  set: (value) => (project.value.startsAt = value)
})

const endsAt = computed({
  get: () => project.value.endsAt.slice(0, 10),
  set: (value) => (project.value.endsAt = value)
})

const emit = defineEmits(["cancel", "save"])

function cancel() {
  emit("cancel")
}

function save() {
  emit("save")
}

const { textarea, input: body } = useTextareaAutosize({
  input: project.value.body as string
})

async function trash() {
  if (!confirm("Are you sure you want to delete this event?")) return
  await archiveEvent({
    id: project.value.id as string
  })
  cancel()
}

// archiveEvent(id: ID!): Event!
const { executeMutation: archiveEvent } = useArchiveEventMutation()

const { executeMutation: createEvent } = useCreateEventMutation()

const { executeMutation: updateEvent } = useUpdateEventMutation()

async function update() {
  if (!project.value.title) {
    alert("Please provide a title")
    return
  }

  if (!body.value) {
    alert("Please provide a description")
    return
  }

  if (!startsAt.value) {
    alert("Please provide a start date")
    return
  }

  if (!endsAt.value) {
    alert("Please provide an end date")
    return
  }

  let starts = new Date(startsAt.value).toUTCString()
  let ends = new Date(endsAt.value).toUTCString()

  const event = {
    id: project.value.id as string,
    title: project.value.title,
    body: body.value,
    startsAt: starts,
    endsAt: ends
  }

  try {
    await updateEvent({ input: event })
    save()
  } catch (e) {
    alert(e)
  }
}

async function create() {
  if (!project.value.title) {
    alert("Please provide a title")
    return
  }

  if (!body.value) {
    alert("Please provide a description")
    return
  }

  if (!startsAt.value) {
    alert("Please provide a start date")
    return
  }

  if (!endsAt.value) {
    alert("Please provide an end date")
    return
  }

  let starts = new Date(startsAt.value).toUTCString()
  let ends = new Date(endsAt.value).toUTCString()

  const event = {
    title: project.value.title,
    body: body.value,
    startsAt: starts,
    endsAt: ends
  }

  try {
    await createEvent({ input: event })
    save()
  } catch (e) {
    alert(e)
  }
}
</script>
