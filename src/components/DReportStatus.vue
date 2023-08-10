<template>
  <div v-if="status === ReportStatus['Done']" class="w-fit rounded-lg bg-green-50 px-2 py-0.5 text-green-600">
    {{ $t("done") }}
  </div>
  <div v-else-if="status === ReportStatus['Error']" class="w-fit rounded-lg bg-red-50 px-2 py-0.5 text-red-600">
    {{ $t("error") }}
  </div>
  <div v-else-if="status === ReportStatus['Pending']" class="w-fit rounded-lg bg-yellow-50 px-2 py-0.5 text-yellow-600">
    {{ $t("pending") }}
  </div>
  <div v-else-if="status === ReportStatus['Processing']" class="w-fit rounded-lg bg-blue-50 px-2 py-0.5 text-blue-600">
    {{ $t("processing") }}
  </div>
</template>

<script lang="ts" setup>
import { ReportStatus } from "@/gql/graphql";
import { toRef } from "vue";

export interface Props {
  status: ReportStatus;
}

const props = defineProps<Props>();
const status = toRef(props, "status");
</script>
