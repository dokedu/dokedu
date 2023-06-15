<template>
  <PageWrapper>
    <PageHeader>
      <div class="flex w-full items-center justify-between">
        <div class="font-medium text-stone-950">Create report</div>
        <div class="flex gap-2">
          <d-button type="primary" :icon-left="Save" @click="createReport">Save</d-button>
        </div>
      </div>
    </PageHeader>
    <PageContent>
      <div class="mt-4 max-w-sm space-y-4 px-8">
        <StudentList @update="(selectedStudent) => (student = selectedStudent)" />
        <div class="flex items-center gap-2">
          <div class="w-20 text-sm font-medium text-strong">From</div>
          <d-input class="w-full" type="date" name="from" v-model="from" />
        </div>
        <div class="flex items-center gap-2">
          <div class="w-20 text-sm font-medium text-strong">To</div>
          <d-input class="w-full" type="date" name="to" v-model="to" />
        </div>
        <ReportTypeList @update="(selectedType) => (type = selectedType)"></ReportTypeList>
        <ReportTagList @update="(selectedTags) => (tags = selectedTags)"></ReportTagList>
      </div>
    </PageContent>
  </PageWrapper>
</template>

<script lang="ts" setup>
import PageHeader from "@/components/PageHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import PageContent from "@/components/PageContent.vue";
import { Save } from "lucide-vue-next";
import dButton from "@/components/d-button/d-button.vue";
import StudentList from "./ReportStudentList.vue";
import ReportTypeList from "./ReportTypeList.vue";
import ReportTagList from "./ReportTagList.vue";
import { User, Tag } from "@/gql/graphql";
import { ref } from "vue";
import dInput from "@/components/d-input/d-input.vue";
import { useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { ReportType } from "./ReportTypeList.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const student = ref<User>();
const from = ref<string>();
const to = ref<string>();
const type = ref<ReportType>();
const tags = ref<Tag[]>();

const { executeMutation: createReportMutation } = useMutation(
  graphql(`
    mutation createReport($input: CreateReportInput!) {
      createReport(input: $input) {
        id
      }
    }
  `)
);

async function createReport() {
  const input = {
    studentUser: student.value?.id,
    from: new Date(from.value).toISOString(),
    to: new Date(to.value).toISOString(),
    kind: type.value?.kind,
    format: type.value?.format,
    filterTags: tags.value?.map((tag) => tag.id),
  };

  await createReportMutation({ input });
  router.push({ name: "record-reports" });
}
</script>
