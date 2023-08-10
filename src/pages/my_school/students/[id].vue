<template>
  <div v-if="data?.user">
    <DStudentForm
      :student="(data.user as User)"
      :title="$t('edit_student')"
      deletable
      @save="onEditStudent"
      @delete="onDeleteStudent"
    ></DStudentForm>
  </div>
</template>

<script lang="ts" setup>
import DStudentForm from "@/components/DStudentForm.vue";
import { useQuery, useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { computed, reactive, ref } from "vue";
import { User } from "@/gql/graphql";
import { useRoute, useRouter } from "vue-router/auto";
import { createNotification } from "@/composables/useToast";

const route = useRoute<"/my_school/students/[id]">();
const router = useRouter();
const id = computed(() => route.params.id as string);

const { data } = useQuery({
  query: graphql(`
    query adminStudentById($id: ID!) {
      user(id: $id) {
        id
        firstName
        lastName
        role
        student {
          id
          grade
          birthday
          joinedAt
          leftAt
        }
      }
    }
  `),
  variables: reactive({ id }),
});
const { executeMutation: updateStudent } = useMutation(
  graphql(`
    mutation updateStudent($student: UpdateUserInput!) {
      updateUser(input: $student) {
        id
        firstName
        lastName
        role
        student {
          id
          birthday
          grade
          leftAt
          joinedAt
        }
      }
    }
  `)
);

const { executeMutation: archiveStudent } = useMutation(
  graphql(`
    mutation archiveStudent($id: ID!) {
      archiveUser(id: $id) {
        id
        firstName
        lastName
        role
        student {
          birthday
          grade
          leftAt
          joinedAt
        }
      }
    }
  `)
);

const onEditStudent = async () => {
  const student = ref(data?.value?.user);

  if (!student.value?.firstName) {
    alert("First name is required");
    return;
  }
  if (!student.value?.lastName) {
    alert("Last name is required");
    return;
  }
  if (!student.value?.student?.grade) {
    alert("Grade is required");
    return;
  }
  if (student.value.student.grade < 0 || student.value.student.grade > 13) {
    alert("Grade must be between 0 and 13");
    return;
  }

  await updateStudent({
    student: {
      id: student.value.id,
      firstName: student.value.firstName,
      lastName: student.value.lastName,
      grade: student.value.student?.grade,
      birthday: student.value.student?.birthday,
      leftAt: student.value.student?.leftAt,
      joinedAt: student.value.student?.joinedAt,
    },
  });

  await createNotification({
    title: "Student updated",
    description: `${student.value.firstName} ${student.value.lastName} was updated`,
  });
};

const onDeleteStudent = async () => {
  const student = data?.value?.user;

  await archiveStudent({ id: id.value });

  await router.push({ name: "/my_school/students" });

  createNotification({
    title: "Student updated",
    description: `${student?.firstName} ${student?.lastName} was updated`,
  });
};
</script>
