<template>
  <div v-if="data?.emailAccount">
    <d-group-form
      :email-account="(data.emailAccount as EmailAccount)"
      :title="$t('edit_group')"
      deletable
      @delete="onDeleteGroup"
      @save="onEditGroup"
    ></d-group-form>
  </div>
</template>

<script lang="ts" setup>
import DGroupForm from "./DGroupForm.vue";
import { useQuery, useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { computed, reactive } from "vue";
import { useRoute } from "vue-router";
import { createNotification } from "@/composables/useToast";
import router from "@/router";
import { EmailAccount } from "@/gql/graphql";

const route = useRoute();
const id = computed(() => route.params.id as string);

const { data } = useQuery({
  query: graphql(`
    query adminGroupById($id: ID!) {
      emailAccount(id: $id) {
        id
        name
        description
        members {
          name
        }
      }
    }
  `),
  variables: reactive({ id }),
});

const { executeMutation: deleteGroup } = useMutation(
  graphql(`
    mutation deleteEmailGroup($id: ID!) {
      deleteEmailGroup(id: $id) {
        id
        name
      }
    }
  `)
);

const { executeMutation: editGroup } = useMutation(
  graphql(`
    mutation editEmailGroup($input: UpdateEmailGroupInput!) {
      updateEmailGroup(input: $input) {
        id
        name
        description
      }
    }
  `)
);

const onDeleteGroup = async () => {
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

  router.push("/admin/groups");
};

const onEditGroup = async (input: { name: string; domain: string; members: string[] }) => {
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

  router.push("/admin/groups");
};
</script>
