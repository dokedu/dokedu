<template>
  <div id="element" class="flex w-full flex-col">
    <MPageHeader />
    <div class="flex-1 divide-y divide-neutral-200 overflow-scroll text-sm">
      <router-link
        v-for="entry in data?.entries.edges"
        :to="{ name: '/m/record/entries/[id]', params: { id: `${entry?.id}` } }"
        class="flex flex-col gap-2 p-4 text-neutral-700"
      >
        <div class="line-clamp-3">
          {{ entry?.body }}
        </div>
        <div class="flex gap-1 text-xs text-neutral-500">
          <div>{{ `${entry?.user.firstName} ${entry?.user.lastName}` }}</div>
          <div>⋅</div>
          <div>{{ toLocateDateString(entry?.createdAt) }}</div>
        </div>
      </router-link>
      <div class="flex flex-col gap-2 p-4 text-center text-xs text-neutral-500">
        <div class="mx-auto max-w-xs">
          Im Moment zeigen wir nur die letzten 10 Einträge. Demnächst kannst du alle Einträge auf deinem Smartphone
          sehen.
        </div>
      </div>
    </div>
    <MPageFooter>
      <div
        @click="createEntry"
        class="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 px-8 py-2.5 text-center text-sm text-white"
      >
        <Plus :size="18" />
        <div>Eintrag erstellen</div>
      </div>
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
import MPageHeader from "@/components/mobile/m-page-header.vue"
import MPageFooter from "@/components/mobile/m-page-footer.vue"
import { Plus } from "lucide-vue-next"
import { useRouter } from "vue-router/auto"
import { useMGetEntriesQuery } from "@/gql/queries/entries/mGetEntries"
import { useCreateEntryDraftMutation } from "@/gql/mutations/entries/createEntryDraft"
import { EntrySortBy } from "@/gql/schema"

const { executeMutation: createEntryDraft } = useCreateEntryDraftMutation()

const router = useRouter()

async function createEntry() {
  const { data } = await createEntryDraft({})

  await router.push({ name: "/m/record/entries/[id]", params: { id: data?.createEntry?.id as string } })
}

const { data } = useMGetEntriesQuery({
  variables: {
    order: EntrySortBy.CreatedAtDesc,
    limit: 10
  }
})

function toLocateDateString(date: string) {
  return new Date(date).toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  })
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
