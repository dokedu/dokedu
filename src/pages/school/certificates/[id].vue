<template>
  <DSidebar :title="$t('subject')" @cancel="onClose">
    <template #main>
      <DInput name="name" :label="$t('name')" v-model="name" :placeholder="$t('name')" />
    </template>
    <template #footer>
      <DButton type="outline" @click="onClose">{{ $t("cancel") }}</DButton>
      <DButton @click="onSave">{{ $t("save") }}</DButton>
    </template>
  </DSidebar>
</template>

<script lang="ts" setup>
import DSidebar from "@/components/d-sidebar/d-sidebar.vue";
import DInput from "@/components/d-input/d-input.vue";
import DButton from "@/components/d-button/d-button.vue";
import { useRouter, useRoute } from "vue-router/auto";
import { computed } from "vue";
import { useMutation, useQuery } from "@urql/vue";
import subjectQuery from "@/queries/subject.query.ts";
import updateSubjectMutation from "@/queries/updateSubject.mutation.ts";

const router = useRouter();
const route = useRoute("/school/subjects/[id]");

const { data } = useQuery({
  query: subjectQuery,
  variables: {
    id: route.params.id,
  },
});

const { executeMutation: updateSubject } = useMutation(updateSubjectMutation);

const name = computed({
  get() {
    return data.value?.subject.name || "";
  },
  set(value: string) {
    if (!data.value) return;
    data.value.subject.name = value;
  },
});

function onClose() {
  router.push({ name: "/school/subjects" });
}

async function onSave() {
  await updateSubject({ id: route.params.id, name: name.value });

  router.push({ name: "/school/subjects" });
}
</script>
