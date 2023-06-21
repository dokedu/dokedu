<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-stone-950">{{ $t("project", 2) }}</div>
        <input
          v-model="search"
          type="text"
          name="search"
          id="search"
          :placeholder="$t('search')"
          class="h-8 rounded-md border border-stone-100 text-sm text-strong outline-none ring-0 transition-all placeholder:text-subtle focus:border-stone-200 focus:shadow-sm focus:ring-0"
        />
      </div>
      <div class="flex gap-2">
        <DButton
          :type="filtersOpen ? 'outline' : 'transparent'"
          size="md"
          :icon-left="ListFilter"
          @click="toggleFilters"
          >{{ $t("filter") }}</DButton
        >
        <router-link :to="{ name: 'record-projects-export' }">
          <d-button type="transparent" :icon-left="Share">{{ $t("export") }}</d-button>
        </router-link>
        <router-link :to="{ name: 'record-projects-new' }">
          <d-button type="primary" :icon-left="Plus"> {{ $t("new") }} </d-button>
        </router-link>
      </div>
    </PageHeader>
    <div v-if="filtersOpen" class="flex items-end gap-2 border-b border-stone-100 px-8 py-2">
      <div>
        <label for="starts" class="mb-1 block text-xs font-medium leading-6 text-stone-900">{{
          $t("starts_at")
        }}</label>
        <input
          v-model="startsAt"
          class="block w-full select-none rounded-md border-0 py-2 text-sm text-stone-900 shadow-sm ring-1 ring-inset ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-black"
          type="datetime-local"
          name="starts"
          id="starts"
        />
      </div>
      <div>
        <label for="ends" class="mb-1 block text-xs font-medium leading-6 text-stone-900">{{ $t("ends_at") }}</label>
        <input
          v-model="endsAt"
          class="block w-full select-none rounded-md border-0 py-2 text-sm text-stone-900 shadow-sm ring-1 ring-inset ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-black"
          type="datetime-local"
          name="ends"
          id="ends"
        />
      </div>
    </div>
    <div class="flex flex-col overflow-scroll" ref="events">
      <router-link
        :to="{ name: 'record-projects-project', params: { id: event.id } }"
        v-for="event in (eventData as Event[])"
        class="flex border-b border-stone-100 text-sm transition-all hover:bg-stone-50"
        :class="{
          '!bg-stone-100': event?.id === $route.params.id,
        }"
      >
        <div class="w-2/6 p-2 pl-8 text-strong">{{ event.title }}</div>
        <div class="w-3/6 p-2 pl-8 text-subtle">{{ event.body?.slice(0, 50) }}...</div>
        <div class="w-2/6 p-2 px-4 text-subtle">
          {{ formatDate(new Date(Date.parse(event.startsAt)), "DD.MM.YYYY") }} -
          {{ formatDate(new Date(Date.parse(event.endsAt)), "DD.MM.YYYY") }}
        </div>
      </router-link>
    </div>
  </PageWrapper>
  <router-view />
</template>
<script setup lang="ts">
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import { useQuery } from "@urql/vue";
import { formatDate } from "@vueuse/core";
import DButton from "../../../components/d-button/d-button.vue";
import { Plus } from "lucide-vue-next";
import { Share } from "lucide-vue-next";
import { reactive, ref, computed, watch } from "vue";
import { graphql } from "../../../gql";
import { Event } from "@/gql/graphql";
import { ListFilter } from "lucide-vue-next";
import { useInfiniteScroll } from "@vueuse/core";

const search = ref("");
const filtersOpen = ref(false);
const startsAt = ref();
const endsAt = ref();
const offset = ref(0);
const events = ref<HTMLElement>();
const eventData = ref<Event[]>([]);

const startTimestamp = computed(() => startsAt.value && new Date(startsAt.value).toISOString());
const endsTimestamp = computed(() => endsAt.value && new Date(endsAt.value).toISOString());

function toggleFilters() {
  filtersOpen.value = !filtersOpen.value;
}

useInfiniteScroll(
  events,
  () => {
    if (fetching.value) return;
    if (!data.value?.events?.edges) return;
    if (Number(data.value?.events?.totalCount) < 50) return;
    if (eventData.value?.length >= Number(data.value?.events?.totalCount)) return;
    console.log("Here");
    offset.value += 50;
  },
  { distance: 500 }
);

const { data, fetching } = useQuery({
  query: graphql(`
    query eventWithSearch($search: String, $offset: Int, $filter: EventFilterInput) {
      events(search: $search, limit: 50, offset: $offset, filter: $filter) {
        totalCount
        edges {
          id
          title
          body
          createdAt
          startsAt
          endsAt
        }
      }
    }
  `),
  variables: reactive({
    search,
    offset,
    filter: { from: startTimestamp, to: endsTimestamp },
  }),
});

watch(data, () => {
  if (fetching.value) return;
  if (!data.value?.events?.edges) return;

  // @ts-expect-error
  eventData.value.push(...data.value?.events?.edges);
});

watch([search, startTimestamp, endsTimestamp], () => {
  offset.value = 0;
});
</script>
