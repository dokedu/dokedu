<template>
  <div id="element" class="flex w-full flex-col">
    <MPageHeader />
    <div ref="el" class="flex-1 divide-y divide-neutral-200 overflow-scroll text-sm">
      <template v-for="result in results">
        <router-link
          v-for="entry in result.data?.entries.edges"
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
      </template>
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
import { MGetEntriesDocument, useMGetEntriesQuery } from "@/gql/queries/entries/mGetEntries"
import { useCreateEntryDraftMutation } from "@/gql/mutations/entries/createEntryDraft"
import { EntrySortBy } from "@/gql/schema"
import { useInfiniteScroll } from "@vueuse/core"
import { ref } from "vue"
import { urqlClient } from "@/main"

const { executeMutation: createEntryDraft } = useCreateEntryDraftMutation()

const el = ref<HTMLElement | null>(null)

const offset = ref(0)
const hasNextPage = ref(true)

const results = ref([
  useMGetEntriesQuery({
    variables: {
      order: EntrySortBy.CreatedAtDesc,
      limit: 10,
      offset: offset.value
    }
  })
])

useInfiniteScroll(
  el,
  async () => {
    if (!hasNextPage.value) return
    offset.value += 10
    // load more
    const res = await urqlClient.executeQuery({
      query: MGetEntriesDocument,
      key: Math.random(),
      variables: {
        order: EntrySortBy.CreatedAtDesc,
        limit: 10,
        offset: offset.value
      }
    })
    hasNextPage.value = res.data.entries.pageInfo.hasNextPage
    results.value.push(res)
  },
  { distance: 2 }
)

const router = useRouter()

async function createEntry() {
  const { data } = await createEntryDraft({})

  await router.push({ name: "/m/record/entries/[id]", params: { id: data?.createEntry?.id as string } })
}

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
