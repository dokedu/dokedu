<template>
  <PageWrapper>
    <PageHeader class="flex select-none justify-between">
      <div class="font-medium text-neutral-950">{{ $t("report", 2) }}</div>
      <div class="flex gap-2">
        <d-button v-if="false" type="transparent" :icon-left="Newspaper">{{ $t("prepare_annual_reports") }}</d-button>
        <router-link :to="{ name: '/record/reports/new' }">
          <d-button type="primary" :icon-left="Plus">{{ $t("create") }}</d-button>
        </router-link>
      </div>
    </PageHeader>
    <DTable :columns="columns" objectName="reports" :query="ReportsDocument" v-model:variables="pageVariables">
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
        {{ formatDate(new Date(column), "DD.MM.YYYY HH:ss") }} {{ $t("o_clock") }}
      </template>
      <template #file-data="{ item }">
        <div
          v-if="item?.status === 'done' && item.file"
          class="p-2 pr-8 text-left text-sm font-normal text-default hover:underline"
          @click="downloadReport(item)"
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
import { Newspaper } from "lucide-vue-next"
import PageHeader from "@/components/page-header.vue"
import PageWrapper from "@/components/page-wrapper.vue"
import DButton from "@/components/d-button/d-button.vue"
import { Plus, Loader2 } from "lucide-vue-next"
import { formatDate } from "@vueuse/core"
import type { Report } from "@/gql/schema"
import DReportStatus from "@/components/d-report/d-report-status.vue"
import { ref } from "vue"
import DTable from "@/components/d-table/d-table.vue"
import type { PageVariables } from "@/types/types"
import useDownloadFile from "@/composables/useDownloadFile"
import { ReportsDocument } from "@/gql/queries/reports/reports"

const columns = [
  {
    key: "student",
    label: "student"
  },
  {
    key: "from",
    label: "from",
    width: 0.1
  },
  {
    key: "to",
    label: "to",
    width: 0.1
  },
  {
    key: "status",
    label: "status"
  },
  {
    key: "createdBy",
    label: "created_by"
  },
  {
    key: "createdAt",
    label: "created_at"
  },
  {
    key: "file",
    label: "file",
    width: 0.15
  }
]

const pageVariables = ref<PageVariables[]>([
  {
    limit: 30,
    offset: 0,
    nextPage: undefined
  }
])

const downloadingFilesCount = ref(0)

// TODO: refactor into utility function
async function downloadReport(report: Report) {
  const file = report.file
  if (!file) return

  downloadingFilesCount.value += 1

  const fullNameStudent = `${report.studentUser?.lastName}-${report.studentUser?.firstName}`.toLowerCase()
  const time = formatDate(new Date(report.createdAt), "YYYY-MM-DD-HHMMss")
  const name = `${time}-${fullNameStudent}.pdf`

  await downloadFile(file, name)

  downloadingFilesCount.value -= 1
}

const { downloadFile } = useDownloadFile()
</script>
