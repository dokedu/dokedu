<script setup lang="ts">
import { CircleCheckIcon, CircleIcon } from "lucide-vue-next"
import type { DUser } from "~/types/models"

const emit = defineEmits(["toggle"])

interface Props {
  selected: string[]
  showGroupFilters?: boolean
}

const { showGroupFilters = false } = defineProps<Props>()

const { data: users } = useFetch("/api/users", { params: { role: "student" } })
const { data: groups } = useFetch("/api/groups")
const { data: groupUsers } = useFetch("/api/group_users")

const search = ref("")

const selectedGrades = ref<number[]>([])
const selectedGroups = ref<string[]>([]) // Add selectedGroups

const groupedUsers = computed(() => {
  if (!groupUsers.value) return {}

  const grouped: Record<string, string[]> = {}
  for (const gu of groupUsers.value) {
    if (!grouped[gu.groupId]) {
      grouped[gu.groupId] = []
    }
    grouped[gu.groupId].push(gu.userId)
  }
  return grouped
})

const filtered = computed(() => {
  let items: DUser[] = users.value || [] // handle null users

  // filter by grade
  if (selectedGrades.value.length > 0) {
    items = items.filter((c) => c.studentGrade !== null && selectedGrades.value.includes(parseInt(c.studentGrade)))
  }

  // filter by group
  if (selectedGroups.value.length > 0) {
    items = items.filter((user) => {
      return selectedGroups.value.some((groupId) => {
        return groupedUsers.value[groupId]?.includes(user.id)
      })
    })
  }

  // filter by search
  if (search.value) {
    items = items.filter((c) => `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.value.toLowerCase()))
  }

  // sort by first name, last name
  items.sort((a, b) => {
    const bName = `${a.firstName} ${a.lastName}`
    const aName = `${b.firstName} ${b.lastName}`
    if (aName < bName) return 1
    if (aName > bName) return -1
    return 0
  })

  return items
})

function onClick(user: DUser) {
  return emit("toggle", user)
}

const grades = [
  { value: [1, 2, 3, 4], display: "1-4" },
  { value: [5, 6, 7], display: "5-7" },
  { value: [8, 9, 10], display: "8-10" },
  { value: [11, 12, 13], display: "11-13" }
]
</script>

<template>
  <div class="flex h-full max-h-[500px] min-h-[500px] w-full flex-col">
    <div class="w-full border-b border-neutral-200">
      <input
        type="text"
        name="search"
        id="search"
        class="w-full border-none px-4 py-2 pb-1.5 text-sm outline-none focus:border-neutral-300 focus:ring-0 focus:outline-0"
        placeholder="Suche..."
        v-model="search"
      />
    </div>
    <div v-if="users" class="flex-1 divide-y divide-neutral-200 overflow-auto">
      <div class="flex gap-1 p-1">
        <DTag class="cursor-default" @click="selectedGrades = []" :color="selectedGrades.length === 0 ? 'blue' : 'gray'">Alle</DTag>
        <DTag
          class="cursor-default"
          v-for="grade in grades"
          :key="grade.value"
          @click="selectedGrades = grade.value"
          :color="selectedGrades.length > 0 && selectedGrades.every((c) => grade.value.includes(c)) ? 'blue' : 'gray'"
        >
          {{ grade.display }}
        </DTag>
      </div>

      <!-- Group Filter -->
      <div v-if="showGroupFilters && groups && groups.length > 0" class="flex gap-1 p-1">
        <DTag class="cursor-default" @click="selectedGroups = []" :color="selectedGroups.length === 0 ? 'blue' : 'gray'">Alle</DTag>
        <DTag
          v-if="groups"
          class="cursor-default"
          v-for="group in groups"
          :key="group.id"
          @click="selectedGroups.includes(group.id) ? (selectedGroups = selectedGroups.filter((id) => id !== group.id)) : selectedGroups.push(group.id)"
          :color="selectedGroups.includes(group.id) ? 'blue' : 'gray'"
        >
          {{ group.name }}
        </DTag>
      </div>

      <div
        v-for="user in filtered"
        :key="user.id"
        class="flex cursor-default items-center justify-between gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
        @click="onClick(user)"
      >
        <div class="flex w-full items-center justify-between gap-1.5">
          <div class="flex items-center gap-1.5">
            <CircleCheckIcon v-if="selected.includes(user.id)" class="size-4 text-blue-600" />
            <CircleIcon v-else class="size-4 text-neutral-400" />
            <div>{{ user.firstName }} {{ user.lastName }}</div>
          </div>
          <DTag v-if="user.studentGrade" size="small" color="gray">{{ user.studentGrade }}. Klasse</DTag>
          <DTag v-else size="small" color="gray">Keine Klasse</DTag>
        </div>
      </div>
      <div v-show="filtered.length === 0" class="px-4 py-2">
        <div class="text-sm text-neutral-500">Keine Ergebnisse...</div>
      </div>
    </div>
  </div>
</template>
