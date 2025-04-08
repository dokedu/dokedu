<script setup lang="ts">
import { FilterIcon, PlusIcon } from "lucide-vue-next"
import type { DUser } from "~/types/models"
import { formatDate } from "@vueuse/core"

definePageMeta({
  layout: "settings"
})

const search = ref("")

const sortBy = useSessionStorage<keyof DUser>("settings/users/sortBy", "firstName")
const sortOrder = useSessionStorage<string>("settings/users/sortOrder", "asc")

const { data: users, refresh } = await useFetch("/api/users", {
  params: {
    role: "ne.student",
    sortBy: sortBy,
    sort: sortOrder,
    search: search
  }
})

function sort(key: keyof DUser) {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc"
  } else {
    sortBy.value = key
    sortOrder.value = "asc"
  }
}

async function deleteUser(id: string) {
  try {
    await $fetch(`/api/users/${id}`, { method: "DELETE" })
    await refresh() // Important for data consistency
  } catch (error) {
    console.error("Failed to delete user:", error)
    // Consider showing a toast notification here to inform the user
  }
}

const roles = [
  { value: "owner", label: "Besitzer" },
  { value: "admin", label: "Admin" },
  { value: "teacher", label: "Lehrer" },
  { value: "student", label: "Schüler" },
  { value: "parent", label: "Elternteil" }
]
</script>

<template>
  <DPage>
    <DHeader>
      <DHeaderTitle>Benutzer</DHeaderTitle>
      <DInputSearch v-model="search" />

      <template #right>
        <DButton :icon-left="PlusIcon" to="/settings/users/new">Benutzer erstellen</DButton>
      </template>
    </DHeader>

    <div class="block min-h-0 px-4 pt-2.5">
      <div class="grid grid-cols-4 items-center justify-between gap-4 border-b border-neutral-200 px-2 pb-2">
        <div class="flex items-center justify-between border-r border-neutral-200 pr-2 text-sm font-medium text-neutral-900">
          <div>Vorname</div>

          <DTableHeaderSort :sort-by="sortBy" :sort-field="'firstName'" :sort-order="sortOrder" @sort="sort" />
        </div>
        <div class="flex items-center justify-between border-r border-neutral-200 pr-2 text-sm font-medium text-neutral-900">
          <div>Nachname</div>

          <DTableHeaderSort :sort-by="sortBy" :sort-field="'lastName'" :sort-order="sortOrder" @sort="sort" />
        </div>
        <div class="flex items-center justify-between border-r border-neutral-200 pr-2 text-sm font-medium text-neutral-900">
          <div>Rolle</div>

          <!-- <DTableHeaderSort :sort-by="sortBy" :sort-field="'role'" :sort-order="sortOrder" @sort="sort" /> -->
        </div>
        <div class="flex items-center justify-between border-r border-neutral-200 pr-2 text-sm font-medium text-neutral-900">
          <div>Erstellt am</div>
          <!-- <DTableHeaderSort :sort-by="sortBy" :sort-field="'createdAt'" :sort-order="sortOrder" @sort="sort" /> -->
        </div>
      </div>
    </div>

    <DPageContent>
      <NuxtLink
        :to="`/settings/users/${user.id}`"
        v-for="user in users"
        :key="user.id"
        class="grid grid-cols-4 items-center justify-between gap-4 rounded px-2 py-2 hover:bg-neutral-100"
      >
        <div class="line-clamp-1 text-sm text-neutral-700">{{ user.firstName }}</div>
        <div class="line-clamp-1 text-sm text-neutral-700">{{ user.lastName }}</div>
        <div class="line-clamp-1 text-sm text-neutral-500">
          {{ roles.find((r) => r.value === user.role)?.label || user.role }}
        </div>
        <div class="line-clamp-1 text-sm text-neutral-500">{{ formatDate(new Date(user.createdAt), "DD.MM.YYYY") }}</div>
      </NuxtLink>
      <div v-if="!users || users.length === 0" class="py-4 text-center text-gray-500">Keine Benutzer gefunden.</div>
    </DPageContent>
  </DPage>

  <NuxtPage />
</template>
