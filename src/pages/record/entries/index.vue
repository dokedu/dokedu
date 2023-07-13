<template>
  <PageWrapper>
    <PageHeader>
      <div class="w-full">
        <div class="flex items-center justify-between">
          <div class="font-medium text-strong">{{ $t("entry", 2) }}</div>
          <div class="flex gap-2">
            <DButton
              :type="filtersOpen ? 'outline' : 'transparent'"
              size="md"
              :icon-left="ListFilter"
              @click="toggleFilters"
              >{{ $t("filter") }}</DButton
            >
            <router-link :to="{ name: 'record-entries-new' }">
              <DButton type="primary" size="md" :icon-left="Plus">{{ $t("new") }}</DButton>
            </router-link>
          </div>
        </div>
      </div>
    </PageHeader>
    <div v-if="filtersOpen" class="flex items-end gap-2 border-b border-stone-100 px-8 py-2">
      <DSelect
        :options="studentOptions"
        :label="$t('student')"
        v-model:search="studentSearch"
        v-model="student"
      ></DSelect>
      <DFilter :options="teacherOptions" :label="$t('teacher')" v-model="teacher"></DFilter>
      <DFilter :options="tagOptions" :label="$t('tag', 2)" multiple v-model="tags">
        <div class="flex flex-wrap gap-2">
          <DTag v-for="tag in tags" :key="tag" :color="getTagColor(tag)" removable :id="tag" @remove="removeTag">
            {{ getTagName(tag) }}
          </DTag>
        </div>
      </DFilter>
    </div>

    <DTable
      v-model:variables="pageVariables"
      :columns="columns"
      objectName="entries"
      :query="entriesQuery"
      defaultSort="createdAt"
      @row-click="goToEntry"
      :watchers="[student, teacher, tags]"
    >
      <template #body-data="{ column, item }">
        <div class="flex h-full w-full items-center justify-between gap-2">
          <div class="truncate">{{ column }}</div>
          <div class="overflow-hiden flex items-center justify-end gap-1">
            <div v-if="item.events?.length > 3">
              <DTag color="neutral" class="w-1/4 p-2">{{ item.events?.length }} {{ $t("project", 2) }} </DTag>
            </div>
            <div v-else v-for="event in item.events" class="flex gap-1">
              <div
                @click.stop="goToProject(event.id)"
                class="line-clamp-1 inline-flex h-7 max-w-[120px] items-center gap-1.5 text-ellipsis whitespace-nowrap rounded-full border bg-default px-3 py-1 transition-all duration-150 ease-linear hover:max-w-[250px] hover:bg-subtle"
              >
                <LayoutGrid class="stroke-subtle w-4 min-w-[16px]" />
                <div class="flex-1 overflow-hidden text-ellipsis">
                  {{ event.title }}
                </div>
              </div>
            </div>
            <div v-if="item.tags.length > 5">
              <DTag color="neutral" class="w-1/4 p-2">{{ item.tags.length }} {{ $t("label", 2) }}</DTag>
            </div>
            <div v-else v-for="tag in item.tags" class="flex gap-1">
              <DTag :color="tag.color" class="w-1/4 p-2">{{ tag.name }}</DTag>
            </div>
          </div>
        </div>
      </template>
      <template #date-data="{ column }">
        <div class="flex h-full items-center">
          {{ dateOnly(column) }}
        </div>
      </template>
      <template #createdAt-data="{ column, item }">
        <div class="flex items-center gap-2">
          <div>
            {{ dateOnly(column) }}
          </div>

          <div
            :title="`${item.user?.firstName} ${item.user?.lastName}`"
            class="h-8 w-8 rounded-full"
            :class="`bg-subtle`"
          >
            <div class="flex h-full w-full items-center justify-center">
              <div class="text-xs font-bold text-subtle">{{ item.user?.firstName[0] }}{{ item.user?.lastName[0] }}</div>
            </div>
          </div>
        </div>
      </template>
    </DTable>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import { useQuery } from "@urql/vue";
import DButton from "../../../components/d-button/d-button.vue";
import { Plus } from "lucide-vue-next";
import { ListFilter } from "lucide-vue-next";
import { ref, computed, reactive } from "vue";
import DFilter from "@/components/d-filter/d-filter.vue";
import { graphql } from "@/gql";
import DTag from "@/components/d-tag/d-tag.vue";
import { useI18n } from "vue-i18n";
import { watch } from "vue";
import { LayoutGrid } from "lucide-vue-next";
import { EntrySortBy } from "@/gql/graphql";
import DTable from "@/components/d-table/d-table.vue";
import { useRouter } from "vue-router";
import { PageVariables } from "@/types/types";
import DSelect from "@/components/d-select/d-select.vue";

const i18nLocale = useI18n();
const router = useRouter();

const student = ref();
const teacher = ref();
const tags = ref<string[]>([]);

interface Variables extends PageVariables {
  filter: {
    users?: string;
    authors?: string;
    tags?: string[];
  };
}

const columns = [
  {
    key: "body",
    label: "description",
    width: 0.6,
  },
  {
    key: "date",
    label: "date",
    sortable: {
      asc: EntrySortBy.DateAsc,
      desc: EntrySortBy.DateDesc,
    },
  },
  {
    key: "createdAt",
    label: "created_at",
    sortable: {
      asc: EntrySortBy.CreatedAtAsc,
      desc: EntrySortBy.CreatedAtDesc,
    },
  },
];

const goToEntry = <Type extends { id: string }>(row: Type) => {
  router.push({ name: "record-entries-entry", params: { id: row.id } });
};

const goToProject = (id: string) => {
  router.push({ name: "record-projects-project", params: { id } });
};

const pageVariables = ref<Variables[]>([
  {
    filter: {
      users: student.value,
      authors: teacher.value,
      tags: tags.value,
    },
    limit: 30,
    order: EntrySortBy.CreatedAtDesc,
    offset: 0,
    nextPage: undefined,
  },
]);

watch([student, teacher, tags], () => {
  // Get last page
  const lastPage = pageVariables.value[pageVariables.value.length - 1];
  pageVariables.value = [
    {
      filter: {
        users: student.value,
        authors: teacher.value,
        tags: tags.value,
      },
      limit: 30,
      order: lastPage.order,
      offset: 0,
      nextPage: undefined,
    },
  ];
});

const entriesQuery = graphql(`
  query getEntries($filter: EntryFilterInput, $limit: Int, $order: EntrySortBy, $offset: Int) {
    entries(filter: $filter, limit: $limit, sortBy: $order, offset: $offset) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        id
        date
        body
        user {
          id
          firstName
          lastName
        }
        createdAt
        events {
          id
          title
        }
        tags {
          id
          name
          color
        }
      }
    }
  }
`);

const teacherSearch = ref(null);
const { data: teacherData } = useQuery({
  query: graphql(`
    query getEntryFilterTeachers($search: String) {
      users(filter: { role: [owner, admin, teacher, educator] }, limit: 500, search: $search) {
        edges {
          id
          firstName
          lastName
        }
      }
    }
  `),
  variables: reactive({
    search: teacherSearch,
  }),
});

const studentSearch = ref("");
const { data: studentData } = useQuery({
  query: graphql(`
    query getEntryFilterStudents($search: String) {
      users(filter: { role: [student] }, limit: 150, search: $search) {
        edges {
          id
          firstName
          lastName
        }
      }
    }
  `),
  variables: reactive({
    search: studentSearch,
  }),
});

const { data: tagData } = useQuery({
  query: graphql(`
    query getEntryFilterTags {
      tags(limit: 1000) {
        edges {
          id
          name
          color
        }
      }
    }
  `),
});

const teacherOptions = computed(
  () =>
    teacherData?.value?.users?.edges?.map((edge: any) => ({
      label: `${edge.firstName} ${edge.lastName}`,
      value: edge.id,
    })) || []
);

const studentOptions = computed(
  () =>
    studentData?.value?.users?.edges?.map((edge: any) => ({
      label: `${edge.firstName} ${edge.lastName}`,
      value: edge.id,
    })) || []
);

const tagOptions = computed(
  () =>
    tagData?.value?.tags?.edges?.map((edge: any) => ({
      label: edge.name,
      value: edge.id,
    })) || []
);

function getTagColor(id: string) {
  return tagData?.value?.tags?.edges?.find((e: any) => e.id === id)?.color || "gray";
}

function getTagName(id: string) {
  return tagData?.value?.tags?.edges?.find((e: any) => e.id === id)?.name || "gray";
}

function removeTag(id: string) {
  tags.value = tags.value.filter((e) => e !== id);
}

function dateOnly(date: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  return new Date(date).toLocaleDateString(i18nLocale.locale.value, options);
}

const filtersOpen = ref(false);
function toggleFilters() {
  filtersOpen.value = !filtersOpen.value;
}
</script>
