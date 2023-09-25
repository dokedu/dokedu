<template>
  <div class="px-2 py-4">
    <div class="mb-1 px-2 text-neutral-500">Schüler</div>
    <div class="mb-2 flex flex-col gap-2 px-2">
      <div
        v-for="student in students"
        class="flex items-center justify-between rounded-lg border border-neutral-200 px-2 py-1"
      >
        <div>{{ fullName(student) }}</div>
        <div class="rounded-md p-1 hover:bg-neutral-100" @click="toggleStudent(student)">
          <X :size="20" class="stroke-neutral-500" />
        </div>
      </div>
    </div>
    <button
      type="button"
      @click="addStudent"
      class="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-neutral-500"
    >
      <Plus :size="18" />
      Schüler hinzufügen
    </button>
    <template v-if="sheetOpen">
      <MSheet @close="sheetOpen = false">
        <div class="p-2 text-sm">
          <d-input v-model="search" type="text" name="search" id="search" placeholder="Search student" />
          <div class="mt-3 flex flex-col gap-2 overflow-scroll pb-4" :style="{ maxHeight: sheetHeight + 'px' }">
            <div
              v-for="student in data?.users.edges"
              class="flex items-center justify-between rounded-lg border border-neutral-200 px-2 py-2"
              @click="toggleStudent(student)"
            >
              <div>{{ fullName(student) }}</div>
              <div class="rounded-md hover:bg-neutral-100">
                <Check v-if="activeStudent(student)" :size="20" class="stroke-neutral-500" />
              </div>
            </div>
          </div>
        </div>
      </MSheet>
    </template>
  </div>
</template>

<script lang="ts" setup>
import MSheet from "@/components/mobile/m-sheet.vue";
import DInput from "@/components/d-input/d-input.vue";
import { useVModel, useWindowSize } from "@vueuse/core";
import { Plus, X, Check } from "lucide-vue-next";
import { computed, reactive, ref } from "vue";
import { graphql } from "@/gql";
import { useQuery } from "@urql/vue";

const search = ref("");
const sheetOpen = ref(false);

const { height } = useWindowSize();
const sheetHeight = computed(() => height.value - 125);

function addStudent() {
  sheetOpen.value = true;
}

const props = defineProps<{
  modelValue: any;
}>();
const emit = defineEmits(["update:modelValue"]);

const students = useVModel(props, "modelValue", emit);

const { data } = useQuery({
  query: graphql(`
    query users($search: String) {
      users(filter: { role: [student], orderBy: lastNameAsc }, search: $search, limit: 1000) {
        edges {
          id
          firstName
          lastName
        }
      }
    }
  `),
  variables: reactive({ search }),
});

function toggleStudent(student: any) {
  if (students.value.find((p: any) => p.id === student.id)) {
    students.value = students.value.filter((p: any) => p.id !== student.id);
  } else {
    students.value = [...students.value, student];
  }
}

function activeStudent(student: any) {
  return students.value.find((p: any) => p.id === student.id);
}

function fullName(student: any) {
  return `${student.firstName} ${student.lastName}`;
}
</script>
