<template>
  <div v-if="data?.user">
    <d-user-form
      :user="(data.user as User)"
      :title="$t('edit_user')"
      deletable
      @save="onEditUser"
      @delete="onDeleteUser"
    ></d-user-form>
  </div>
</template>

<script lang="ts" setup>
import DUserForm from "./DUserForm.vue";
import { useQuery, useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { computed, reactive, ref } from "vue";
import { User } from "@/gql/graphql";
import { useRoute } from "vue-router";
import { createNotification } from "@/composables/useToast";
import router from "@/router";

const route = useRoute();
const id = computed(() => route.params.id as string);

const { data } = useQuery({
  query: graphql(`
    query adminUserById($id: ID!) {
      user(id: $id) {
        id
        firstName
        lastName
        email
        role
      }
    }
  `),
  variables: reactive({ id }),
});
const { executeMutation: updateUser } = useMutation(
  graphql(`
    mutation updateUser($input: UpdateUserInput!) {
      updateUser(input: $input) {
        id
        firstName
        lastName
        email
        role
      }
    }
  `)
);

const { executeMutation: archiveUser } = useMutation(
  graphql(`
    mutation archiveUser($id: ID!) {
      archiveUser(id: $id) {
        id
        firstName
        lastName
        email
        role
      }
    }
  `)
);

const onEditUser = async () => {
  const user = ref(data?.value?.user);

  if (!user.value?.firstName) {
    alert("First name is required");
    return;
  }
  if (!user.value?.lastName) {
    alert("Last name is required");
    return;
  }
  if (!user.value?.email) {
    alert("Email is required");
    return;
  }
  if (!user.value?.role) {
    alert("Role is required");
    return;
  }

  await updateUser({
    input: {
      id: user.value.id as string,
      firstName: user.value.firstName as string,
      lastName: user.value.lastName as string,
      email: user.value.email as string,
    },
  });

  createNotification({
    title: "User updated",
    description: `${user.value.firstName} ${user.value.lastName} was updated`,
  });
};

const onDeleteUser = async () => {
  const user = data?.value?.user;

  await archiveUser({ id: id.value });

  await router.push({ name: "admin-users" });

  createNotification({
    title: "User updated",
    description: `${user?.firstName} ${user?.lastName} was updated`,
  });
};
</script>
