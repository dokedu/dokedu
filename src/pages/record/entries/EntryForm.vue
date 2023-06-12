<template>
  <div class="flex h-full justify-between">
    <div class="flex h-full max-h-full w-full flex-col">
      <EntryFormHeader :mode="mode" @submit="submit" @archive="archive" />
      <div class="pb-8">
        <div class="overflow-scroll">
          <textarea
            ref="textarea"
            v-model="body"
            placeholder="Write down your observations..."
            class="block w-full resize-none border-none border-transparent p-8 text-lg text-stone-900 placeholder:text-stone-400 focus:ring-0"
          />
        </div>
        <EntryFormCompetences :entry="entry" />
      </div>
    </div>
    <div class="flex min-h-full w-[400px] min-w-[400px] flex-col gap-4 border-l border-stone-100 px-8 py-4">
      <div class="flex items-center gap-4">
        <label for="date" class="min-w-[64px] text-sm text-stone-500">Datum</label>
        <input
          v-model="formattedDate"
          type="date"
          name="date"
          id="date"
          class="w-full rounded-md border-none text-sm transition-all hover:bg-stone-50 focus:bg-stone-100 focus:ring-2 focus:ring-black"
        />
      </div>
      <EntryFormProjects :entry="entry" />
      <EntryFormLabels :entry="entry" />
      <EntryFormStudents :entry="entry" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { gql, useMutation } from "@urql/vue";
import { computed, toRef } from "vue";
import archiveEntryMutation from "../../../queries/archiveEntry.mutation.ts";
import { formatDate, useTextareaAutosize } from "@vueuse/core";
import EntryFormHeader from "./EntryFormHeader.vue";
import EntryFormCompetences from "./EntryFormCompetences.vue";
import { Entry } from "../../../gql/graphql";
import EntryFormProjects from "./EntryFormProjects.vue";
import EntryFormLabels from "./EntryFormLabels.vue";
import EntryFormStudents from "./EntryFormStudents.vue";

const props = defineProps<{
  entry: Partial<Entry>;
  mode: "new" | "edit";
}>();

const entry = toRef(props, "entry");

const { textarea, input: body } = useTextareaAutosize({ input: entry.value.body });

const { executeMutation: archiveEntryMut } = useMutation(archiveEntryMutation);

const { executeMutation: createEntry } = useMutation(gql`
  mutation createEntry($input: CreateEntryInput!) {
    createEntry(input: $input) {
      id
      date
      body
      deletedAt
      user {
        id
        firstName
        lastName
      }
      createdAt
      tags {
        id
        name
        color
      }
      events {
        id
        title
      }
      users {
        id
        firstName
        lastName
      }
      userCompetences {
        id
        level
        competence {
          id
          name
          color
          type
        }
      }
    }
  }
`);

const { executeMutation: updateEntry } = useMutation(gql`
  mutation updateEntry($input: UpdateEntryInput!) {
    updateEntry(input: $input) {
      id
      date
      body
      deletedAt
      user {
        id
        firstName
        lastName
      }
      createdAt
      tags {
        id
        name
        color
      }
      events {
        id
        title
      }
      users {
        id
        firstName
        lastName
      }
      userCompetences {
        id
        level
        competence {
          id
          name
          color
          type
        }
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
  emit("archived");
}

// emits
const emit = defineEmits(["saved", "archived"]);

function userCompetences(): { error: boolean; eacs: any[] } {
  const eacs = [];

  const userCount = entry.value.users?.length || 0;
  const userCompetenceCount = entry.value.userCompetences?.length || 0;

  if (userCompetenceCount === 0) {
    return { error: false, eacs: [] };
  }

  if (userCount === 0 && userCompetenceCount > 0) {
    alert("You must select at least one student.");
    return { error: true, eacs: [] };
  }

  const uniqueCompetences: { id: string; level: number }[] = [];
  for (const userCompetence of entry.value.userCompetences || []) {
    if (!uniqueCompetences.map((el) => el.id).includes(userCompetence.competence.id)) {
      uniqueCompetences.push({
        id: userCompetence.competence.id,
        level: userCompetence.level || 0,
      });
    }
  }

  for (const competence of uniqueCompetences) {
    for (const user of entry.value.users) {
      eacs.push({
        userId: user.id,
        competenceId: competence.id,
        level: competence.level || 0,
      });
    }
  }

  return {
    error: false,
    eacs,
  };
}

async function submit() {
  if (props.mode === "edit") {
    await update();
  } else {
    await create();
  }
}

async function update() {
  const { error, eacs } = userCompetences();
  if (error) return;

  const input: any = {
    date: entry.value.date,
    body: body.value,
    tagIds: entry.value.tags?.map((el) => el.id),
    eventIds: entry.value.events?.map((el) => el.id),
    userIds: entry.value.users?.map((el) => el.id),
    userCompetences: eacs,
  };

  input["id"] = entry.value.id;
  await updateEntry({ input });
  emit("saved");
  return true;
}

async function create() {
  const { error, eacs } = userCompetences();
  if (error) return;

  const input: any = {
    date: entry.value.date,
    body: body.value,
    tagIds: entry.value.tags?.map((el) => el.id),
    eventIds: entry.value.events?.map((el) => el.id),
    userIds: entry.value.users?.map((el) => el.id),
    userCompetences: eacs,
  };

  const { data } = await createEntry({ input });
  emit("saved", data?.createEntry);
}
</script>
