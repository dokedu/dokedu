<template>
  <page-wrapper>
    <page-header class="select-none justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-stone-950">General</div>
      </div>
    </page-header>
    <div class="flex select-none gap-4 px-8 py-4 text-sm text-subtle">
      <div class="flex w-full max-w-xl flex-col gap-4">
        <d-input v-model="name" label="Name" type="text" name="name" />
        <d-input v-model="legalName" label="Legal name" type="text" name="legal-name" />
        <d-button size="md" @click="onSave">Save changes</d-button>
      </div>
    </div>
  </page-wrapper>
  <router-view />
</template>

<script lang="ts" setup>
import PageHeader from "@/components/PageHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import DButton from "@/components/d-button/d-button.vue";
import DInput from "@/components/d-input/d-input.vue";
import { ref } from "vue";

const name = ref("Muster");
const legalName = ref("Muster GmbH");

function onSave() {
  alert("Not implemented");
}
</script>
