<template>
  <div>
    <div class="mb-4 select-none text-sm font-medium text-strong">Project</div>
    <div class="mb-4 flex flex-col gap-2">
      <div class="flex min-h-[8rem] w-full items-center justify-start rounded-lg bg-stone-100">
        <div class="mx-auto text-center">
          <Image class="mx-auto mb-1 stroke-stone-300" :size="48" :stroke-width="1" />
          <div class="select-none text-center text-xs text-stone-500">
            Add a cover image <br />
            by clicking or dropping a file
          </div>
        </div>
      </div>
      <input
        v-model="project.title"
        class="block w-full select-none rounded-md border-0 py-2 text-sm text-stone-900 shadow-sm ring-1 ring-inset ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-black"
        type="text"
        name="name"
        id="name"
        placeholder="Name of the project"
        required
      />
      <textarea
        ref="textarea"
        v-model="body"
        class="block min-h-[6rem] w-full select-none resize-none rounded-md border-0 py-2 text-sm text-stone-900 shadow-sm ring-1 ring-inset ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-black"
        name="description"
        id="description"
        cols="30"
        rows="3"
        placeholder="Think of some magical description"
        required
      />
      <div>
        <label for="starts" class="mb-1 block text-xs font-medium leading-6 text-stone-900">Starts at</label>
        <input
          v-model="startsAt"
          class="block w-full select-none rounded-md border-0 py-2 text-sm text-stone-900 shadow-sm ring-1 ring-inset ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-black"
          type="datetime-local"
          name="starts"
          id="starts"
          required
        />
      </div>
      <div>
        <label for="ends" class="mb-1 block text-xs font-medium leading-6 text-stone-900">Ends at</label>
        <input
          v-model="endsAt"
          class="block w-full select-none rounded-md border-0 py-2 text-sm text-stone-900 shadow-sm ring-1 ring-inset ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-black"
          type="datetime-local"
          name="ends"
          id="ends"
          required
        />
      </div>
    </div>
    <div class="flex justify-between">
      <div class="flex gap-2">
        <d-button type="outline" @click="cancel">Cancel</d-button>
        <d-button v-if="project.id" type="outline" :icon-left="Trash" @click="trash">Delete</d-button>
      </div>
      <d-button v-if="!project.id" type="primary" :icon-left="Plus" @click="create">Create</d-button>
      <d-button v-if="project.id" type="primary" :icon-left="Save" @click="update">Save</d-button>
    </div>
    <div class="mt-4 select-none" v-if="project.competences && project.competences.length > 0">
      <div class="mb-1 text-sm text-strong">Competences</div>
      <d-competence v-for="competence in project.competences" :key="competence.id" :competence="competence" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import dButton from "../../../components/d-button/d-button.vue";
import { Plus, Image } from "lucide-vue-next";
import { graphql } from "../../../gql";
import { computed, ref, toRef } from "vue";
import { useMutation } from "@urql/vue";
import { useTextareaAutosize } from "@vueuse/core";
import { Event } from "../../../gql/graphql";
import { Save } from "lucide-vue-next";
import DCompetence from "../../../components/d-competence/d-competence.vue";
import { Trash } from "lucide-vue-next";

export interface Props {
  project: Partial<Event>;
}

const props = defineProps<Props>();

const project = toRef(props, "project");
const startsAt = computed({
  get: () => project.value.startsAt.slice(0, 16),
  set: (value) => (project.value.startsAt = value),
});
const endsAt = computed({
  get: () => project.value.endsAt.slice(0, 16),
  set: (value) => (project.value.endsAt = value),
});

const emit = defineEmits(["cancel"]);

function cancel() {
  emit("cancel");
}

const { textarea, input: body } = useTextareaAutosize({
  input: project.value.body,
});

async function trash() {
  await archiveEvent({
    id: project.value.id as string,
  });
  cancel();
}

// archiveEvent(id: ID!): Event!
const { executeMutation: archiveEvent } = useMutation(
  graphql(`
    mutation archiveEvent($id: ID!) {
      archiveEvent(id: $id) {
        id
      }
    }
  `)
);

const { executeMutation: createEvent } = useMutation(
  graphql(`
    mutation createEvent($input: CreateEventInput!) {
      createEvent(input: $input) {
        id
        title
        image {
          id
        }
        body
        startsAt
        endsAt
        recurrence
        createdAt
      }
    }
  `)
);

const { executeMutation: updateEvent } = useMutation(
  graphql(`
    mutation updateEvent($input: UpdateEventInput!) {
      updateEvent(input: $input) {
        id
        title
        image {
          id
        }
        body
        startsAt
        endsAt
        recurrence
        createdAt
      }
    }
  `)
);

async function update() {
  if (!project.value.title) {
    alert("Please provide a title");
    return;
  }

  if (!body.value) {
    alert("Please provide a description");
    return;
  }

  if (!startsAt.value) {
    alert("Please provide a start date");
    return;
  }

  if (!endsAt.value) {
    alert("Please provide an end date");
    return;
  }

  const starts = new Date(startsAt.value).toISOString();
  const ends = new Date(endsAt.value).toISOString();

  const event = {
    id: project.value.id as string,
    title: project.value.title,
    body: body.value,
    startsAt: starts,
    endsAt: ends,
  };

  try {
    await updateEvent({ input: event });
    cancel();
  } catch (e) {
    alert(e);
  }
}

async function create() {
  if (!project.value.title) {
    alert("Please provide a title");
    return;
  }

  if (!body.value) {
    alert("Please provide a description");
    return;
  }

  if (!startsAt.value) {
    alert("Please provide a start date");
    return;
  }

  if (!endsAt.value) {
    alert("Please provide an end date");
    return;
  }

  const starts = new Date(startsAt.value).toISOString();
  const ends = new Date(endsAt.value).toISOString();

  const event = {
    title: project.value.title,
    body: body.value,
    startsAt: starts,
    endsAt: ends,
  };

  try {
    await createEvent({ input: event });
    await cancel();
  } catch (e) {
    alert(e);
  }
}
</script>
