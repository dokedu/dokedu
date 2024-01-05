<template>
  <div class="flex items-center gap-2">
    <div class="w-20 text-sm font-medium text-strong">{{ $t("student", 2) }}</div>
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
            class="flex w-full cursor-pointer items-center justify-between p-1 hover:bg-neutral-100"
          >
            <div class="text-sm">{{ student?.firstName }} {{ student?.lastName }}</div>
            <Check v-show="selectedStudent?.id === student?.id" class="h-4 w-4"></Check>
          </div>
        </div>
      </DContextMenu>
      <div
        class="flex w-full flex-wrap items-start gap-2 rounded-md p-2 hover:bg-neutral-50"
        @click="contextMenuOpen = true"
      >
        <div v-if="selectedStudent" class="text-sm text-strong">
          {{ selectedStudent.firstName }} {{ selectedStudent.lastName }}
        </div>
        <div v-else class="text-sm text-subtle">{{ $t("select_students") }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DContextMenu from "@/components/d-context-menu/d-context-menu.vue";
import { ContextMenuAlignment } from "@/components/d-context-menu/d-context-menu.vue";
import { ref } from "vue";
import { Check } from "lucide-vue-next";
import { useStudentsQuery } from "@/gql/queries/users/students.ts";
import { User } from "@/gql/schema.ts";

const emit = defineEmits(["update"]);

const contextMenuOpen = ref(false);
const selectedStudent = ref<User>();

const { data } = useStudentsQuery({});
function selectStudent(student: User) {
  selectedStudent.value = student;
  emit("update", selectedStudent.value);
}
</script>
