<template>
  <header
    class="flex w-full items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-3 shadow-sm shadow-neutral-100"
  >
    <router-link to="/m/record/entries" class="flex items-center gap-4">
      <div class="h-6 w-6">
        <svg viewBox="0 0 138 138" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M69 0C50.7001 0 33.1496 7.26962 20.2096 20.2096C7.26962 33.1496 0 50.7001 0 69L0 138H69C87.2999 138 104.85 130.73 117.79 117.79C130.73 104.85 138 87.2999 138 69C138 50.7001 130.73 33.1496 117.79 20.2096C104.85 7.26962 87.2999 0 69 0V0ZM88.7996 91.7448C86.0091 94.5422 82.6933 96.7606 79.0427 98.2726C75.3921 99.7845 71.4787 100.56 67.5274 100.555H37.4451V70.4726C37.4454 65.5256 38.6656 60.6551 40.9978 56.2923C43.3299 51.9296 46.702 48.2094 50.8153 45.4611C54.9287 42.7128 59.6563 41.0214 64.5794 40.5366C69.5026 40.0518 74.4693 40.7886 79.0396 42.6818C83.61 44.5749 87.643 47.566 90.7813 51.39C93.9196 55.2141 96.0665 59.753 97.0316 64.6049C97.9968 69.4568 97.7505 74.4718 96.3146 79.2058C94.8787 83.9398 92.2975 88.2466 88.7996 91.7448Z"
            fill="black"
          />
        </svg>
      </div>
      <div class="text-lg font-medium">Einträge</div>
    </router-link>
    <div>
      <div
        class="h-8 w-8 flex justify-center items-center rounded-full bg-neutral-100 border border-neutral-200"
        @click="signOut"
      >
        <LogOutIcon :size="16" class="stroke-neutral-600" />
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useAuth } from "@/composables/auth";
import { LogOutIcon } from "lucide-vue-next";

const { signOut } = useAuth();
</script>
