<template>
  <div class="flex h-full justify-between">
    <div class="flex h-full max-h-full w-full flex-col">
      <EntryFormHeader :mode="mode" @submit="submit" @archive="archive" />
      <div class="mx-auto h-full w-full max-w-4xl overflow-scroll pb-8">
        <div>
          <textarea
            ref="textarea"
            v-model="body"
            :placeholder="$t('entry_create_placeholder')"
            class="block w-full resize-none border-none border-transparent p-8 text-base text-stone-900 placeholder:text-stone-400 focus:ring-0"
          />
        </div>
        <EntryFormCompetences :entry="entry" />
      </div>
    </div>
    <div
      class="flex min-h-full w-[400px] min-w-[400px] flex-col gap-4 overflow-auto border-l border-stone-100 px-8 py-4"
    >
      <div class="flex items-center gap-4">
        <label for="date" class="min-w-[64px] text-sm text-stone-500">{{ $t("date") }}</label>
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
import { useMutation } from "@urql/vue";
import { computed, toRef } from "vue";
import archiveEntryMutation from "@/queries/archiveEntry.mutation";
import { formatDate, useTextareaAutosize } from "@vueuse/core";
import EntryFormHeader from "./EntryFormHeader.vue";
import EntryFormCompetences from "./EntryFormCompetences.vue";
import { Entry } from "@/gql/graphql";
import EntryFormProjects from "./EntryFormProjects.vue";
import EntryFormLabels from "./EntryFormLabels.vue";
import EntryFormStudents from "./EntryFormStudents.vue";
import { createNotification } from "@/composables/useToast";
import { Save } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import updateEntryMutation from "@/queries/updateEntry.mutation";
import createEntryMutation from "@/queries/createEntry.mutation";

const t = useI18n().t;

const props = defineProps<{
  entry: Partial<Entry>;
  mode: "new" | "edit";
}>();

const entry = toRef(props, "entry");

// @ts-expect-error
const { textarea, input: body } = useTextareaAutosize({ input: entry.value.body });

const { executeMutation: createEntry } = useMutation(createEntryMutation);
const { executeMutation: updateEntry } = useMutation(updateEntryMutation);
const { executeMutation: archiveEntryMut } = useMutation(archiveEntryMutation);

const formattedDate = computed({
  get() {
    // @ts-expect-error
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
    // @ts-expect-error
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
  let error: boolean;
  if (props.mode === "edit") {
    error = await update();
  } else {
    error = await create();
  }

  if (error) return;
  createNotification({
    title: t("entry") + (props.mode === "edit" ? ` ${t("updated")}` : ` ${t("created")}`),
    description: t("saved_successfully"),
    icon: Save,
  });
}

async function update() {
  const { error, eacs } = userCompetences();
  if (error) return true;

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
  return false;
}

async function create() {
  const { error, eacs } = userCompetences();
  if (error) return true;

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
  return false;
}
</script>
