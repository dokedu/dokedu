<template>
  <PageWrapper>
    <PageHeader>
      <div class="flex w-full items-center justify-between">
        <div class="font-medium text-neutral-950">{{ $t("create_report") }}</div>
        <div class="flex gap-2">
          <d-button type="primary" :icon-left="Save" @click="createReport">{{ $t("save") }}</d-button>
        </div>
      </div>
    </PageHeader>
    <PageContent>
      <div class="mt-4 max-w-sm space-y-4 px-8">
        <DSelect searchable :options="studentOptions" :label="$t('student')" v-model:search="studentSearch"
          v-model="student" />

        <div class="flex items-center gap-2">
          <div class="w-20 text-sm font-medium text-strong">{{ $t("from") }}</div>
          <d-input class="w-full" type="date" name="from" v-model="from" />
        </div>
        <div class="flex items-center gap-2">
          <div class="w-20 text-sm font-medium text-strong">{{ $t("to") }}</div>
          <d-input class="w-full" type="date" name="to" v-model="to" />
        </div>
        <ReportTypeList v-model="type" />
        <ReportTagList @update="(selectedTags) => (tags = selectedTags)"></ReportTagList>
      </div>
    </PageContent>
  </PageWrapper>
</template>

<script lang="ts" setup>
import PageHeader from "@/components/page-header.vue"
import PageWrapper from "@/components/page-wrapper.vue"
import PageContent from "@/components/page-content.vue"
import { Save } from "lucide-vue-next"
import dButton from "@/components/d-button/d-button.vue"
import ReportTypeList from "@/components/d-report/d-report-type-list.vue"
import ReportTagList from "@/components/d-report/d-report-tag-list.vue"
import type { Tag } from "@/gql/schema"
import { computed, reactive, ref } from "vue"
import dInput from "@/components/d-input/d-input.vue"
import { useRouter } from "vue-router/auto"
import DSelect from "@/components/d-select/d-select.vue"
import { createNotification } from "@/composables/useToast"
import { array, date, object, string } from "yup"
import { useCreateReportMutation } from "@/gql/mutations/reports/createReport"
import { useGetEntryFilterStudentsQuery } from "@/gql/queries/users/getEntryFilterStudents"

const router = useRouter()

const student = ref<string>()
const from = ref<string>("")
const to = ref<string>("")
const type = ref("entries")
const tags = ref<Tag[]>()

const { executeMutation: createReportMutation } = useCreateReportMutation()

const studentSearch = ref("")
const { data: studentData } = useGetEntryFilterStudentsQuery({
  variables: reactive({
    search: studentSearch
  })
})

const studentOptions = computed(
  () =>
    studentData?.value?.users?.edges?.map((edge: any) => ({
      label: `${edge.firstName} ${edge.lastName}`,
      value: edge.id
    })) || []
)

const createReportInput = object({
  studentUser: string().required(),
  from: date().required(),
  to: date().required(),
  kind: string().required(),
  format: string().required(),
  filterTags: array().ensure()
})

async function createReport() {
  const value = {
    studentUser: student.value,
    from: from.value.slice(0, 10),
    to: to.value.slice(0, 10),
    kind: type.value,
    format: "pdf",
    filterTags: tags.value?.map((tag) => tag.id) || []
  }

  if (!(await createReportInput.isValid(value))) {
    return createNotification({
      title: "Formular ungültig",
      description: "Bitte überprüfe deine Eingaben"
    })
  }

  const input = createReportInput.cast(value)

  // @ts-expect-error
  const { error } = await createReportMutation({ input })

  if (error) {
    return createNotification({
      title: "Beim Erstellen des Berichts ist ein Fehler aufgetreten",
      description: error.message
    })
  }

  await router.push({ name: "/record/reports/" })
}
</script>
