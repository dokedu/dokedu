<template>
  <DStudentForm :student="student" :title="$t('add_student')" @save="onCreateStudent"></DStudentForm>
</template>

<script lang="ts" setup>
import DStudentForm from "@/components/d-student-form.vue"
import type { User } from "@/gql/schema"
import { reactive } from "vue"
import { createNotification } from "@/composables/useToast"
import { useRouter } from "vue-router/auto"
import { useCreateStudentMutation } from "@/gql/mutations/users/createStudent"

const router = useRouter()

const student = reactive<User>({
  firstName: "",
  lastName: "",
  // @ts-expect-error
  student: {
    grade: 0,
    birthday: null,
    leftAt: null,
    joinedAt: null,
    emoji: null
  }
})

const { executeMutation: createStudent } = useCreateStudentMutation()

const onCreateStudent = async () => {
  if (!student.firstName) {
    alert("First name is required")
    return
  }
  if (!student.lastName) {
    alert("Last name is required")
    return
  }
  if (!student.student?.grade) {
    alert("Grade is required")
    return
  }
  if (student.student.grade < 0 || student.student.grade > 13) {
    alert("Grade must be between 0 and 13")
    return
  }

  await createStudent({
    student: {
      firstName: student.firstName,
      lastName: student.lastName,
      grade: student.student?.grade,
      birthday: student.student?.birthday,
      leftAt: student.student?.leftAt,
      joinedAt: student.student?.joinedAt,
      emoji: student.student?.emoji
    }
  })

  await router.push({ name: "/school/students" })

  createNotification({
    title: "Student created",
    description: `${student.firstName} ${student.lastName} was created`
  })
}
</script>
