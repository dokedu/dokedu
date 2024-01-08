<template>
  <PageWrapper>
    <PageHeader>
      <div class="w-full">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="font-medium text-strong">{{ $t("filter", 2) }}</div>
            <DSelect
              searchable
              :options="studentOptions"
              :label="$t('student')"
              v-model:search="studentSearch"
              v-model="student"
            />
            <DSelect
              searchable
              :options="teacherOptions"
              :label="$t('teacher')"
              v-model="teacher"
              v-model:search="teacherSearch"
            />
            <DSelect
              searchable
              :options="tagOptions"
              :label="$t('tag', 2)"
              multiple
              v-model="tags"
              v-model:search="tagSearch"
            >
              <template v-slot="{ option }">
                <d-tag :color="tagData?.tags.edges?.find((el: any) => el.id === option.value)?.color">
                  {{ option.label }}
                </d-tag>
              </template>
            </DSelect>
          </div>
          <DButton @click="createEntry" type="primary" size="md" :icon-left="Plus">{{ $t("new") }}</DButton>
        </div>
      </div>
    </PageHeader>

    <DTable
      v-model:variables="pageVariables"
      :columns="columns"
      objectName="entries"
      :query="GetEntriesDocument"
      defaultSort="createdAt"
      @row-click="goToEntry"
      :watchers="[student, teacher, tags]"
    >
      <template #body-data="{ column, item }">
        <div class="flex h-full w-full items-center justify-between gap-2">
          <div class="truncate">{{ column }}</div>
          <div class="overflow-hiden flex items-center justify-end gap-1">
            <div v-if="item.events?.length > 3">
              <DTag color="neutral" class="w-1/4 p-2">{{ item.events?.length }} {{ $t("project", 2) }} </DTag>
            </div>
            <div v-else v-for="event in item.events" :key="event.id" class="flex gap-1">
              <div
                @click.stop="goToProject(event.id)"
                class="line-clamp-1 inline-flex h-7 max-w-[120px] items-center gap-1.5 text-ellipsis whitespace-nowrap rounded-full border bg-default px-3 py-1 transition-all duration-150 ease-linear hover:max-w-[250px] hover:bg-subtle"
              >
                <LayoutGrid class="stroke-subtle w-4 min-w-[16px]" />
                <div class="flex-1 overflow-hidden text-ellipsis">
                  {{ event.title }}
                </div>
              </div>
            </div>
            <div v-if="item.subjects.length > 3">
              <DTag color="neutral" class="w-1/4 p-2">
                <div class="size-2 rounded bg-neutral-500"></div>
                {{ item.subjects.length }} {{ $t("subject", 2) }}
              </DTag>
            </div>
            <div v-else v-for="parent in item.subjects" :key="parent.id" class="flex gap-2">
              <DTag :color="parent.color" class="w-1/4 p-2">
                <div class="flex items-center gap-2">
                  <div class="size-2 rounded" :class="`bg-${parent.color}-500`"></div>
                  {{ parent.name }}
                </div>
              </DTag>
            </div>
            <div v-if="item.tags.length > 5">
              <DTag color="neutral" class="w-1/4 p-2">{{ item.tags.length }} {{ $t("label", 2) }}</DTag>
            </div>
            <div v-else v-for="tag in item.tags" :key="tag.id" class="flex gap-1">
              <DTag :color="tag.color" class="w-1/4 p-2">{{ tag.name }}</DTag>
            </div>
          </div>
        </div>
      </template>
      <template #date-data="{ column }">
        <div class="flex h-full items-center">
          {{ dateOnly(column) }}
        </div>
      </template>
      <template #subjects-data="{ column }">
        <div class="flex h-full items-center">
          <div v-for="parent in column" :key="parent.id" class="flex gap-2">
            <DTag color="neutral" class="w-1/4 p-2">{{ parent.name }}</DTag>
          </div>
        </div>
      </template>
      <template #createdAt-data="{ column, item }">
        <div class="flex items-center gap-2">
          <div>
            {{ dateOnly(column) }}
          </div>

          <div
            :title="`${item.user?.firstName} ${item.user?.lastName}`"
            class="h-8 w-8 rounded-full"
            :class="`bg-subtle`"
          >
            <div class="flex h-full w-full items-center justify-center">
              <div class="text-xs font-bold text-subtle">{{ item.user?.firstName[0] }}{{ item.user?.lastName[0] }}</div>
            </div>
          </div>
        </div>
      </template>
      <template #empty>
        <div class="px-8 py-4">{{ $t("entry_placeholder") }}</div>
      </template>
    </DTable>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageHeader from "@/components/page-header.vue"
import PageWrapper from "@/components/page-wrapper.vue"
import DButton from "@/components/d-button/d-button.vue"
import { ref, computed, reactive, watch } from "vue"
import { type PageVariables } from "@/types/types"
import { useSessionStorage } from "@vueuse/core"
import { useRouter } from "vue-router/auto"
import { useI18n } from "vue-i18n"
import DSelect from "@/components/d-select/d-select.vue"
import DTable from "@/components/d-table/d-table.vue"
import DTag from "@/components/d-tag/d-tag.vue"
import { LayoutGrid, BadgeCheckIcon, Plus } from "lucide-vue-next"
import { useGetEntryFilterTeachersQuery } from "@/gql/queries/users/getEntryFilterTeachers"
import { useGetEntryFilterStudentsQuery } from "@/gql/queries/users/getEntryFilterStudents"
import { useCreateEntryDraftMutation } from "@/gql/mutations/entries/createEntryDraft"
import { GetEntriesDocument } from "@/gql/queries/entries/getEntries"
import { useTagLimitedQuery } from "@/gql/queries/tags/tags"
import { EntrySortBy } from "@/gql/schema"

const i18nLocale = useI18n()
const router = useRouter()

const tagSearch = ref("")

const student = useSessionStorage<string>("filter/record/entries/index#student", null)
const teacher = useSessionStorage<string>("filter/record/entries/index#teacher", null)
const tags = useSessionStorage<string[]>(`filter/record/entries/index#tags`, [])

interface Variables extends PageVariables {
  filter: {
    users?: string
    authors?: string
    tags?: string[]
  }
}

const columns = [
  {
    key: "body",
    label: "description",
    width: 0.6
  },
  {
    key: "date",
    label: "date",
    sortable: {
      asc: EntrySortBy.DateAsc,
      desc: EntrySortBy.DateDesc
    }
  },
  {
    key: "createdAt",
    label: "created_at",
    sortable: {
      asc: EntrySortBy.CreatedAtAsc,
      desc: EntrySortBy.CreatedAtDesc
    }
  }
]

const goToEntry = <Type extends { id: string }>(row: Type) => {
  router.push({ name: "/record/entries/[id]", params: { id: row.id } })
}

const goToProject = (id: string) => {
  router.push({ name: "/record/projects/[id]", params: { id } })
}

const pageVariables = ref<Variables[]>([
  {
    filter: {
      users: student.value || undefined,
      authors: teacher.value || undefined,
      tags: tags.value
    },
    limit: 30,
    order: EntrySortBy.CreatedAtDesc,
    offset: 0,
    nextPage: undefined
  }
])

watch([student, teacher, tags], () => {
  // Get last page
  const lastPage = pageVariables.value[pageVariables.value.length - 1]
  pageVariables.value = [
    {
      filter: {
        users: student.value || undefined,
        authors: teacher.value || undefined,
        tags: tags.value
      },
      limit: 30,
      order: lastPage.order,
      offset: 0,
      nextPage: undefined
    }
  ]
})

const teacherSearch = ref("")
const { data: teacherData } = useGetEntryFilterTeachersQuery({
  variables: reactive({
    search: teacherSearch
  })
})

const studentSearch = ref("")
const { data: studentData } = useGetEntryFilterStudentsQuery({
  variables: reactive({
    search: studentSearch
  })
})

const { data: tagData } = useTagLimitedQuery({
  variables: reactive({
    search: tagSearch
  })
})

const teacherOptions = computed(
  () =>
    teacherData?.value?.users?.edges?.map((edge: any) => ({
      label: `${edge.firstName} ${edge.lastName}`,
      value: edge.id
    })) || []
)

const studentOptions = computed(
  () =>
    studentData?.value?.users?.edges?.map((edge: any) => ({
      label: `${edge.firstName} ${edge.lastName}`,
      value: edge.id
    })) || []
)

const tagOptions = computed(
  () =>
    tagData?.value?.tags?.edges?.map((edge: any) => ({
      label: edge.name,
      value: edge.id
    })) || []
)

function dateOnly(date: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }
  return new Date(date).toLocaleDateString(i18nLocale.locale.value, options)
}

const { executeMutation: createEntryDraft } = useCreateEntryDraftMutation()

async function createEntry() {
  const { data, error } = await createEntryDraft({})
  if (error) {
    alert(error.message)
    return
  }
  await router.push({ name: "/record/entries/[id]", params: { id: data?.createEntry.id as string } })
}
</script>
