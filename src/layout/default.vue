<template>
  <div id="page" class="flex" v-if="width > 900">
    <PageSidebar />
    <main class="flex w-[calc(100vw-230px)] print:w-full">
      <router-view />
    </main>
  </div>
  <div v-else class="flex min-h-screen items-center justify-center p-4">
    <div class="flex flex-col items-center gap-4">
      <div class="space-y-1 text-center">
        <div class="text-2xl font-semibold text-stone-950">{{ $t("mobile_not_supported") }}</div>
        <div class="mb-4 text-sm text-stone-700">{{ $t("mobile_not_supported_description") }}</div>
      </div>
      <DButton @click="onLogOut">{{ $t("log_out") }}</DButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageSidebar from "../components/page-sidebar.vue";
import { useWindowSize } from "@vueuse/core";
import DButton from "@/components/d-button/d-button.vue";
import { useAuth } from "@/composables/auth";
import { useQuery } from "@urql/vue";
import me from "@/queries/me";
import { onMounted } from "vue";

const { width } = useWindowSize();

const onLogOut = async () => {
  await useAuth().signOut();
};

const { executeQuery: refresh } = useQuery({ query: me, requestPolicy: "network-only" });

onMounted(() => {
  refresh();
});
</script>
