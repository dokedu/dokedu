<template>
  <page-wrapper>
    <page-header class="select-none justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-neutral-950">General</div>
      </div>
    </page-header>
    <div class="flex select-none gap-4 px-8 py-4 text-sm text-subtle">
      <div class="flex w-full max-w-xl flex-col gap-4">
        <d-input v-model="name" label="Name" type="text" name="name" />
        <d-input v-model="legalName" label="Legal name" type="text" name="legal-name" />
        <d-button size="md" @click="onSave">Save changes</d-button>
      </div>
    </div>
  </page-wrapper>
  <router-view />
</template>

<script lang="ts" setup>
import PageHeader from "@/components/page-header.vue";
import PageWrapper from "@/components/page-wrapper.vue";
import DButton from "@/components/d-button/d-button.vue";
import DInput from "@/components/d-input/d-input.vue";
import { graphql } from "@/gql";
import { useMutation, useQuery } from "@urql/vue";
import { computed } from "vue";
import { createNotification } from "@/composables/useToast";

async function onSave() {
  if (!data?.value?.organisation) return;

  await updateOrganisation({
    input: {
      id: data.value.organisation.id,
      name: name.value,
      legalName: legalName.value,
    },
  });

  createNotification({
    title: "Organisation updated",
    description: `The organisation ${name.value} was updated.`,
  });
}

const { data } = useQuery({
  query: graphql(`
    query organisation {
      organisation {
        id
        name
        legalName
      }
    }
  `),
});

const name = computed({
  get: () => {
    if (!data?.value?.organisation) return "";
    return data.value?.organisation?.name as string;
  },
  set: (value) => {
    if (!data?.value?.organisation) return;
    data.value.organisation.name = value as string;
  },
});
const legalName = computed({
  get: () => {
    if (!data?.value?.organisation) return "";
    return data.value?.organisation?.legalName as string;
  },
  set: (value) => {
    if (!data?.value?.organisation) return;
    data.value.organisation.legalName = value as string;
  },
});

const { executeMutation: updateOrganisation } = useMutation(
  graphql(`
    mutation updateOrganisation($input: UpdateOrganisationInput!) {
      updateOrganisation(input: $input) {
        id
        name
        legalName
      }
    }
  `),
);
</script>
