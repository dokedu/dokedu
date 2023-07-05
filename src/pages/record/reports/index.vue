<template>
  <PageWrapper>
    <PageHeader class="flex select-none justify-between">
      <div class="font-medium text-stone-950">{{ $t("report", 2) }}</div>
      <div class="flex gap-2">
        <d-button v-if="false" type="transparent" :icon-left="Newspaper">{{ $t("prepare_annual_reports") }}</d-button>
        <router-link :to="{ name: 'record-reports-new' }">
          <d-button type="primary" :icon-left="Plus">{{ $t("create") }}</d-button>
        </router-link>
      </div>
    </PageHeader>
    <DTable :columns="columns" object-name="reports" :query="reportsQuery" v-model:variables="pageVariables">
      <template #student-data="{ item }">
        <div>{{ item.studentUser.firstName }} {{ item.studentUser.lastName }}</div>
      </template>
      <template #from-data="{ column }">
        {{ formatDate(new Date(column), "DD.MM.YYYY") }}
      </template>
      <template #to-data="{ column }">
        {{ formatDate(new Date(column), "DD.MM.YYYY") }}
      </template>
      <template #status-data="{ column }">
        <DReportStatus :status="column"></DReportStatus>
      </template>
      <template #createdBy-data="{ item }">
        {{ `${item.user?.firstName} ${item.user?.lastName}` }}
      </template>
      <template #createdAt-data="{ column }">
        {{ formatDate(new Date(column), "DD.MM.YYYY HH:ss") }} {{ $t("hour") }}
      </template>
      <template #file-data="{ item }">
        <div
          v-if="item?.status === 'done' && item.file"
          class="p-2 pr-8 text-left text-sm font-normal text-default hover:underline"
          @click="downloadFile(item)"
        >
          {{ $t("download") }}
        </div>
        <div
          v-else-if="!item.file && item.status === 'done'"
          class="p-2 pr-8 text-left text-sm font-normal text-default"
        >
          {{ $t("no-file") }}
        </div>
        <div v-else class="p-2 pr-8 text-left text-sm font-normal text-default"></div>
      </template>
    </DTable>
  </PageWrapper>
  <!-- requesting download file toast -->
  <div
    v-if="downloadingFilesCount > 0"
    class="fixed bottom-4 right-4 flex select-none gap-2 rounded-md bg-white px-4 py-2 text-sm shadow-md"
  >
    <div class="animate-spin">
      <Loader2 :size="20" />
    </div>
    <div>{{ $t("downloading_file") }}</div>
  </div>
</template>
<script setup lang="ts">
import { Newspaper } from "lucide-vue-next";
import PageHeader from "@/components/PageHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import DButton from "@/components/d-button/d-button.vue";
import { Plus, Loader2 } from "lucide-vue-next";
import { useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { formatDate } from "@vueuse/core";
import { Report } from "@/gql/graphql";
import DReportStatus from "./DReportStatus.vue";
import { ref } from "vue";
import DTable from "@/components/d-table/d-table.vue";

const columns = [
  {
    key: "student",
    label: "student",
  },
  {
    key: "from",
    label: "from",
    width: 0.1,
  },
  {
    key: "to",
    label: "to",
    width: 0.1,
  },
  {
    key: "status",
    label: "status",
  },
  {
    key: "createdBy",
    label: "created_by",
  },
  {
    key: "createdAt",
    label: "created_at",
  },
  {
    key: "file",
    label: "file",
    width: 0.15,
  },
];

const pageVariables = ref([
  {
    limit: 30,
    offset: 0,
    nextPage: null,
  },
]);

const reportsQuery = graphql(`
  query reports {
    reports(limit: 100) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        id
        status
        format
        kind
        from
        to
        createdAt
        studentUser {
          id
          firstName
          lastName
        }
        user {
          id
          firstName
          lastName
        }
        file {
          id
        }
      }
    }
  }
`);

const downloadingFilesCount = ref(0);

// TODO: refactor into utilitiy function
async function downloadFile(report: Report) {
  downloadingFilesCount.value += 1;
  const { data } = await getFileURL({ input: { id: report.file?.id as string } });

  // data?.generateFileURL.url
  // download file from url directly

  const url = data?.generateFileURL.url as string;

  const fullNameStudent = `${report.studentUser?.lastName}-${report.studentUser?.firstName}`.toLowerCase();
  // time of format YYYY-MM-DD-HH-MM-SS
  const time = formatDate(new Date(report.createdAt), "YYYY-MM-DD-HHMMss");
  const name = `${time}-${fullNameStudent}.pdf`;

  await forceDownload(url, name);

  downloadingFilesCount.value -= 1;
}

const { executeMutation: getFileURL } = useMutation(
  graphql(`
    mutation generateFileURL($input: GenerateFileURLInput!) {
      generateFileURL(input: $input) {
        url
      }
    }
  `)
);

function forceDownload(url: string, fileName: string) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL(this.response);
      const tag = document.createElement("a");
      tag.href = imageUrl;
      tag.download = fileName;
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
      resolve();
    };
    xhr.onerror = function () {
      reject(new Error("Failed to download the file."));
    };
    xhr.send();
  });
}
</script>
