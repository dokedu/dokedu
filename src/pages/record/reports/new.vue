<template>
  <PageWrapper>
    <PageHeader>
      <div class="flex w-full items-center justify-between">
        <div class="font-medium text-stone-950">{{ $t("create_report") }}</div>
        <div class="flex gap-2">
          <d-button type="primary" :icon-left="Save" @click="createReport">{{ $t("save") }}</d-button>
        </div>
      </div>
    </PageHeader>
    <PageContent>
      <div class="mt-4 max-w-sm space-y-4 px-8">
        <StudentList @update="(selectedStudent) => (student = selectedStudent)" />
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
import PageHeader from "@/components/page-header.vue";
import PageWrapper from "@/components/page-wrapper.vue";
import PageContent from "@/components/page-content.vue";
import { Save } from "lucide-vue-next";
import dButton from "@/components/d-button/d-button.vue";
import StudentList from "@/components/d-report/d-report-student-list.vue";
import ReportTypeList from "@/components/d-report/d-report-type-list.vue";
import ReportTagList from "@/components/d-report/d-report-tag-list.vue";
import { User, Tag } from "@/gql/graphql";
import { ref } from "vue";
import dInput from "@/components/d-input/d-input.vue";
import { useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { useRouter } from "vue-router/auto";

const router = useRouter();

const student = ref<User>();
const from = ref<string>("");
const to = ref<string>("");
const type = ref();
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
    kind: type.value,
    format: "pdf",
    filterTags: tags.value?.map((tag) => tag.id) || [],
  };

  // @ts-expect-error
  await createReportMutation({ input });
  router.push({ name: "/record/reports/" });
}
</script>
