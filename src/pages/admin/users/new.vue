<template>
  <DUserForm :user="(user as User)" :title="$t('add_user')" @save="onCreateUser"></DUserForm>
</template>

<script lang="ts" setup>
import DUserForm from "./DUserForm.vue";
import { User, UserRole } from "@/gql/graphql";
import { reactive } from "vue";
import { useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { createNotification } from "@/composables/useToast";
import { useRouter } from "vue-router";
import { CreateUserInput } from "@/gql/graphql";

const router = useRouter();

const user = reactive<CreateUserInput>({
  firstName: "",
  lastName: "",
  email: "",
  role: UserRole.Admin,
});

const { executeMutation: createUser } = useMutation(
  graphql(`
    mutation createUser($user: CreateUserInput!) {
      createUser(input: $user) {
        id
        firstName
        lastName
      }
    }
  `)
);

const onCreateUser = async () => {
  if (!user.firstName) {
    alert("First name is required");
    return;
  }
  if (!user.lastName) {
    alert("Last name is required");
    return;
  }
  if (!user?.email) {
    alert("Email is required");
    return;
  }
  if (!user?.role) {
    alert("Role is required");
    return;
  }

  await createUser({
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });

  await router.push({ name: "admin-users" });

  createNotification({
    title: "User created",
    description: `${user.firstName} ${user.lastName} was created`,
  });
};
</script>
