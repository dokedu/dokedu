<template>
  <div class="flex h-full justify-between">
    <div class="w-full">
      <EntryFormHeader :mode="mode" @submit="submit" @archive="archive" />
      <textarea
        ref="textarea"
        v-model="body"
        placeholder="Write down your observations..."
        class="block w-full resize-none border-none border-transparent p-8 text-lg text-gray-900 placeholder:text-gray-400 focus:ring-0"
      />
      <div class="px-8" v-if="false">
        <button class="flex items-center gap-2 rounded-md border p-4 py-1.5 shadow-sm transition-all hover:shadow">
          <Upload :size="16" /> Upload file
        </button>
      </div>
      <EntryFormCompetences :eacs="entry.userCompetences" @toggle="toggleCompetence" />
    </div>
    <div class="flex min-h-full w-[400px] min-w-[400px] flex-col gap-4 border-l px-8 py-4">
      <div class="flex items-center gap-4">
        <label for="date" class="min-w-[64px] text-gray-500">Datum</label>
        <input
          v-model="formattedDate"
          type="date"
          name="date"
          id="date"
          class="w-full rounded-md border-none transition-all hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-black"
        />
      </div>
      <div class="flex gap-4">
        <label for="date" class="mt-2 min-w-[64px] text-gray-500">Projects</label>
        <div class="w-full">
          <d-context-menu
            :show="contextMenuEvents"
            @close="contextMenuEvents = false"
            :alignment="ContextMenuAlignment.Overlay"
          >
            <div class="flex flex-col gap-1 px-1 py-2">
              <div
                v-for="event in events?.events?.edges"
                :key="event.id"
                @click="toggleEvent(event)"
                class="flex w-full items-center justify-between rounded-md p-1 hover:bg-gray-100"
              >
                <div class="px-1 py-0.5 text-gray-700">{{ event.title }}</div>
                <svg
                  v-show="entry?.events?.length > 0 && entry?.events.map((el) => el.id).includes(event.id)"
                  class="stroke-gray-700"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.3327 8L9.99935 15.3333L6.66602 12"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </d-context-menu>
          <div
            class="flex w-full flex-wrap items-start gap-2 rounded-md p-2 hover:bg-gray-50"
            @click="contextMenuEvents = true"
          >
            <div v-for="event in entry?.events" class="rounded-full border px-3 py-1 text-gray-700">
              {{ event.title }}
            </div>
            <div v-if="entry.events?.length === 0 || entry.events === undefined" class="text-gray-400">Add project</div>
          </div>
        </div>
      </div>
      <div class="flex gap-4">
        <label for="date" class="mt-2 min-w-[64px] text-gray-500">Labels</label>
        <div class="w-full">
          <d-context-menu
            :show="tagsContextMenuOpen"
            @close="tagsContextMenuOpen = false"
            :alignment="ContextMenuAlignment.Overlay"
          >
            <div class="flex flex-col gap-1 px-1 py-2">
              <div
                v-for="tag in tags?.tags"
                :key="tag.id"
                @click="toggleTag(tag)"
                class="flex w-full items-center justify-between rounded-md p-1 hover:bg-gray-100"
              >
                <d-tag :color="tag.color">
                  {{ tag.name }}
                </d-tag>
                <svg
                  v-show="entry?.tags?.length > 0 && entry?.tags.map((el) => el.id).includes(tag.id)"
                  class="stroke-gray-700"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.3327 8L9.99935 15.3333L6.66602 12"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </d-context-menu>
          <div
            class="flex w-full flex-wrap items-start gap-2 rounded-md p-2 hover:bg-gray-50"
            @click="tagsContextMenuOpen = true"
          >
            <d-tag v-for="tag in entry.tags" :key="tag.id" :color="tag.color">
              {{ tag.name }}
            </d-tag>
            <div v-if="entry.tags?.length === 0" class="text-gray-400">Add label</div>
          </div>
        </div>
      </div>
      <div>
        <header class="mb-2 flex items-center justify-between">
          <div class="text-gray-500">Students</div>
          <div class="rounded-md p-1 hover:bg-gray-100" @click="dialogStudents.showModal()">
            <Plus :size="20" class="stroke-gray-500" />
          </div>
        </header>
        <div class="mb-2">
          <div
            v-for="student in entry?.users"
            class="flex w-full select-none items-center justify-between gap-2 rounded-lg px-1 py-1 text-gray-700 hover:bg-gray-50"
          >
            <div class="flex items-center gap-2">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 p-1 text-xs uppercase text-gray-500"
              >
                {{ `${student.firstName[0]}${student.lastName[0]}` }}
              </div>
              <span>{{ `${student.firstName} ${student.lastName}` }}</span>
            </div>
            <div class="rounded-md p-1 hover:bg-gray-100" @click="toggleStudent(student)">
              <X :size="20" class="stroke-gray-500" />
            </div>
          </div>
        </div>
        <div
          class="flex w-fit select-none items-center gap-2 rounded-md p-1 hover:bg-gray-100"
          @click="dialogStudents.showModal()"
        >
          <div class="rounded-md">
            <Plus :size="20" class="stroke-gray-500" />
          </div>
          <span class="pr-2 text-gray-500">Add student</span>
        </div>
      </div>
    </div>
    <dialog ref="dialogStudents" class="mt-32 w-full max-w-xl rounded-lg shadow-lg backdrop:bg-gray-950/20">
      <div class="mb-4 flex items-center justify-between gap-2">
        <input
          type="text"
          name="student-search"
          id="student-search"
          placeholder="Search students"
          class="w-full rounded-md border border-gray-200 px-3 py-1.5 shadow-sm outline-none placeholder:text-gray-400 focus:border-gray-200 focus:ring-0"
        />
        <div class="rounded-md p-1 hover:bg-gray-100" @click="dialogStudents.close()">
          <X class="stroke-gray-500" />
        </div>
      </div>
      <div>
        <div class="mb-2 text-sm uppercase text-gray-500">Students</div>
        <div class="flex flex-col gap-1">
          <div
            v-for="student in students?.users?.edges"
            class="w-full select-none rounded-lg px-2 py-1 text-gray-700 hover:bg-gray-50"
            @click="toggleStudent(student)"
          >
            {{ `${student.firstName} ${student.lastName}` }}
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>
<script setup lang="ts">
import DTag from "../../../components/d-tag/d-tag.vue";
import DContextMenu, { ContextMenuAlignment } from "../../../components/d-context-menu/d-context-menu.vue";
import { gql, useMutation, useQuery } from "@urql/vue";
import tagQuery from "../../../queries/tags";
import { computed, ref, toRef } from "vue";
import archiveEntryMutation from "../../../queries/archiveEntry.mutation.ts";
import { formatDate, useTextareaAutosize } from "@vueuse/core";
import EntryFormHeader from "./EntryFormHeader.vue";
import { Plus, Upload, X } from "lucide-vue-next";
import EntryFormCompetences from "./EntryFormCompetences.vue";

interface Tag {
  id: string;
  name: string;
  color: string;
}
interface Entry {
  id: string;
  date: string;
  body: string;
  createdAt: string;
  tags: Tag[];
  events: [{ id: string; title: string }];
  users: [{ id: string; firstName: string; lastName: string }];
  userCompetences: [{ id: string; competence: { id: string; name: string } }];
}

const dialogStudents = ref<HTMLDialogElement>();

const props = defineProps<{
  entry: Entry;
  mode: "new" | "edit";
}>();

const { data: tags } = useQuery({
  query: tagQuery,
});

const { data: students } = useQuery({
  query: gql`
    query {
      users(filter: { role: [student] }) {
        edges {
          id
          firstName
          lastName
        }
      }
    }
  `,
});

const { data: events } = useQuery({
  query: gql`
    query events {
      events {
        edges {
          id
          title
        }
      }
    }
  `,
});

const entry = toRef(props, "entry");
const tagsContextMenuOpen = ref(false);
const contextMenuEvents = ref(false);

const { textarea, input: body } = useTextareaAutosize({ input: entry.value.body });

const { executeMutation: archiveEntryMut } = useMutation(archiveEntryMutation);

function toggleTag(tag: Tag) {
  // if entry.tags is undefined, create empty array
  if (!entry.value.tags) {
    entry.value.tags = [];
  }

  // create new tag and add it to entry.tags if it doesn't exist
  if (!entry.value.tags.map((el) => el.id).includes(tag.id)) {
    entry.value.tags.push(tag);
  } else {
    // remove tag from entry.tags if it exists
    entry.value.tags = entry.value.tags.filter((el) => el.id !== tag.id);
  }
}

function toggleStudent(student: { id: string }) {
  // if entry.users is undefined, create empty array
  if (!entry.value.users) {
    entry.value.users = [];
  }

  // create new student and add it to entry.users if it doesn't exist
  if (!entry.value.users.map((el) => el.id).includes(student.id)) {
    entry.value.users.push(student);
  } else {
    // remove student from entry.users if it exists
    entry.value.users = entry.value.users.filter((el) => el.id !== student.id);
  }
}

function toggleEvent(event) {
  // if entry.events is undefined, create empty array
  if (!entry.value.events) {
    entry.value.events = [];
  }

  // create new event and add it to entry.events if it doesn't exist
  if (!entry.value.events.map((el) => el.id).includes(event.id)) {
    entry.value.events.push(event);
  } else {
    // remove event from entry.events if it exists
    entry.value.events = entry.value.events.filter((el) => el.id !== event.id);
  }
}

const { executeMutation: createEntry } = useMutation(gql`
  mutation createEntry($input: CreateEntryInput!) {
    createEntry(input: $input) {
      id
      date
      body
      createdAt
    }
  }
`);

const { executeMutation: updateEntry } = useMutation(gql`
  mutation updateEntry($input: UpdateEntryInput!) {
    updateEntry(input: $input) {
      id
      date
      body
      createdAt
      tags {
        id
        name
        color
      }
    }
  }
`);

const formattedDate = computed({
  get() {
    const date = new Date(entry.value.date);
    return formatDate(date, "YYYY-MM-DD");
  },
  set(value: string) {
    entry.value.date = value;
  },
});

async function archive() {
  await archiveEntryMut({ id: entry.value.id });
  await emit("archived");
}

function toggleCompetence(competence) {
  console.log(competence);
  if (competence.type !== "competence") return;

  // if entry.userCompetences is undefined, create empty array
  if (!entry.value.userCompetences) {
    entry.value.userCompetences = [];
  }

  // create new competence and add it to entry.userCompetences if it doesn't exist
  if (!entry.value.userCompetences.map((el) => el.competence.id).includes(competence.id)) {
    entry.value.userCompetences.push({ competence: competence, level: 1 });
  } else {
    // remove competence from entry.userCompetences if it exists
    entry.value.userCompetences = entry.value.userCompetences.filter((el) => el.competence.id !== competence.id);
  }
}

// emits
const emit = defineEmits(["saved", "archived"]);

function userCompetences() {
  const competences = entry.value.userCompetences?.map((el) => ({
    competenceId: el.competence.id,
    level: 1,
  }));

  return competences?.filter((v, i, a) => a.findIndex((t) => t.competenceId === v.competenceId) === i);
}

async function submit() {
  const EACs = userCompetences();

  const input: any = {
    date: entry.value.date,
    body: body.value,
    tags: entry.value.tags?.map((el) => el.id),
    events: entry.value.events?.map((el) => el.id),
    users: entry.value.users?.map((el) => el.id),
    userCompetences: EACs,
  };

  if (props.mode === "edit") {
    input["id"] = entry.value.id;
    await updateEntry({ input });
    emit("saved");
    return;
  }

  const { data } = await createEntry({ input });
  // TODO: handle error

  // emit saved event
  emit("saved", data?.createEntry);
}
</script>
