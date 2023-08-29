<template>
  <div id="page" class="flex">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import me from "@/queries/me";
import { useQuery } from "@urql/vue";
import { onMounted } from "vue";

const { executeQuery: refresh } = useQuery({ query: me, requestPolicy: "network-only" });

onMounted(() => {
  refresh();
});
</script>
