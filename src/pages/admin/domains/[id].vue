<template>
  <div v-if="data?.domain">
    <d-domain-form
      :domain="data.domain as Domain"
      :title="$t('edit_domain')"
      deletable
      @delete="onDeleteDomain"
    ></d-domain-form>
  </div>
</template>

<script lang="ts" setup>
import DDomainForm from "@/components/d-domain-form.vue";
import { useQuery, useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { computed, reactive } from "vue";
import { Domain } from "@/gql/graphql";
import { createNotification } from "@/composables/useToast";
import { useRoute, useRouter } from "vue-router/auto";

const route = useRoute<"/admin/domains/[id]">();
const router = useRouter();
const id = computed(() => route.params.id as string);

const { data } = useQuery({
  query: graphql(`
    query adminDomainById($id: ID!) {
      domain(id: $id) {
        id
        name
        createdAt
      }
    }
  `),
  variables: reactive({ id }),
});

const { executeMutation: deleteDomain } = useMutation(
  graphql(`
    mutation deleteDomain($input: DeleteDomainInput!) {
      deleteDomain(input: $input) {
        name
        createdAt
      }
    }
  `),
);

const onDeleteDomain = async () => {
  const domain = data?.value?.domain;

  await deleteDomain({ input: { id: id.value } });

  await router.push({ name: "/admin/domains" });

  createNotification({
    title: "Domain deleted",
    description: `${domain?.name} was updated`,
  });
};
</script>
