<template>
  <DDomainForm :domain="(domain as Domain)" :title="$t('add_domain')" @save="onCreateDomain"></DDomainForm>
</template>

<script lang="ts" setup>
import DDomainForm from "@/components/d-domain-form.vue";
import { Domain } from "@/gql/graphql";
import { reactive } from "vue";
import { useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { createNotification } from "@/composables/useToast";
import { useRouter } from "vue-router/auto";
import { CreateDomainInput } from "@/gql/graphql";

const router = useRouter();

const domain = reactive<CreateDomainInput>({
  name: "",
});

const { executeMutation: createDomain } = useMutation(
  graphql(`
    mutation createDomain($input: CreateDomainInput!) {
      createDomain(input: $input) {
        id
        name
        createdAt
      }
    }
  `)
);

const onCreateDomain = async () => {
  if (!domain.name) {
    alert("Name is required");
    return;
  }

  const { error } = await createDomain({
    input: {
      name: domain.name,
    },
  });

  if (error) {
    createNotification({
      title: "Domain creation failed",
      description: error.message,
    });
    return;
  }

  await router.push({ name: "/admin/domains" });

  createNotification({
    title: "Domain created",
    description: `${domain.name} was created`,
  });
};
</script>
