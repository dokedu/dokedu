<template>
  <PageWrapper>
    <PageHeader class="flex select-none justify-between">
      <div class="font-medium text-stone-950">Reports</div>
      <div class="flex gap-2">
        <d-button type="transparent" :icon-left="Newspaper">Prepare annual reports</d-button>
        <router-link :to="{ name: 'record-reports-new' }">
          <d-button type="primary" :icon-left="Plus">Create</d-button>
        </router-link>
      </div>
    </PageHeader>
    <PageContent>
      <div class="flex select-none flex-col overflow-scroll">
        <table>
          <thead>
            <tr class="border-b border-stone-100 bg-stone-50">
              <th class="p-2 pl-8 text-left text-sm font-normal text-strong">Schüler</th>
              <th class="p-2 text-left text-sm font-normal text-strong">Von</th>
              <th class="p-2 text-left text-sm font-normal text-strong">Bis</th>
              <th class="p-2 text-left text-sm font-normal text-strong">Status</th>
              <th class="p-2 text-left text-sm font-normal text-strong">Ersteller</th>
              <th class="p-2 text-left text-sm font-normal text-strong">Erstellt am</th>
              <th class="p-2 pr-8 text-left text-sm font-normal text-strong">Datei</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in (data?.reports?.edges as Report[])" :key="report.id" class="border-b border-stone-100">
              <td class="p-2 pl-8 text-left text-sm font-normal text-default">
                {{ `${report?.studentUser?.firstName} ${report.studentUser?.lastName}` }}
              </td>
              <td class="p-2 text-left text-sm font-normal text-default">
                {{ formatDate(new Date(report.from), "DD.MM.YYYY") }}
              </td>
              <td class="p-2 text-left text-sm font-normal text-default">
                {{ formatDate(new Date(report.to), "DD.MM.YYYY") }}
              </td>
              <td class="p-2 text-left text-sm font-normal text-default">
                <DReportStatus :status="report.status"></DReportStatus>
              </td>
              <td class="p-2 text-left text-sm font-normal text-default">
                {{ `${report.user?.firstName} ${report.user?.lastName}` }}
              </td>
              <td class="p-2 text-left text-sm font-normal text-default">
                {{ formatDate(new Date(report.createdAt), "DD.MM.YYYY HH:ss") }} Uhr
              </td>
              <td
                v-if="report?.status === 'done'"
                class="p-2 pr-8 text-left text-sm font-normal text-default hover:underline"
                @click="downloadFile(report)"
              >
                Download
              </td>
              <td v-else class="p-2 pr-8 text-left text-sm font-normal text-default"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </PageContent>
  </PageWrapper>
  <!-- requesting download file toast -->
  <div
    v-if="downloadingFilesCount > 0"
    class="fixed bottom-4 right-4 flex select-none gap-2 rounded-md bg-white px-4 py-2 text-sm shadow-md"
  >
    <div class="animate-spin">
      <Loader2 :size="20" />
    </div>
    <div>downloading file</div>
  </div>
</template>
<script setup lang="ts">
import { Newspaper } from "lucide-vue-next";
import PageHeader from "@/components/PageHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import DButton from "@/components/d-button/d-button.vue";
import PageContent from "@/components/PageContent.vue";
import { Plus, Loader2 } from "lucide-vue-next";
import { useQuery, useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { formatDate } from "@vueuse/core";
import { Report } from "@/gql/graphql";
import DReportStatus from "./DReportStatus.vue";
import { ref } from "vue";

const { data } = useQuery({
  query: graphql(`
    query reports {
      reports {
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
  `),
});

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
