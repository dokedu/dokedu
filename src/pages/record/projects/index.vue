<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-neutral-950">{{ $t("project", 2) }}</div>
        <input
          v-model="search"
          type="text"
          name="search"
          id="search"
          :placeholder="$t('search')"
          class="h-8 rounded-md border border-neutral-100 text-sm text-strong outline-none ring-0 transition-all placeholder:text-subtle focus:border-neutral-200 focus:shadow-sm focus:ring-0"
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
        <router-link :to="{ name: '/record/projects/export' }">
          <d-button type="transparent" :icon-left="Share">{{ $t("export") }}</d-button>
        </router-link>
        <router-link :to="{ name: '/record/projects/new' }">
          <d-button type="primary" :icon-left="Plus"> {{ $t("new") }} </d-button>
        </router-link>
      </div>
    </PageHeader>
    <div v-if="filtersOpen" class="flex items-end gap-2 border-b border-neutral-100 px-8 py-2">
      <div>
        <label for="starts" class="mb-1 block text-xs font-medium leading-6 text-neutral-900">{{
          $t("starts_at")
        }}</label>
        <input
          v-model="startsAt"
          class="block w-full select-none rounded-md border-0 py-2 text-sm text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-950"
          type="datetime-local"
          name="starts"
          id="starts"
        />
      </div>
      <div>
        <label for="ends" class="mb-1 block text-xs font-medium leading-6 text-neutral-900">{{ $t("ends_at") }}</label>
        <input
          v-model="endsAt"
          class="block w-full select-none rounded-md border-0 py-2 text-sm text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-950"
          type="datetime-local"
          name="ends"
          id="ends"
        />
      </div>
    </div>
    <DTable
      v-model:variables="pageVariables"
      :columns="columns"
      objectName="events"
      :query="eventsQuery"
      defaultSort="startsAt"
      @row-click="onRowClick"
    >
      <template #body-data="{ column }">
        <div class="truncate text-subtle">{{ column }}</div>
      </template>
      <template #startsAt-data="{ column }">
        <div class="text-subtle">{{ formatDate(new Date(Date.parse(column)), "DD.MM.YYYY") }}</div>
      </template>
      <template #endsAt-data="{ column }">
        <div class="text-subtle">{{ formatDate(new Date(Date.parse(column)), "DD.MM.YYYY") }}</div>
      </template>
    </DTable>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageHeader from "@/components/page-header.vue";
import PageWrapper from "@/components/page-wrapper.vue";
import { formatDate, onClickOutside, onKeyStroke } from "@vueuse/core";
import DButton from "@/components/d-button/d-button.vue";
import { Plus } from "lucide-vue-next";
import { Share } from "lucide-vue-next";
import { ref, computed, watch } from "vue";
import { graphql } from "@/gql";
import { ListFilter } from "lucide-vue-next";
import DTable from "@/components/d-table/d-table.vue";
import { useRouter } from "vue-router/auto";
import type { PageVariables } from "@/types/types.ts";
import { EventOrderBy } from "@/gql/graphql.ts";

const sheet = ref<HTMLElement | null>(null);

onClickOutside(sheet, async () => {
  await router.push({ name: "/record/projects/" });
});

onKeyStroke("Escape", async () => {
  await router.push({ name: "/record/projects/" });
});

const search = ref("");
const filtersOpen = ref(false);
const startsAt = ref();
const endsAt = ref();
const router = useRouter();

const startTimestamp = computed(() => startsAt.value && new Date(startsAt.value).toISOString());
const endsTimestamp = computed(() => endsAt.value && new Date(endsAt.value).toISOString());

function toggleFilters() {
  filtersOpen.value = !filtersOpen.value;
}

interface Variables extends PageVariables {
  filter: {
    from?: string;
    to?: string;
  };
}

const columns = [
  {
    label: "title",
    key: "title",
  },
  {
    label: "description",
    key: "body",
  },
  {
    label: "starts_at",
    key: "startsAt",
    sortable: {
      asc: EventOrderBy.StartsAtAsc,
      desc: EventOrderBy.StartsAtDesc,
    },
  },
  {
    label: "ends_at",
    key: "endsAt",
    sortable: {
      asc: EventOrderBy.EndsAtAsc,
      desc: EventOrderBy.EndsAtDesc,
    },
  },
];

const pageVariables = ref<Variables[]>([
  {
    filter: {
      from: undefined,
      to: undefined,
    },
    search: "",
    order: EventOrderBy.StartsAtAsc,
    limit: 50,
    offset: 0,
    nextPage: undefined,
  },
]);

const onRowClick = (row: Record<string, string>) => {
  // router.push({ name: "record-projects-project-inline", params: { id: row.id } });
  router.push({ name: "/record/projects/[id]", params: { id: row.id } });
};

watch([search, startTimestamp, endsTimestamp], () => {
  const lastPage = pageVariables.value[pageVariables.value.length - 1];
  pageVariables.value = [
    {
      filter: {
        from: startTimestamp.value,
        to: endsTimestamp.value,
      },
      search: search.value,
      order: lastPage.order,
      limit: 50,
      offset: 0,
      nextPage: undefined,
    },
  ];
});

const eventsQuery = graphql(`
  query eventWithSearch($search: String, $offset: Int, $order: EventOrderBy, $filter: EventFilterInput) {
    events(search: $search, limit: 50, offset: $offset, order: $order, filter: $filter) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
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
`);
</script>
