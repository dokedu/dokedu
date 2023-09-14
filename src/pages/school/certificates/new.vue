<template>
  <DSidebar :title="$t('subject')" @cancel="onClose">
    <template #main>
      <DInput name="name" :label="$t('name')" v-model="name" :placeholder="$t('name')" />
    </template>
    <template #footer>
      <DButton type="outline" @click="onClose">{{ $t("cancel") }}</DButton>
      <DButton @click="onSave">{{ $t("create") }}</DButton>
    </template>
  </DSidebar>
</template>

<script lang="ts" setup>
import DSidebar from "@/components/d-sidebar/d-sidebar.vue";
import DInput from "@/components/d-input/d-input.vue";
import DButton from "@/components/d-button/d-button.vue";
import { useRouter } from "vue-router/auto";
import { ref } from "vue";
import { useMutation } from "@urql/vue";
import createSubjectMutation from "@/queries/createSubject.mutation.ts";

const router = useRouter();

const name = ref("");

const { executeMutation: createSubject } = useMutation(createSubjectMutation);

function onClose() {
  router.push({ name: "/school/subjects" });
}

async function onSave() {
  await createSubject({ name: name.value });

  name.value = "";

  await router.push({ name: "/school/subjects" });
}
</script>
