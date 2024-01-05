<template>
  <div class="text-sm">
    <header class="mb-2 flex items-center justify-between">
      <div class="text-neutral-500">{{ $t("student", 2) }}</div>
      <div class="rounded-md p-1 hover:bg-neutral-100" @click="openModal">
        <Plus :size="20" class="stroke-neutral-500" />
      </div>
    </header>
    <div class="mb-2">
      <div
        v-for="student in entry?.users"
        class="flex w-full select-none items-center justify-between gap-2 rounded-lg px-1 py-1 text-neutral-700 hover:bg-neutral-50"
      >
        <div class="flex items-center gap-2">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 p-1 text-xs uppercase text-neutral-500"
          >
            {{ `${student.firstName[0]}${student.lastName[0]}` }}
          </div>
          <span>{{ formattedStudentName(student) }}</span>
        </div>
        <div class="rounded-md p-1 hover:bg-neutral-100" @click="toggleStudent(student)">
          <X :size="20" class="stroke-neutral-500" />
        </div>
      </div>
    </div>
    <div class="flex w-fit select-none items-center gap-2 rounded-md p-1 hover:bg-neutral-100" @click="showModal">
      <div class="rounded-md">
        <Plus :size="20" class="stroke-neutral-500" />
      </div>
      <span class="pr-2 text-neutral-500">{{ $t("add_student") }}</span>
    </div>
  </div>
  <d-dialog :open="open" title="Students" @close="open = false" :padding="false" :header="false">
    <template #main>
      <div ref="innerDialog" class="flex h-full max-h-[36rem] flex-col">
        <div>
          <div class="flex items-center justify-between gap-2 border-b border-neutral-200">
            <input
              type="text"
              v-model="search"
              name="student-search"
              id="student-search"
              :placeholder="$t('search_students')"
              class="w-full rounded-md border-none px-3 py-3 text-sm outline-none placeholder:text-neutral-400 focus:ring-0"
            />
          </div>
        </div>
        <div class="flex flex-1 flex-col overflow-auto">
          <div>
            <div class="flex h-full flex-1 flex-col gap-1">
              <div class="divide-y divide-neutral-100">
                <div
                  v-for="student in students?.users?.edges"
                  :key="student?.id"
                  @click="toggleStudent(student as User)"
                  class="grid grid-cols-4 px-4 py-2 text-neutral-700 transition-all hover:bg-neutral-100"
                  :class="{
                    'bg-neutral-100 hover:bg-neutral-200': entry.users?.some((el) => el.id === student?.id)
                  }"
                  :style="{ gridTemplateColumns: '2fr 2fr 1fr 2rem' }"
                >
                  <div class="text-neutral-900">{{ student?.firstName }}</div>
                  <div class="text-neutral-900">{{ student?.lastName }} {{ student?.student?.emoji }}</div>
                  <div class="text-neutral-900">{{ student?.student?.grade }}</div>
                  <div class="flex items-center justify-end pr-3 text-right text-neutral-900">
                    <Check v-if="entry.users?.some((el) => el.id === student?.id)" :size="16" />
                  </div>
                </div>
                <div v-show="students?.users.edges === null" class="px-4 py-2 text-neutral-500">No students found</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </d-dialog>
</template>

<script lang="ts" setup>
import { Plus, X, Check } from "lucide-vue-next"
import { reactive, ref, toRef } from "vue"
import DDialog from "@/components/d-dialog/d-dialog.vue"
import { useDeleteEntryUserInputMutation } from "@/gql/mutations/entries/deleteEntryUser"
import { useCreateEntryUserMutation } from "@/gql/mutations/entries/createEntryUser"
import { useStudentListQuery } from "@/gql/queries/users/studentList"
import type { Entry, User } from "@/gql/schema"

const { executeMutation: deleteEntryUser } = useDeleteEntryUserInputMutation()
const { executeMutation: createEntryUser } = useCreateEntryUserMutation()

const props = defineProps<{
  entry: Partial<Entry>
}>()

const open = ref(false)
const innerDialog = ref()
const search = ref()

function openModal() {
  open.value = true
}
function showModal() {
  open.value = true
}

function formattedStudentName(student: User) {
  if (student.student?.emoji) {
    return `${student.firstName} ${student.lastName} ${student.student?.emoji}`
  } else {
    return `${student.firstName} ${student.lastName}`
  }
}

const { data: students } = useStudentListQuery({ variables: reactive({ search: search }) })

const entry = toRef(props, "entry")

async function toggleStudent(student: User) {
  if (!entry.value.users?.map((el) => el.id).includes(student.id)) {
    await createEntryUser({ input: { entryId: entry.value.id as string, userId: student.id } })
  } else {
    await deleteEntryUser({ input: { entryId: entry.value.id as string, userId: student.id } })
  }
}
</script>
