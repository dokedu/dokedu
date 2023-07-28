<template>
  <div v-if="data?.group">
    <d-group-form
      :email-account="(data.group as Group)"
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
import { Group } from "@/gql/graphql";
import { useRoute } from "vue-router";
import { createNotification } from "@/composables/useToast";
import router from "@/router";

const route = useRoute();
const id = computed(() => route.params.id as string);

const { data } = useQuery({
  query: graphql(`
    query adminGroupById($id: ID!) {
      group(id: $id) {
        id
        name
        description
        domain
        users
      }
    }
  `),
  variables: reactive({ id }),
});

const { executeMutation: deleteGroup } = useMutation(
  graphql(`
    mutation deleteGroup($id: ID!) {
      deleteGroup(id: $id) {
        id
        name
        domain
      }
    }
  `)
);

const { executeMutation: editGroup } = useMutation(
  graphql(`
    mutation editGroup($input: UpdateGroupInput!) {
      updateGroup(input: $input) {
        id
        name
        description
        domain
      }
    }
  `)
);

const onDeleteGroup = async () => {
  const { error } = await deleteGroup({ id: data?.value?.group?.id as string });

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

const onEditGroup = async () => {
  const { error } = await editGroup({
    input: {
      id: data?.value?.group?.id as string,
      name: data?.value?.group?.name as string,
      description: data?.value?.group?.description as string,
      domain: data?.value?.group?.domain as string,
      users: data?.value?.group?.users as string[],
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
