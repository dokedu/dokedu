<template>
  <PageWrapper>
    <PageHeader class="justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-neutral-950">{{ $t("student", 2) }}</div>
        <input
          v-model="search"
          type="text"
          name="search"
          id="search"
          :placeholder="$t('search')"
          class="h-8 rounded-md border border-neutral-100 text-sm text-strong outline-none ring-0 transition-all placeholder:text-subtle focus:border-neutral-200 focus:shadow-sm focus:ring-0"
        />
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2 px-2.5">
          <input
            class="border-subtle rounded checked:bg-neutral-900 checked:text-neutral-900 checked:hover:bg-neutral-900 focus:ring-0 checked:focus:bg-neutral-900"
            type="checkbox"
            id="showDeletedRecord"
            v-model="showDeleted"
          />
          <label for="showDeletedRecord">{{ $t("show_deleted") }}</label>
        </div>
        <DUploadStudentsDialog>
          <template #trigger>
            <UploadCloudIcon :size="16" />
            {{ $t("import_students") }}
          </template>
        </DUploadStudentsDialog>
        <RouterLink :to="{ name: '/school/students/new' }">
          <DButton type="primary" size="md" :icon-left="Plus">{{ $t("add_student") }}</DButton>
        </RouterLink>
      </div>
    </PageHeader>
    <DTable
      v-model:variables="pageVariables"
      :search="search"
      :columns="columns"
      objectName="users"
      :query="AdminStudentsDocument"
      @row-click="goToStudent"
      defaultSort="lastName"
      :additionalTypenames="['ImportStudentsPayload', 'User', 'UserStudent']"
    >
      <template #lastName-data="{ item }">
        {{ item.lastName }}
        {{ item.student?.emoji }}
      </template>
      <template #birthday-data="{ item }">
        {{
          item.student?.birthday
            ? formatDate(new Date(Date.parse(item?.student.birthday as string)), "DD.MM.YYYY")
            : "-"
        }}
      </template>
      <template #grade-data="{ item }">
        {{ item.student?.grade || "-" }}
      </template>
    </DTable>
  </PageWrapper>
  <router-view />
</template>

<script setup lang="ts">
import DButton from "@/components/d-button/d-button.vue"
import PageHeader from "@/components/page-header.vue"
import PageWrapper from "@/components/page-wrapper.vue"
import { Plus, UploadCloudIcon } from "lucide-vue-next"
import { ref, watch } from "vue"
import { UserOrderBy } from "@/gql/schema"
import DTable from "@/components/d-table/d-table.vue"
import { useRouter } from "vue-router/auto"
import { formatDate, watchDebounced } from "@vueuse/core"
import type { PageVariables } from "@/types/types"
import DUploadStudentsDialog from "@/components/_admin/d-upload-students-dialog.vue"
import { AdminStudentsDocument } from "@/gql/queries/users/adminStudents"

const router = useRouter()
const search = ref("")
const showDeleted = ref(false)

const columns = [
  {
    label: "first_name",
    key: "firstName",
    sortable: {
      asc: UserOrderBy.FirstNameAsc,
      desc: UserOrderBy.FirstNameDesc
    }
  },
  {
    label: "last_name",
    key: "lastName",
    sortable: {
      asc: UserOrderBy.LastNameAsc,
      desc: UserOrderBy.LastNameDesc
    }
  },
  {
    label: "birthday",
    key: "birthday"
  },
  {
    label: "grade",
    key: "grade"
  }
]

const pageVariables = ref<PageVariables[]>([
  {
    search: "",
    order: UserOrderBy.LastNameAsc,
    limit: 50,
    offset: 0,
    nextPage: undefined,
    showDeleted: undefined
  }
])

watchDebounced(
  search,
  () => {
    // Get last page and set it as only with the search
    const lastPage = pageVariables.value[pageVariables.value.length - 1]
    pageVariables.value = [
      {
        search: search.value,
        order: lastPage.order,
        limit: 500,
        offset: 0,
        nextPage: undefined,
        showDeleted: lastPage.showDeleted
      }
    ]
  },
  { debounce: 250, maxWait: 500 }
)

watch(showDeleted, () => {
  // Get last page and set it as only with the search
  const lastPage = pageVariables.value[pageVariables.value.length - 1]
  pageVariables.value = [
    {
      search: lastPage.search,
      order: lastPage.order,
      limit: 50,
      offset: 0,
      nextPage: undefined,
      showDeleted: showDeleted.value
    }
  ]
})

function goToStudent<Type extends { id: string }>(row: Type) {
  router.push({ name: "/school/students/[id]", params: { id: row.id } })
}
</script>
