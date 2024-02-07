<script lang="ts" setup>
import PageHeader from "@/components/page-header.vue"
import PageWrapper from "@/components/page-wrapper.vue"
import PageContent from "@/components/page-content.vue"
import { Save, Info } from "lucide-vue-next"
import dButton from "@/components/d-button/d-button.vue"
import ReportTypeList from "@/components/d-report/d-report-type-list.vue"
import { computed, reactive, ref } from "vue"
import dInput from "@/components/d-input/d-input.vue"
import { useRouter } from "vue-router/auto"
import DSelect from "@/components/d-select/d-select.vue"
import { createNotification } from "@/composables/useToast"
import { array, boolean, date, object, string } from "yup"
import { useCreateReportMutation } from "@/gql/mutations/reports/createReport"
import { useGetEntryFilterStudentsQuery } from "@/gql/queries/users/getEntryFilterStudents"
import { useRouteQuery } from "@vueuse/router"
import DTag from "@/components/d-tag/d-tag.vue"
import { useCompetenceSubjectsQuery } from "@/gql/queries/competences/competenceSubjects"
import DCombobox from "@/components/d-combobox/d-combobox.vue"

const router = useRouter()

const student = useRouteQuery<string>("student")
const from = useRouteQuery<string>("from")
const to = useRouteQuery<string>("to")
const type = useRouteQuery<string>("type", "entries")
const competence = useRouteQuery<string>("competence")
const competenceSearch = ref<string>("")

const { executeMutation: createReportMutation } = useCreateReportMutation()

const { data: competenceData } = useCompetenceSubjectsQuery({
  variables: reactive({
    search: competenceSearch
  })
})

const tagOptions = computed(
  () =>
    competenceData?.value?.competences?.edges?.map((edge: any) => ({
      label: edge.name,
      value: edge.id
    })) || []
)

const studentSearch = ref("")
const { data: studentData } = useGetEntryFilterStudentsQuery({
  variables: reactive({
    search: studentSearch
  })
})

const studentOptions = computed(() => [
  {
    label: "Alle",
    value: "-1"
  },
  ...(studentData?.value?.users?.edges?.map((edge: any) => ({
    label: `${edge.firstName} ${edge.lastName}`,
    value: edge.id
  })) || [])
])

const createReportInput = object({
  studentUser: string().optional(),
  allUsers: boolean().required(),
  from: date().required(),
  to: date().required(),
  kind: string().required(),
  format: string().required(),
  filterTags: array().ensure()
})

async function createReport() {
  const scope = student.value === "-1" ? { allUsers: true } : { studentUser: student.value, allUsers: false }

  const value = {
    from: from.value.slice(0, 10),
    to: to.value.slice(0, 10),
    kind: type.value,
    format: "pdf",
    filterTags: [],
    ...scope
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
    console.error(error)
    return createNotification({
      title: "Beim Erstellen des Berichts ist ein Fehler aufgetreten",
      description: error.message
    })
  }

  await router.push({ name: "/record/reports/" })
}
</script>

<template>
  <PageWrapper>
    <PageHeader>
      <div class="flex w-full items-center justify-between">
        <div class="font-medium text-neutral-950">{{ $t("create_report") }}</div>
        <div class="flex gap-2">
          <!-- <d-button type="outline" :icon-left="DownloadCloud">{{ $t("download") }}</d-button> -->
          <d-button type="primary" :icon-left="Save" @click="createReport">{{ $t("save") }}</d-button>
        </div>
      </div>
    </PageHeader>
    <PageContent>
      <div class="flex h-full">
        <div class="border-r h-full p-4 max-w-sm w-full">
          <div class="max-w-sm w-full space-y-4">
            <DCombobox :options="studentOptions" :placeholder="$t('student')" v-model:search="studentSearch"
              v-model="student" searchable />

            <div class="flex gap-2">
              <d-input class="w-full" type="date" name="from" v-model="from" />
              <d-input class="w-full" type="date" name="to" v-model="to" />
            </div>

            <ReportTypeList v-model="type" />

            <template v-if="false">
              <div class="bg-blue-100 rounded-md flex gap-2.5 p-2.5">
                <div>
                  <Info class="text-blue-900" :size="20" />
                </div>
                <div class="text-blue-900 text-sm">
                  Wenn kein Fach ausgewählt ist, werden alle Fächer berücksichtigt.
                </div>
              </div>

              <DSelect searchable :options="tagOptions" :label="$t('subject')" v-model="competence"
                v-model:search="competenceSearch">
                <template #display>
                  <div v-if="competence">
                    <d-tag :color="competenceData?.competences.edges?.find((el: any) => el.id === competence)?.color">
                      {{ competenceData?.competences.edges?.find((el: any) => el.id === competence)?.name }}
                    </d-tag>
                  </div>
                  <div v-else class="text-sm text-neutral-600 p-1">Wähle ein Fach aus</div>
                </template>
                <template v-slot="{ option }">
                  <d-tag :color="competenceData?.competences.edges?.find((el: any) => el.id === option.value)?.color">
                    {{ option.label }}
                  </d-tag>
                </template>
              </DSelect>
            </template>
          </div>
        </div>
      </div>
    </PageContent>
  </PageWrapper>
</template>
