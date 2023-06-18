<template>
  <PageWrapper>
    <PageHeader>
      <div class="w-full">
        <div class="flex items-center justify-between">
          <div class="font-medium text-strong">Entries</div>
          <div class="flex gap-2">
            <DButton
              :type="filtersOpen ? 'outline' : 'transparent'"
              size="md"
              :icon-left="ListFilter"
              @click="toggleFilters"
              >Filter</DButton
            >
            <router-link :to="{ name: 'record-entries-new' }">
              <DButton type="primary" size="md" :icon-left="Plus">New</DButton>
            </router-link>
          </div>
        </div>
      </div>
    </PageHeader>
    <div v-if="filtersOpen" class="flex items-start gap-2 border-b border-stone-100 px-8 py-2">
      <DFilter :options="studentOptions" label="Student" v-model="student"></DFilter>
      <DFilter :options="teacherOptions" label="Teacher" v-model="teacher"></DFilter>
      <DFilter :options="tagOptions" label="Tags" multiple v-model="tags">
        <div class="flex flex-wrap gap-2">
          <DTag v-for="tag in tags" :key="tag" :color="getTagColor(tag)" removable :id="tag" @remove="removeTag">
            {{ getTagName(tag) }}
          </DTag>
        </div>
      </DFilter>
    </div>
    <div class="flex flex-col overflow-scroll">
      <router-link
        :to="{ name: 'record-entries-entry', params: { id: entry.id } }"
        v-for="entry in data?.entries?.edges"
        class="flex border-b border-stone-100 text-sm text-strong transition-all hover:bg-stone-50"
      >
        <div class="line-clamp-1 h-[2rem] w-full p-2 pl-8">{{ entry.body }}</div>
        <div class="w-[200px] p-2 text-right text-subtle">{{ dateOnly(entry.date) }}</div>
        <div class="w-[400px] p-2 pr-8 text-right text-subtle">
          {{ `${entry.user.firstName} ${entry.user.lastName}` }}
        </div>
      </router-link>
      <div
        v-if="!data?.entries?.edges || data?.entries?.edges.length === 0"
        class="select-none px-8 py-4 text-sm text-default"
      >
        You can create your first entry by clicking the "New" button above.
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

const student = ref();
const teacher = ref();
const tags = ref([]);

const { data } = useQuery({
  query: graphql(`
    query getEntries($filter: EntryFilterInput, $limit: Int, $offset: Int) {
      entries(filter: $filter, limit: $limit, offset: $offset) {
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
  }),
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
  return new Date(date).toLocaleDateString("de-DE", options);
}

const filtersOpen = ref(false);
function toggleFilters() {
  filtersOpen.value = !filtersOpen.value;
}
</script>
