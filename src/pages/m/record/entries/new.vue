<template>
  <div id="element" class="flex max-h-screen w-full flex-col">
    <MPageHeader />
    <MEntryForm v-model="entry" />
    <MPageFooter>
      <button
        @click="saveEntry"
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-8 py-2.5 text-center text-sm text-white"
        :class="{ 'opacity-50': !hasChanged }"
      >
        <div v-if="!loading">Speichern</div>
        <div v-else>Loading</div>
      </button>
    </MPageFooter>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "layout": "mobile",
    "app": "record"
  }
}
</route>

<script lang="ts" setup>
import MPageHeader from "@/components/mobile/m-page-header.vue";
import MPageFooter from "@/components/mobile/m-page-footer.vue";
import MEntryForm from "@/components/MEntryForm.vue";
import { computed, ref } from "vue";
import { useRefHistory } from "@vueuse/core";
import createEntryMutation from "@/queries/createEntry.mutation";
import { useMutation } from "@urql/vue";
import { useRouter } from "vue-router/auto";

const router = useRouter();

const entry = ref({
  date: new Date().toISOString().substr(0, 10),
  body: "",
  tags: [],
  events: [],
  users: [],
  userCompetences: [],
});

const { executeMutation: createEntry } = useMutation(createEntryMutation);

const { history, clear } = useRefHistory(entry, { deep: true, flush: "sync" });
const hasChanged = computed(() => history.value.length > 2);
const loading = ref(false);

async function saveEntry() {
  if (!hasChanged.value) return;

  loading.value = true;

  const res = await update(entry.value);

  loading.value = false;

  if (res.error) return;

  clear();

  await router.push({ name: "/m/record/entries/" });
}

function userCompetences(entry: any): { error: boolean; uCs: any[] } {
  const eacs = [];

  const userCount = entry.users?.length || 0;
  const userCompetenceCount = entry.userCompetences?.length || 0;

  if (userCompetenceCount === 0) {
    return { error: false, uCs: [] };
  }

  if (userCount === 0 && userCompetenceCount > 0) {
    alert("You must select at least one student.");
    return { error: true, uCs: [] };
  }

  const unique: { id: string; level: number }[] = [];
  for (const userCompetence of entry.userCompetences || []) {
    if (!unique.map((el) => el.id).includes(userCompetence.competence.id)) {
      unique.push({
        id: userCompetence.competence.id,
        level: userCompetence.level || 0,
      });
    }
  }

  for (const competence of unique) {
    for (const user of entry.users) {
      eacs.push({
        userId: user.id,
        competenceId: competence.id,
        level: competence.level || 0,
      });
    }
  }

  return {
    error: false,
    uCs: eacs,
  };
}

async function update(entry: any) {
  const { uCs, error } = userCompetences(entry);
  if (error) {
    return { error: true };
  }

  const tagIds = entry.tags.map((el: any) => el.id);
  const eventIds = entry.events.map((el: any) => el.id);
  const userIds = entry.users.map((el: any) => el.id);

  const input: any = {
    date: entry.date,
    body: entry.body,
    tagIds,
    eventIds,
    userIds,
    userCompetences: uCs,
  };

  const res = await createEntry({ input });
  return res;
}
</script>

<style scoped>
#element {
  height: 100%;
  height: -moz-available; /* WebKit-based browsers will ignore this. */
  height: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
  height: fill-available;
}
</style>
