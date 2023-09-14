<template>
  <PageWrapper>
    <PageHeader class="justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-stone-950">{{ $t("subject", 2) }}</div>
      </div>
      <div>
        <DButton type="primary" @click="onCreate">{{ $t("create") }}</DButton>
      </div>
    </PageHeader>
    <DTable
      v-model:variables="pageVariables"
      :search="search"
      :columns="columns"
      objectName="subjects"
      @row-click="goToSubject"
      :query="subjectsQuery"
    >
    </DTable>
  </PageWrapper>
  <router-view />
</template>

<script lang="ts" setup>
import PageWrapper from "@/components/page-wrapper.vue";
import PageHeader from "@/components/page-header.vue";
import DTable from "@/components/d-table/d-table.vue";
import DButton from "@/components/d-button/d-button.vue";
import { PageVariables } from "@/types/types.ts";
import { ref } from "vue";
import { useRouter } from "vue-router/auto";
import subjectsQuery from "@/queries/subjects.query.ts";

const search = ref("");

const router = useRouter();

const columns = [
  {
    label: "name",
    key: "name",
  },
];

const pageVariables = ref<PageVariables[]>([
  {
    search: "",
    limit: 50,
    offset: 0,
  },
]);

function goToSubject(item: any) {
  router.push({ name: "/school/subjects/[id]", params: { id: item.id } });
}

function onCreate() {
  router.push({ name: "/school/subjects/new" });
}
</script>
