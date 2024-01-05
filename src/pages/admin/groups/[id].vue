<template>
  <div v-if="data?.emailAccount">
    <d-group-form
      :email-account="data.emailAccount as EmailAccount"
      :title="$t('edit_group')"
      deletable
      @delete="onDeleteGroup"
      @save="onEditGroup"
    ></d-group-form>
  </div>
</template>

<script lang="ts" setup>
import DGroupForm from "@/components/d-group-form.vue";
import { computed, reactive } from "vue";
import { useRoute } from "vue-router/auto";
import { createNotification } from "@/composables/useToast";
import router from "@/router/router.ts";
import { useAdminGroupByIdQuery } from "@/gql/queries/emailAccounts/adminGroupById.ts";
import { useDeleteEmailGroupMutation } from "@/gql/mutations/emailGroups/deleteEmailGroup.ts";
import { useEditEmailGroupMutation } from "@/gql/mutations/emailGroups/editEmailGroup.ts";
import { EmailAccount } from "@/gql/schema.ts";

const route = useRoute<"/admin/groups/[id]">();
const id = computed(() => route.params.id as string);

const { data } = useAdminGroupByIdQuery({
  variables: reactive({ id }),
});

const { executeMutation: deleteGroup } = useDeleteEmailGroupMutation();
const { executeMutation: editGroup } = useEditEmailGroupMutation();

async function onDeleteGroup() {
  const { error } = await deleteGroup({ id: data?.value?.emailAccount?.id as string });

  if (error) {
    createNotification({
      title: "Error",
      description: error.message,
    });
    return;
  }

  createNotification({
    title: "Success",
    description: "Group deleted",
  });

  await router.push("/admin/groups");
}

async function onEditGroup(input: { name: string; domain: string; members: string[] }) {
  const { error } = await editGroup({
    input: {
      id: data?.value?.emailAccount?.id as string,
      name: input.name,
      description: data?.value?.emailAccount?.description as string,
      members: input.members,
    },
  });

  if (error) {
    createNotification({
      title: "Error",
      description: error.message,
    });
    return;
  }

  createNotification({
    title: "Success",
    description: "Group updated",
  });

  await router.push("/admin/groups");
}
</script>
