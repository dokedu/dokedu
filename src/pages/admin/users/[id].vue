<template>
  <div v-if="data?.user">
    <d-user-form
      :user="(data.user as User)"
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
import DUserForm from "@/components/DUserForm.vue";
import { useQuery, useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { computed, reactive, ref } from "vue";
import { User } from "@/gql/graphql";
import { useRoute, useRouter } from "vue-router/auto";
import { createNotification } from "@/composables/useToast";
import { useI18n } from "vue-i18n";

const route = useRoute<"/admin/users/[id]">();
const router = useRouter();
const id = computed(() => route.params.id as string);
const { t } = useI18n();

const { data } = useQuery({
  query: graphql(`
    query adminUserById($id: ID!) {
      user(id: $id) {
        id
        firstName
        lastName
        email
        role
        inviteAccepted
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

const { executeMutation: forgotPassword } = useMutation(
  graphql(`
    mutation forgotPassword($input: ForgotPasswordInput!) {
      forgotPassword(input: $input) {
        success
      }
    }
  `)
);

const { executeMutation: inviteUser } = useMutation(
  graphql(`
    mutation sendInvite($id: ID!) {
      sendUserInvite(id: $id)
    }
  `)
);

const onInviteUser = async () => {
  const user = ref(data?.value?.user);
  if (user.value?.inviteAccepted) {
    alert(t("user_already_invited"));
    return;
  }

  const { error } = await inviteUser({
    id: user.value?.id as string,
  });

  if (!error) {
    createNotification({
      title: t("invite_sent"),
      description: t("user_invite_sent", { firstName: user.value?.firstName, lastName: user.value?.lastName }),
    });
  }
};

const onResetPassword = async () => {
  const user = ref(data?.value?.user);
  const { error } = await forgotPassword({
    input: {
      email: user.value?.email as string,
    },
  });

  if (!error) {
    createNotification({
      title: t("reset_password"),
      description: t("password_reset_sent", { email: user.value?.email }),
    });
  }
};

const onDeleteUser = async () => {
  const user = data?.value?.user;

  await archiveUser({ id: id.value });

  await router.push({ name: "/admin/users" });

  createNotification({
    title: "User updated",
    description: `${user?.firstName} ${user?.lastName} was updated`,
  });
};
</script>
