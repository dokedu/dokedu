<template>
  <div id="page" class="flex">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useMeQuery } from "@/gql/queries/auth/me.ts";

const { executeQuery: refresh } = useMeQuery({
  requestPolicy: "network-only",
});

onMounted(() => {
  refresh();
});
</script>
