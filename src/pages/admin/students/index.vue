<template>
  <PageWrapper>
    <PageHeader class="justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-stone-950">{{ $t("student", 2) }}</div>
        <input
          v-model="search"
          type="text"
          name="search"
          id="search"
          :placeholder="$t('search')"
          class="h-8 rounded-md border border-stone-100 text-sm text-strong outline-none ring-0 transition-all placeholder:text-subtle focus:border-stone-200 focus:shadow-sm focus:ring-0"
        />
      </div>
      <RouterLink :to="{ name: 'admin-students-new' }">
        <DButton type="primary" size="md" :icon-left="Plus">Add student</DButton>
      </RouterLink>
    </PageHeader>
    <div class="flex w-full items-start gap-3 border-b border-stone-100 px-8 py-3 text-sm">
      <div class="flex w-[200px] items-center gap-1 text-muted">
        <div @click="sortBy('firstName')">First Name</div>
        <ArrowDown
          v-if="currentSort == UserOrderBy.FirstNameAsc || currentSort == UserOrderBy.FirstNameDesc"
          class="h-4 w-4 transition-all ease-in-out"
          :class="currentSort == UserOrderBy.FirstNameAsc ? 'rotate-180' : 'rotate-0'"
        />
      </div>
      <div class="flex flex-1 items-center gap-1 text-muted">
        <div @click="sortBy('lastName')">Last Name</div>
        <ArrowDown
          v-if="currentSort == UserOrderBy.LastNameAsc || currentSort == UserOrderBy.LastNameDesc"
          class="h-4 w-4 transition-all ease-in-out"
          :class="currentSort == UserOrderBy.LastNameAsc ? 'rotate-180' : 'rotate-0'"
        />
      </div>
      <div class="flex w-[200px] items-center gap-1 text-muted">Grade</div>
      <div class="flex w-[100px] items-center gap-1 text-muted">Birthday</div>
    </div>
    <div class="flex flex-col overflow-scroll" ref="adminStudentContainer">
      <router-link
        :to="{ name: 'admin-students-student', params: { id: student.id } }"
        v-for="student in studentData"
        class="flex gap-3 border-b border-stone-100 px-8 py-2 transition-all hover:bg-stone-50"
      >
        <div class="line-clamp-1 w-[200px] text-sm text-strong">{{ student.firstName }}</div>
        <div class="line-clamp-1 flex-1 text-sm text-strong">{{ student.lastName }}</div>
        <div class="line-clamp-1 w-[200px] text-sm font-medium text-strong">
          {{ student.student?.grade }}
        </div>
        <div v-if="student.student?.birthday" class="line-clamp-1 w-[100px] text-sm font-medium text-strong">
          {{ formatDate(new Date(Date.parse(student?.student.birthday as string)), "DD.MM.YYYY") }}
        </div>
        <div v-else class="w-[100px] text-sm font-medium text-strong">-</div>
      </router-link>
    </div>
    <div v-if="loading" class="flex flex-col overflow-scroll">
      <div
        v-for="i in 25"
        :key="i"
        class="flex h-9 min-h-[36px] animate-pulse items-center gap-4 border-b border-stone-100 px-8"
      >
        <div class="h-2.5 w-20 rounded-full bg-stone-200"></div>
        <div class="h-2.5 w-20 rounded-full bg-stone-200"></div>
      </div>
    </div>
  </PageWrapper>
  <router-view />
</template>
<script setup lang="ts">
import DButton from "@/components/d-button/d-button.vue";
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import { Plus } from "lucide-vue-next";
import { computed, ref, reactive, watch } from "vue";
import { gql, useQuery } from "@urql/vue";
import { formatDate } from "@vueuse/core";
import { ArrowDown } from "lucide-vue-next";
import { UserOrderBy, User } from "@/gql/graphql";
import { useInfiniteScroll } from "@vueuse/core";

const search = ref("");
const offset = ref(0);
const adminStudentContainer = ref<HTMLElement | null>(null);
const currentSort = ref<UserOrderBy>(UserOrderBy.LastNameAsc);
const studentData = ref<User[]>([]);

const sortColumns = reactive<{ [key: string]: { [key: string]: UserOrderBy } }>({
  firstName: {
    asc: UserOrderBy.FirstNameAsc,
    desc: UserOrderBy.FirstNameDesc,
  },
  lastName: {
    asc: UserOrderBy.LastNameAsc,
    desc: UserOrderBy.LastNameDesc,
  },
});

function sortBy(column: string) {
  if (currentSort.value === sortColumns[column].asc) {
    currentSort.value = sortColumns[column].desc;
  } else {
    currentSort.value = sortColumns[column].asc;
  }
}
const loading = computed(() => {
  return fetching && !data.value;
});

const { data, fetching } = useQuery({
  query: gql`
    query adminStudents($search: String, $order: UserOrderBy, $offset: Int) {
      users(filter: { role: [student], orderBy: $order }, search: $search, offset: $offset) {
        totalCount
        edges {
          id
          firstName
          lastName
          student {
            id
            birthday
            grade
          }
        }
      }
    }
  `,
  variables: reactive({
    search: search,
    order: currentSort,
    offset,
  }),
});

useInfiniteScroll(
  adminStudentContainer,
  () => {
    if (fetching.value) return;
    if (!data.value?.users?.edges) return;
    if (!studentData.value.length) return;
    if (Number(data.value?.users?.totalCount) < 50) return;
    if (studentData.value.length >= Number(data.value?.users?.totalCount)) return;
    offset.value += 50;
  },
  { distance: 500 }
);

watch(data, () => {
  if (fetching.value) return;
  if (!data.value?.users?.edges) return;
  studentData.value.push(...data.value?.users?.edges);
});

watch([search, currentSort], () => {
  offset.value = 0;
  studentData.value = [];
});
</script>
```
