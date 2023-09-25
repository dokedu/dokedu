<template>
  <div class="text-sm">
    <header class="mb-2 flex items-center justify-between">
      <div class="text-neutral-500">{{ $t("student", 2) }}</div>
      <div class="rounded-md p-1 hover:bg-neutral-100" @click="dialogStudents.showModal()">
        <Plus :size="20" class="stroke-neutral-500" />
      </div>
    </header>
    <div class="mb-2">
      <div v-for="student in entry?.users"
        class="flex w-full select-none items-center justify-between gap-2 rounded-lg px-1 py-1 text-neutral-700 hover:bg-neutral-50">
        <div class="flex items-center gap-2">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 p-1 text-xs uppercase text-neutral-500">
            {{ `${student.firstName[0]}${student.lastName[0]}` }}
          </div>
          <span>{{ `${student.firstName} ${student.lastName}` }}</span>
        </div>
        <div class="rounded-md p-1 hover:bg-neutral-100" @click="toggleStudent(student)">
          <X :size="20" class="stroke-neutral-500" />
        </div>
      </div>
    </div>
    <div class="flex w-fit select-none items-center gap-2 rounded-md p-1 hover:bg-neutral-100"
      @click="dialogStudents.showModal()">
      <div class="rounded-md">
        <Plus :size="20" class="stroke-neutral-500" />
      </div>
      <span class="pr-2 text-neutral-500">{{ $t("add_student") }}</span>
    </div>
  </div>
  <dialog ref="dialogStudents"
    class="mt-32 h-fit w-[36rem] max-h-[36rem] max-w-xl rounded-lg p-0 text-sm shadow-sm drop-shadow-lg backdrop:bg-neutral-950/20 border border-neutral-200">
    <div ref="innerDialog" class="flex flex-col h-full max-h-[36rem]">
      <div>
        <div class="flex border-b border-neutral-200 items-center justify-between gap-2">
          <input type="text" v-model="search" name="student-search" id="student-search"
            :placeholder="$t('search_students')"
            class="w-full rounded-md border-none px-3 py-3 text-sm outline-none placeholder:text-neutral-400 focus:ring-0" />
        </div>
      </div>
      <div class="flex flex-1 flex-col overflow-auto">
        <div>
          <div class="flex h-full flex-1 flex-col gap-1">
            <div class="divide-y divide-neutral-100">
              <div v-for="student in students?.users?.edges" :key="student?.id" @click="toggleStudent(student as User)"
                class="text-neutral-700 hover:bg-neutral-100 transition-all grid grid-cols-4 px-4 py-2" :class="{
                  'bg-neutral-100 hover:bg-neutral-200': entry.users?.some((el) => el.id === student?.id),
                }" :style="{ gridTemplateColumns: '2fr 2fr 1fr 2rem' }">
                <div class="text-neutral-900">{{ student?.firstName }}</div>
                <div class="text-neutral-900">{{ student?.lastName }}</div>
                <div class="text-neutral-900">{{ student?.student?.grade }}</div>
                <div class="text-neutral-900 pr-3 text-right flex justify-end items-center">
                  <Check v-if="entry.users?.some((el) => el.id === student?.id)" :size="16" />
                </div>
              </div>
              <div v-show="students?.users.edges === null" class="text-neutral-500 px-4 py-2">
                No students found
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import { useQuery } from "@urql/vue";
import { Plus, X, Check } from "lucide-vue-next";
import { reactive, ref, toRef } from "vue";
import { graphql } from "@/gql";
import { Entry, User } from "@/gql/graphql";
import { onClickOutside, onKeyStroke } from "@vueuse/core";

const dialogStudents = ref();
const innerDialog = ref();
const search = ref();

const props = defineProps<{
  entry: Partial<Entry>;
}>();

onClickOutside(innerDialog, () => {
  if (!dialogStudents.value) return;
  dialogStudents.value.close()
});

onKeyStroke("Escape", () => {
  if (!dialogStudents.value) return;
  dialogStudents.value.close();
});

const { data: students } = useQuery({
  query: graphql(`
    query userss($search: String) {
      users(filter: { role: [student], orderBy: lastNameAsc }, search: $search, limit: 1000) {
        edges {
          id
          firstName
          lastName
          student {
            id
            grade
          }
        }
      }
    }
  `),
  variables: reactive({
    search: search,
  }),
});

const entry = toRef(props, "entry");

function toggleStudent(student: User) {
  // if entry.users is undefined, create empty array
  if (!entry.value.users) {
    entry.value.users = [];
  }

  // create new student and add it to entry.users if it doesn't exist
  if (!entry.value.users.map((el) => el.id).includes(student.id)) {
    entry.value.users.push(student);
  } else {
    // remove student from entry.users if it exists
    entry.value.users = entry.value.users.filter((el) => el.id !== student.id);
  }
}
</script>
