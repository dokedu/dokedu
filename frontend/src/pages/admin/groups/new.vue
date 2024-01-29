<template>
  <DGroupForm :emailAccount="emailAccount as EmailAccount" :title="$t('add_group')" @save="onCreateEmailAccount">
  </DGroupForm>
</template>

<script lang="ts" setup>
import DGroupForm from "@/components/d-group-form.vue"
import { reactive } from "vue"
import { createNotification } from "@/composables/useToast"
import { useRouter } from "vue-router/auto"
import { useCreateEmailGroupMutation } from "@/gql/queries/emailAccounts/createEmailGroup"
import type { CreateEmailGroupInput, EmailAccount } from "@/gql/schema"

const router = useRouter()

const emailAccount = reactive<CreateEmailGroupInput>({
  name: "",
  description: "",
  members: []
})

const { executeMutation: createEmailAccount } = useCreateEmailGroupMutation()

async function onCreateEmailAccount(input: { name: string; domain: string; members: string[] }) {
  const { error } = await createEmailAccount({
    input: {
      name: input.name,
      description: emailAccount.description,
      members: input.members
    }
  })

  if (error) {
    createNotification({
      title: "Group creation failed",
      description: error.message
    })
    return
  }

  await router.push({ name: "/admin/groups" })

  createNotification({
    title: "Group created",
    description: `${emailAccount.name} was created`
  })
}
</script>
