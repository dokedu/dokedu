<template>
  <div v-if="data?.user">
    <DStudentForm
      :student="data.user"
      :title="$t('edit_student')"
      deletable
      @save="onEditStudent"
      @delete="onDeleteStudent"
    />
  </div>
</template>

<script lang="ts" setup>
import DStudentForm from "@/components/d-student-form.vue"
import { computed, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router/auto"
import { createNotification } from "@/composables/useToast"
import { useAdminStudentByIdQuery } from "@/gql/queries/users/adminStudentById"
import { useUpdateStudentMutation } from "@/gql/mutations/users/updateStudent"
import { useArchiveStudentMutation } from "@/gql/mutations/users/archiveStudent"

const route = useRoute<"/school/students/[id]">()
const router = useRouter()
const id = computed(() => route.params.id as string)

const { data } = useAdminStudentByIdQuery({
  variables: reactive({ id })
})

const { executeMutation: updateStudent } = useUpdateStudentMutation()
const { executeMutation: archiveStudent } = useArchiveStudentMutation()

const onEditStudent = async () => {
  const student = ref(data?.value?.user)

  if (!student.value?.firstName) {
    alert("First name is required")
    return
  }
  if (!student.value?.lastName) {
    alert("Last name is required")
    return
  }
  if (!student.value?.student?.grade) {
    alert("Grade is required")
    return
  }
  if (student.value.student.grade < 0 || student.value.student.grade > 13) {
    alert("Grade must be between 0 and 13")
    return
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
      emoji: student.value.student?.emoji,
      missedHours: student.value.student?.missedHours || 0,
      missedHoursExcused: student.value.student?.missedHoursExcused || 0
    }
  })

  createNotification({
    title: "Student updated",
    description: `${student.value.firstName} ${student.value.lastName} was updated`
  })
}

const onDeleteStudent = async () => {
  const student = data?.value?.user

  await archiveStudent({ id: id.value })

  await router.push({ name: "/school/students" })

  createNotification({
    title: "Student updated",
    description: `${student?.firstName} ${student?.lastName} was updated`
  })
}
</script>
