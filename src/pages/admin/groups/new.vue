<template>
  <DGroupForm
    :emailAccount="(emailAccount as EmailAccount)"
    :title="$t('add_group')"
    @save="onCreateEmailAccount"
  ></DGroupForm>
</template>

<script lang="ts" setup>
import DGroupForm from "./DGroupForm.vue";
import { EmailAccount } from "@/gql/graphql";
import { reactive } from "vue";
import { useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { createNotification } from "@/composables/useToast";
import { useRouter } from "vue-router";
import { CreateEmailAccountInput } from "@/gql/graphql";

const router = useRouter();

const emailAccount = reactive<CreateEmailAccountInput>({
  name: "",
});

const { executeMutation: createEmailAccount } = useMutation(
  graphql(`
    mutation createEmailAccount($input: CreateEmailAccountInput!) {
      createEmailAccount(input: $input) {
        id
        name
        description
        createdAt
      }
    }
  `)
);

const onCreateEmailAccount = async () => {
  if (!emailAccount.name) {
    alert("Name is required");
    return;
  }

  const { error } = await createEmailAccount({
    input: {
      name: emailAccount.name,
    },
  });

  if (error) {
    createNotification({
      title: "EmailAccount creation failed",
      description: error.message,
    });
    return;
  }

  await router.push({ name: "admin-emailAccounts" });

  createNotification({
    title: "EmailAccount created",
    description: `${emailAccount.name} was created`,
  });
};
</script>
