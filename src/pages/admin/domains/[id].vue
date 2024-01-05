<template>
  <div v-if="data?.domain">
    <d-domain-form :domain="data.domain as Domain" :title="$t('edit_domain')" deletable
      @delete="onDeleteDomain"></d-domain-form>
  </div>
</template>

<script lang="ts" setup>
import DDomainForm from "@/components/d-domain-form.vue"
import { computed, reactive } from "vue"
import { createNotification } from "@/composables/useToast"
import { useRoute, useRouter } from "vue-router/auto"
import { useAdminDomainByIdQuery } from "@/gql/queries/domains/adminDomainById"
import { useDeleteDomainMutation } from "@/gql/mutations/domains/deleteDomain"
import type { Domain } from "@/gql/schema"

const route = useRoute<"/admin/domains/[id]">()
const router = useRouter()
const id = computed(() => route.params.id as string)

const { data } = useAdminDomainByIdQuery({
  variables: reactive({ id })
})

const { executeMutation: deleteDomain } = useDeleteDomainMutation()

const onDeleteDomain = async () => {
  const domain = data?.value?.domain

  await deleteDomain({ input: { id: id.value } })

  await router.push({ name: "/admin/domains" })

  createNotification({
    title: "Domain deleted",
    description: `${domain?.name} was updated`
  })
}
</script>
