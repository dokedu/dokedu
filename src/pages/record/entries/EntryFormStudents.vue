<template>
    <div>
        <header class="mb-2 flex items-center justify-between">
            <div class="text-stone-500">Students</div>
            <div class="rounded-md p-1 hover:bg-stone-100" @click="dialogStudents.showModal()">
                <Plus :size="20" class="stroke-stone-500" />
            </div>
        </header>
        <div class="mb-2">
            <div v-for="student in entry?.users"
                class="flex w-full select-none items-center justify-between gap-2 rounded-lg px-1 py-1 text-stone-700 hover:bg-stone-50">
                <div class="flex items-center gap-2">
                    <div
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 p-1 text-xs uppercase text-stone-500">
                        {{ `${student.firstName[0]}${student.lastName[0]}` }}
                    </div>
                    <span>{{ `${student.firstName} ${student.lastName}` }}</span>
                </div>
                <div class="rounded-md p-1 hover:bg-stone-100" @click="toggleStudent(student)">
                    <X :size="20" class="stroke-stone-500" />
                </div>
            </div>
        </div>
        <div class="flex w-fit select-none items-center gap-2 rounded-md p-1 hover:bg-stone-100"
            @click="dialogStudents.showModal()">
            <div class="rounded-md">
                <Plus :size="20" class="stroke-stone-500" />
            </div>
            <span class="pr-2 text-stone-500">Add student</span>
        </div>
    </div>
    <dialog ref="dialogStudents" class="mt-32 w-full max-w-xl rounded-lg shadow-lg backdrop:bg-stone-950/20">
        <div class="mb-4 flex items-center justify-between gap-2">
            <input type="text" name="student-search" id="student-search" placeholder="Search students"
                class="w-full rounded-md border border-stone-200 px-3 py-1.5 shadow-sm outline-none placeholder:text-stone-400 focus:border-stone-200 focus:ring-0" />
            <div class="rounded-md p-1 hover:bg-stone-100" @click="dialogStudents.close()">
                <X class="stroke-stone-500" />
            </div>
        </div>
        <div>
            <div class="mb-2 text-sm uppercase text-stone-500">Students</div>
            <div class="flex flex-col gap-1">
                <div v-for="student in students?.users?.edges"
                    class="w-full select-none rounded-lg px-2 py-1 text-stone-700 hover:bg-stone-50"
                    @click="toggleStudent(student)">
                    {{ `${student.firstName} ${student.lastName}` }}
                </div>
            </div>
        </div>
    </dialog>
</template>

<script lang="ts" setup>
import { useQuery } from "@urql/vue";
import { Plus, X } from "lucide-vue-next";
import { ref, toRef } from "vue";
import { graphql } from "../../../gql";
import { Entry, User } from "../../../gql/graphql";

const dialogStudents = ref();

const props = defineProps<{
    entry: Partial<Entry>;
}>();

const { data: students } = useQuery({
    query: graphql(`
    query users {
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

const entry = toRef(props, "entry")

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