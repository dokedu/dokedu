<template>
  <DGroupForm
    :emailAccount="(emailAccount as Group)"
    :title="$t('add_group')"
    @save="onCreateEmailAccount"
  ></DGroupForm>
</template>

<script lang="ts" setup>
import DGroupForm from "./DGroupForm.vue";
import { CreateGroupInput, Group } from "@/gql/graphql";
import { reactive, watch } from "vue";
import { useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { createNotification } from "@/composables/useToast";
import { useRouter } from "vue-router";

const router = useRouter();

const emailAccount = reactive<CreateGroupInput>({
  name: "",
  description: "",
  domain: "",
  users: [],
});

const { executeMutation: createEmailAccount } = useMutation(
  graphql(`
    mutation createGroup($input: CreateGroupInput!) {
      createGroup(input: $input) {
        id
        name
        description
      }
    }
  `)
);

watch(
  () => emailAccount.description,
  (newValue, oldValue) => {
    if (!newValue) return;
    if (emailAccount.name != oldValue?.toLowerCase().replace(/\s/g, ".")) return;
    const generated = newValue.toLowerCase().replace(/\s/g, ".");

    emailAccount.name = generated;
  }
);

const onCreateEmailAccount = async () => {
  if (!emailAccount.name) {
    alert("Name is required");
    return;
  }

  const { error } = await createEmailAccount({
    input: {
      name: emailAccount.name,
      description: emailAccount.description,
      domain: emailAccount.domain,
      users: emailAccount.users,
    },
  });

  if (error) {
    createNotification({
      title: "Group creation failed",
      description: error.message,
    });
    return;
  }

  await router.push({ name: "admin-groups" });

  createNotification({
    title: "Group created",
    description: `${emailAccount.name} was created`,
  });
};
</script>
