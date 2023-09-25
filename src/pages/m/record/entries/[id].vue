<template>
  <div id="element" class="flex h-screen max-h-screen w-full flex-col">
    <MPageHeader />
    <template v-if="!fetching && data?.entry">
      <MEntryForm v-model="entryData" />
    </template>
    <div v-else class="flex-1 divide-y divide-neutral-200 overflow-scroll text-sm">
      <div class="h-screen" />
    </div>
    <MPageFooter>
      <button
        @click="saveEntry"
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 px-8 py-2.5 text-center text-sm text-white"
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
import MEntryForm from "@/components/mobile/m-entry-form.vue";
import { useRoute } from "vue-router/auto";
import entryByIdQuery from "@/queries/entryById";
import updateEntryMutation from "@/queries/updateEntry.mutation";
import { useMutation, useQuery } from "@urql/vue";
import { computed, ref } from "vue";
import { useRefHistory } from "@vueuse/core";

const route = useRoute("/m/record/entries/[id]");

const { data, fetching } = useQuery({
  query: entryByIdQuery,
  variables: {
    id: route.params.id,
  },
});

const entryData = computed(() => {
  return data.value?.entry || {};
});

const { history, clear } = useRefHistory(entryData, { deep: true, flush: "sync" });
const hasChanged = computed(() => history.value.length > 2);
const loading = ref(false);

const { executeMutation: updateEntry } = useMutation(updateEntryMutation);

async function saveEntry() {
  if (!hasChanged.value) return;
  loading.value = true;

  const entry = data.value?.entry;

  const res = await update(entry);

  loading.value = false;

  if (res.error) return;

  clear();
}

function userCompetences(entry: any): { error: boolean; uCs: any[] } {
  const eACs = [];

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
      eACs.push({
        userId: user.id,
        competenceId: competence.id,
        level: competence.level || 0,
      });
    }
  }

  return {
    error: false,
    uCs: eACs,
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
    id: entry.id,
    date: entry.date,
    body: entry.body,
    tagIds,
    eventIds,
    userIds,
    userCompetences: uCs,
  };

  const res = await updateEntry({ input });
  return res;
}
</script>

<style scoped>
#element {
  max-height: -webkit-fill-available;
  max-height: -moz-available;
  max-height: fill-available;
  max-height: 100dvh;
}
</style>
