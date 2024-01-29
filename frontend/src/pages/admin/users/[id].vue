<template>
  <div v-if="data?.user">
    <d-user-form
      :user="data.user as User"
      :title="$t('edit_user')"
      deletable
      @save="onEditUser"
      @delete="onDeleteUser"
      @invite="onInviteUser"
      @resetPassword="onResetPassword"
    ></d-user-form>
  </div>
</template>

<script lang="ts" setup>
import DUserForm from "@/components/d-user-form.vue"
import { computed, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router/auto"
import { createNotification } from "@/composables/useToast"
import { useI18n } from "vue-i18n"
import type { User } from "@/gql/schema"
import { useAdminUserByIdQuery } from "@/gql/mutations/users/adminUserById"
import { useUpdateUserMutation } from "@/gql/mutations/users/updateUser"
import { useArchiveUserMutation } from "@/gql/queries/users/archiveUser"
import { useForgotPasswordMutation } from "@/gql/mutations/auth/forgotPassword"
import { useSendInviteMutation } from "@/gql/mutations/users/sendInvite"

const route = useRoute<"/admin/users/[id]">()
const router = useRouter()
const id = computed(() => route.params.id as string)
const { t } = useI18n()

const { data } = useAdminUserByIdQuery({
  variables: reactive({ id })
})

const { executeMutation: updateUser } = useUpdateUserMutation()
const { executeMutation: archiveUser } = useArchiveUserMutation()

const onEditUser = async () => {
  const user = ref(data?.value?.user)

  if (!user.value?.firstName) {
    alert("First name is required")
    return
  }
  if (!user.value?.lastName) {
    alert("Last name is required")
    return
  }
  if (!user.value?.email) {
    alert("Email is required")
    return
  }
  if (!user.value?.role) {
    alert("Role is required")
    return
  }

  await updateUser({
    input: {
      id: user.value.id as string,
      firstName: user.value.firstName as string,
      lastName: user.value.lastName as string,
      email: user.value.email as string
    }
  })

  createNotification({
    title: "User updated",
    description: `${user.value.firstName} ${user.value.lastName} was updated`
  })
}

const { executeMutation: forgotPassword } = useForgotPasswordMutation()
const { executeMutation: inviteUser } = useSendInviteMutation()

const onInviteUser = async () => {
  const user = ref(data?.value?.user)
  if (user.value?.inviteAccepted) {
    alert(t("user_already_invited"))
    return
  }

  const { error } = await inviteUser({
    id: user.value?.id as string
  })

  if (!error) {
    createNotification({
      title: t("invite_sent"),
      description: t("user_invite_sent", { firstName: user.value?.firstName, lastName: user.value?.lastName })
    })
  }
}

const onResetPassword = async () => {
  const user = ref(data?.value?.user)
  const { error } = await forgotPassword({
    input: {
      email: user.value?.email as string
    }
  })

  if (!error) {
    createNotification({
      title: t("reset_password"),
      description: t("password_reset_sent", { email: user.value?.email })
    })
  }
}

const onDeleteUser = async () => {
  const user = data?.value?.user

  await archiveUser({ id: id.value })

  await router.push({ name: "/admin/users" })

  createNotification({
    title: "User updated",
    description: `${user?.firstName} ${user?.lastName} was updated`
  })
}
</script>
