<template>
  <PageWrapper>
    <PageHeader class="justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-neutral-950">{{ $t("grade", 2) }}</div>

        <select v-model="schoolYearFilter" name="school_year" id="school_year" class="px-1.5 py-0.5 pr-8 text-sm">
          <option :value="null">Alle Schuljahre</option>
          <option disabled>---</option>
          <option v-for="schoolYear in schoolYearsData?.schoolYears.edges" :key="schoolYear.id" :value="schoolYear.id">
            {{ schoolYear.description }}
          </option>
        </select>

        <select v-model="subjectFilter" name="subject" id="subject" class="px-1.5 py-0.5 pr-8 text-sm">
          <option :value="null">Alle Fächer</option>
          <option disabled>---</option>
          <option v-for="subject in subjectData?.subjects.edges" :key="subject.id" :value="subject.id">
            {{ subject.name }}
          </option>
        </select>
      </div>
    </PageHeader>
    <DTable
      v-model:variables="pageVariables"
      :search="search"
      :columns="columns"
      objectName="userStudentGrades"
      @row-click="goToUserStudentGrade"
      :query="UserStudentGradesDocument"
    >
      <template #student-data="{ column }">{{ column.user.firstName }} {{ column.user.lastName }}</template>
      <template #subject-data="{ column }">{{ column.name }}</template>
      <template #schoolYear-data="{ column }">{{ column.description }}</template>
      <template #grade-data="{ column }"
        ><input @click.stop="" type="text" :value="column" class="px-1.5 py-0.5 text-sm"
      /></template>
    </DTable>
  </PageWrapper>
  <router-view />
</template>

<script lang="ts" setup>
import PageWrapper from "@/components/page-wrapper.vue"
import PageHeader from "@/components/page-header.vue"
import DTable from "@/components/d-table/d-table.vue"
import { PageVariables } from "@/types/types"
import { ref } from "vue"
import { useRouter } from "vue-router/auto"
import { useSchoolYearsQuery } from "@/gql/queries/schoolYears/schoolYears"
import { useSubjectsQuery } from "@/gql/queries/subjects/subjects"
import { UserStudentGradesDocument } from "@/gql/queries/userStudentGrades/userStudentGrades"

const search = ref("")

const router = useRouter()

const subjectFilter = ref<null | string>(null)
const { data: subjectData } = useSubjectsQuery({})

const schoolYearFilter = ref<null | string>(null)
const { data: schoolYearsData } = useSchoolYearsQuery({})

const columns = [
  {
    label: "student",
    key: "student"
  },
  {
    label: "school_year",
    key: "schoolYear"
  },
  {
    label: "subject",
    key: "subject"
  },
  {
    label: "grade",
    key: "grade"
  }
]

const pageVariables = ref<PageVariables[]>([
  {
    search: "",
    limit: 10,
    offset: 0
  }
])

function goToUserStudentGrade(item: any) {
  router.push({ name: "/school/grades/[id]", params: { id: item.id } })
}
</script>
