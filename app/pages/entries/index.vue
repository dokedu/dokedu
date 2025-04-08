<script setup lang="ts">
import type { DUser, DTag } from "~/types/models"
import { formatDate, useInfiniteScroll } from "@vueuse/core"
import { PlusIcon } from "lucide-vue-next"
import { nanoid } from "nanoid"

// Reactive state
const search = ref("")
const limit = 25
const offset = ref(0)
const isLoading = ref(false)
const hasNextPage = ref(true)

// Sorting and filtering
const sortBy = useSessionStorage<"createdAt" | "date">("entries/sortBy", "createdAt")
const sortOrder = useSessionStorage<"asc" | "desc">("entries/sortOrder", "desc")
const filterByTag = useSessionStorage<string | null>("entries/filterByTag", null)
const filterByStudent = useSessionStorage<string | null>("entries/filterByStudent", null)
const filterByTeacher = useSessionStorage<string | null>("entries/filterByTeacher", null)

// Data references
const entries = ref<any[]>([])
const { data: users } = useFetch<DUser[]>("/api/users")
const students = computed(() => users.value?.filter((user) => user.role === "student"))
const teachers = computed(() => users.value?.filter((user) => user.role !== "student"))

const { data: tags } = useFetch<DTag[]>("/api/tags")

// Computed query params
const queryParams = computed(() => ({
  search: search.value,
  limit,
  offset: offset.value,
  studentId: filterByStudent.value,
  teacherId: filterByTeacher.value,
  tagId: filterByTag.value,
  sortBy: sortBy.value,
  sortOrder: sortOrder.value
}))

// Data fetching
const fetchEntries = async () => {
  if (isLoading.value) return

  try {
    isLoading.value = true
    const data = await $fetch<any>("/api/entries", { params: queryParams.value })

    if (data) {
      entries.value = offset.value === 0 ? data.entries : [...entries.value, ...data.entries]

      hasNextPage.value = data.meta.hasNextPage
    }
  } catch (error) {
    console.error("Failed to fetch entries:", error)
  } finally {
    isLoading.value = false
  }
}

// Initial load
await fetchEntries()

// Watchers
watch([search, filterByStudent, filterByTag, sortBy, sortOrder, filterByTeacher], () => {
  offset.value = 0
  fetchEntries()
})

watch(search, fetchEntries)

// Infinite scroll
const pageContent = useTemplateRef<HTMLElement>("content")

useInfiniteScroll(
  pageContent,
  () => {
    if (hasNextPage.value && !isLoading.value) {
      offset.value += limit
      fetchEntries()
    }
  },
  { distance: 25 }
)

// Helper functions
const fullName = (user: DUser) => `${user.firstName} ${user.lastName}`

function sort(key: "createdAt" | "date") {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc"
  } else {
    sortBy.value = key
    sortOrder.value = "asc"
  }
}

// Filter options
const filterStudentOptions = computed(() => [
  { value: null, display: "Alle" },
  ...(students.value?.map((user) => ({
    value: user.id,
    display: fullName(user)
  })) ?? [])
])

const filterTeacherOptions = computed(() => [
  { value: null, display: "Alle" },
  ...(teachers.value?.map((user) => ({
    value: user.id,
    display: fullName(user)
  })) ?? [])
])

const filterTagOptions = computed(() => [
  { value: null, display: "Alle" },
  ...(tags.value?.map((tag) => ({
    value: tag.id,
    display: tag.name
  })) ?? [])
])

async function newEntry() {
  const id = nanoid()
  const res = await $fetch(`/api/entries/${id}`, {
    method: "PUT",
    body: {
      id: id,
      body: "",
      date: new Date()
    }
  })
  if (!res) return alert("Eintrag konnte nicht erstellt werden")

  await useRouter().push(`/entries/${res.id}`)
}
</script>

<template>
  <DPage>
    <DHeader>
      <DHeaderTitle>Einträge</DHeaderTitle>
      <DInputSearch v-model="search" class="hidden md:block" />
      <DSelect v-model="filterByStudent" :options="filterStudentOptions" placeholder="Schüler" class="hidden w-[160px] md:block" />
      <DSelect v-model="filterByTeacher" :options="filterTeacherOptions" placeholder="Lehrer" class="hidden w-[160px] md:block" />
      <DSelect v-model="filterByTag" :options="filterTagOptions" placeholder="Tags" class="hidden w-[160px] md:block" />

      <template #right>
        <DButton :icon-left="PlusIcon" @click="newEntry">Eintrag erstellen</DButton>
      </template>
    </DHeader>

    <div class="block min-h-0 px-4 pt-2.5">
      <div class="grid items-center justify-between gap-4 border-b border-neutral-200 px-2 pb-2" :style="{ gridTemplateColumns: '4fr 1fr 120px 110px 110px' }">
        <div class="flex items-center justify-between border-r border-neutral-200 pr-2 text-sm font-medium text-neutral-900">
          <div>Beschreibung</div>
        </div>
        <div class="flex items-center justify-between border-r border-neutral-200 pr-2 text-sm font-medium text-neutral-900">
          <div>Tags</div>
        </div>
        <div class="flex items-center justify-between border-r border-neutral-200 pr-2 text-sm font-medium text-neutral-900">
          <div>Author</div>
        </div>
        <div class="flex items-center justify-between border-r border-neutral-200 pr-2 text-sm font-medium text-neutral-900">
          <div>Datum</div>

          <DTableHeaderSort :sort-by="sortBy" :sort-field="'date'" :sort-order="sortOrder" @sort="sort" />
        </div>
        <div class="flex items-center justify-between border-neutral-200 text-sm font-medium text-neutral-900">
          <div>Erstellt am</div>

          <DTableHeaderSort :sort-by="sortBy" :sort-field="'createdAt'" :sort-order="sortOrder" @sort="sort" />
        </div>
      </div>
    </div>

    <DPageContent v-if="entries" ref="content">
      <RouterLink
        :to="`/entries/${entry.id}`"
        v-for="entry in entries"
        class="grid items-center justify-between gap-4 rounded px-2 py-2 hover:bg-neutral-100"
        :style="{ gridTemplateColumns: '4fr 1fr 120px 110px 110px' }"
      >
        <div class="line-clamp-2 items-center gap-2.5 text-sm" :class="entry.body.length === 0 ? 'text-neutral-400' : 'text-neutral-700'">
          {{ entry.body.length > 0 ? entry.body : "Keine Beschreibung vorhanden..." }}
        </div>

        <div class="relative flex max-w-sm gap-1 overflow-hidden">
          <div v-for="tag in entry.tags">
            <DTag :color="tag.color || 'gray'" class="text-nowrap">{{ tag.name }}</DTag>
          </div>
        </div>
        <div class="overflow-hidden text-sm overflow-ellipsis whitespace-nowrap text-neutral-500">
          {{ fullName(entry.user) }}
        </div>
        <div class="text-sm text-neutral-500">
          {{ formatDate(new Date(entry.date), "DD.MM.YYYY") }}
        </div>
        <div class="text-sm text-neutral-500">
          {{ formatDate(new Date(entry.createdAt), "DD.MM.YYYY") }}
        </div>
      </RouterLink>
    </DPageContent>
  </DPage>
</template>
