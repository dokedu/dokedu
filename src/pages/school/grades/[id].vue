<template>
  <DSidebar :title="$t('subject')" @cancel="onClose">
    <template #main>
      <DInput name="student_name" :disabled="true" :label="$t('student_name')" :modelValue="studentFullName" />
      <DInput name="school_year" :disabled="true" :label="$t('school_year')" :modelValue="schoolYear" />
      <DInput name="subject" :disabled="true" :label="$t('subject')" :modelValue="subject" />
      <DInput name="grade" type="number" :label="$t('grade')" v-model="grade" :placeholder="$t('grade')" />
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
import userStudentGrade from "@/queries/userStudentGrade.query.ts";
import updateUserStudentGradeMutation from "@/queries/updateUserStudentGrade.mutation.ts";

const router = useRouter();
const route = useRoute("/school/grades/[id]");

const { data } = useQuery({
  query: userStudentGrade,
  variables: {
    id: route.params.id,
  },
});

const { executeMutation: updateGrade } = useMutation(updateUserStudentGradeMutation);

const grade = computed({
  get() {
    return data.value?.userStudentGrade.grade || 0;
  },
  set(value: number) {
    if (!data.value) return;
    data.value.userStudentGrade.grade = value;
  },
});

const studentFullName = computed(() => {
  if (!data.value) return "";
  return `${data.value.userStudentGrade.student.user.firstName} ${data.value.userStudentGrade.student.user.lastName}`;
});
const schoolYear = computed(() => {
  if (!data.value) return "";
  return `${data.value.userStudentGrade.schoolYear.description}`;
});
const subject = computed(() => {
  if (!data.value) return "";
  return `${data.value.userStudentGrade.subject.name}`;
});

function onClose() {
  router.push({ name: "/school/grades" });
}

async function onSave() {
  await updateGrade({ id: route.params.id, grade: grade.value });

  router.push({ name: "/school/grades" });
}
</script>
