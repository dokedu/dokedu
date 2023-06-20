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
    <div v-if="filtersOpen" class="flex items-start gap-2 border-b border-stone-100 px-8 py-2">
      <DFilter :options="studentOptions" :label="$t('student')" v-model="student"></DFilter>
      <DFilter :options="teacherOptions" :label="$t('teacher')" v-model="teacher"></DFilter>
      <DFilter :options="tagOptions" :label="$t('tag', 2)" multiple v-model="tags">
        <div class="flex flex-wrap gap-2">
          <DTag v-for="tag in tags" :key="tag" :color="getTagColor(tag)" removable :id="tag" @remove="removeTag">
            {{ getTagName(tag) }}
          </DTag>
        </div>
      </DFilter>
    </div>
    <div class="flex w-full items-start gap-3 border-b border-stone-100 py-3 text-sm">
      <div class="flex flex-1 items-center pl-8 text-muted">
        <div>Description</div>
      </div>
      <div class="w-[200px] text-right text-muted">Date</div>
      <div class="w-[220px] pr-8 text-right text-muted">Created at</div>
    </div>
    <div class="flex flex-col overflow-scroll" ref="el">
      <router-link
        :to="{ name: 'record-entries-entry', params: { id: entry.id } }"
        v-for="entry in entryData"
        class="flex items-center border-b border-stone-100 text-sm text-strong transition-all hover:bg-stone-50"
      >
        <div class="line-clamp-1 h-[2rem] flex-1 p-2 pl-8">{{ entry.body }}</div>
        <div class="w-[200px] p-2 text-right text-subtle">{{ dateOnly(entry.date) }}</div>
        <div class="flex w-[220px] items-center justify-end gap-2 p-2 pr-8 text-right text-subtle">
          <div>
            {{ dateOnly(entry.createdAt) }}
          </div>
          <div
            :title="`${entry.user?.firstName} ${entry.user?.lastName}`"
            class="h-8 w-8 rounded-full"
            :class="`bg-subtle`"
          >
            <div class="flex h-full w-full items-center justify-center">
              <div class="text-xs font-bold text-subtle">
                {{ entry.user?.firstName[0] }}{{ entry.user?.lastName[0] }}
              </div>
            </div>
          </div>
        </div>
      </router-link>
      <div
        v-if="!data?.entries?.edges || data?.entries?.edges.length === 0"
        class="select-none px-8 py-4 text-sm text-default"
      >
        {{ $t("entry_placeholder") }}
      </div>
    </div>
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
import { Entry } from "@/gql/graphql";
import { useI18n } from "vue-i18n";
import { useInfiniteScroll } from "@vueuse/core";
import { watch } from "vue";

const i18nLocale = useI18n();

const student = ref();
const teacher = ref();
const tags = ref([]);

const offset = ref(0);
const el = ref<HTMLElement>();

useInfiniteScroll(
  el,
  () => {
    if (fetching.value) return;
    if (Number(data.value?.entries?.totalCount) < 50) return;
    if (entryData.value.length >= Number(data.value?.entries?.totalCount)) return;
    offset.value += 50;
  },
  { distance: 500 }
);

const { data, fetching } = useQuery({
  query: graphql(`
    query getEntries($filter: EntryFilterInput, $limit: Int, $offset: Int) {
      entries(filter: $filter, limit: $limit, offset: $offset) {
        totalCount
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
        }
      }
    }
  `),
  variables: reactive({
    filter: {
      users: student,
      authors: teacher,
      tags: tags,
    },
    offset,
  }),
});

const entryData = ref<Entry[]>([]);

watch(data, () => {
  if (fetching.value) return;
  // @ts-expect-error
  entryData.value.push(...data.value?.entries?.edges);
});

const { data: studentData } = useQuery({
  query: graphql(`
    query getEntryFilterStudents {
      users(filter: { role: [student] }) {
        edges {
          id
          firstName
          lastName
        }
      }
    }
  `),
});

const { data: teacherData } = useQuery({
  query: graphql(`
    query getEntryFilterTeachers {
      users(filter: { role: [owner, admin, teacher, educator] }) {
        edges {
          id
          firstName
          lastName
        }
      }
    }
  `),
});

const { data: tagData } = useQuery({
  query: graphql(`
    query getEntryFilterTags {
      tags {
        id
        name
        color
      }
    }
  `),
});

const studentOptions = computed(
  () =>
    studentData?.value?.users?.edges?.map((edge: any) => ({
      label: `${edge.firstName} ${edge.lastName}`,
      value: edge.id,
    })) || []
);

const teacherOptions = computed(
  () =>
    teacherData?.value?.users?.edges?.map((edge: any) => ({
      label: `${edge.firstName} ${edge.lastName}`,
      value: edge.id,
    })) || []
);

const tagOptions = computed(
  () =>
    tagData?.value?.tags?.map((edge: any) => ({
      label: edge.name,
      value: edge.id,
    })) || []
);

function getTagColor(id: string) {
  return tagData?.value?.tags?.find((e: any) => e.id === id)?.color || "gray";
}

function getTagName(id: string) {
  return tagData?.value?.tags?.find((e: any) => e.id === id)?.name || "gray";
}

function removeTag(id: string) {
  tags.value = tags.value.filter((e) => e !== id);
}

function dateOnly(date: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
  };
  return new Date(date).toLocaleDateString(i18nLocale.locale.value, options);
}

const filtersOpen = ref(false);
function toggleFilters() {
  filtersOpen.value = !filtersOpen.value;
}
</script>
