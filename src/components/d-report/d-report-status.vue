<template>
  <div :class="statusClass" class="w-fit rounded-lg px-2 py-0.5">
    {{ statusText }}
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { ReportStatus } from "@/gql/graphql.ts";
import { toRef } from "vue";

import i18n from "@/i18n.ts";

export interface Props {
  status: ReportStatus;
}

const props = defineProps<Props>();
const status = toRef(props, "status");

const statusMap = {
  [ReportStatus.Done]: {
    text: "done",
    class: "bg-green-50 text-green-600",
  },
  [ReportStatus.Error]: {
    text: "error",
    class: "bg-red-50 text-red-600",
  },
  [ReportStatus.Pending]: {
    text: "pending",
    class: "bg-yellow-50 text-yellow-600",
  },
  [ReportStatus.Processing]: {
    text: "processing",
    class: "bg-blue-50 text-blue-600",
  },
};

const statusClass = computed(() => statusMap[status.value]?.class || "");
const statusText = computed(() => i18n.global.t(statusMap[status.value]?.text || ""));
</script>
