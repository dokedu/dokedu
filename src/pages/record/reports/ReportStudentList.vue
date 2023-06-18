<template>
  <div class="flex items-center gap-2">
    <div class="w-20 text-sm font-medium text-strong">Students</div>
    <div class="w-full">
      <DContextMenu
        :show="contextMenuOpen"
        @close="contextMenuOpen = false"
        :alignment="ContextMenuAlignment.Overlay"
        class="max-h-[150px] overflow-y-auto p-1"
      >
        <div class="flex w-full flex-col items-start rounded-md">
          <div
            @click="selectStudent(student as User)"
            v-for="student in data?.users?.edges"
            class="flex w-full cursor-pointer items-center justify-between p-1 hover:bg-stone-100"
          >
            <div class="text-sm">{{ student?.firstName }} {{ student?.lastName }}</div>
            <Check v-show="selectedStudent?.id === student?.id" class="h-4 w-4"></Check>
          </div>
        </div>
      </DContextMenu>
      <div
        class="flex w-full flex-wrap items-start gap-2 rounded-md p-2 hover:bg-stone-50"
        @click="contextMenuOpen = true"
      >
        <div v-if="selectedStudent" class="text-sm text-strong">
          {{ selectedStudent.firstName }} {{ selectedStudent.lastName }}
        </div>
        <div v-else class="text-sm text-subtle">Select students</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DContextMenu from "@/components/d-context-menu/d-context-menu.vue";
import { ContextMenuAlignment } from "@/components/d-context-menu/d-context-menu.vue";
import { ref } from "vue";
import { useQuery } from "@urql/vue";
import { graphql } from "@/gql";
import { Check } from "lucide-vue-next";
import { User } from "@/gql/graphql";

const emit = defineEmits(["update"]);

const contextMenuOpen = ref(false);
const selectedStudent = ref<User>();

const { data } = useQuery({
  query: graphql(`
    query students {
      users(filter: { role: [student] }) {
        edges {
          id
          firstName
          lastName
          student {
            id
          }
        }
      }
    }
  `),
});

function selectStudent(student: User) {
  selectedStudent.value = student;
  emit("update", selectedStudent.value);
}
</script>
