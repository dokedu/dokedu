<template>
  <d-sidebar :title="title" :delete="deletable" @cancel="onCancel" @delete="onDelete">
    <template #main>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-6">
          <p class="w-[100px] text-sm font-semibold text-stone-600">{{ $t("description") }}</p>
          <d-input name="name" :placeholder="$t('description')" v-model="account.description" class="flex-1"></d-input>
        </div>
        <div class="flex items-center gap-6">
          <p class="w-[100px] text-sm font-semibold text-stone-600">{{ $t("name") }}</p>
          <d-input name="name" :placeholder="$t('name')" v-model="account.name" class="flex-1"></d-input>
        </div>
        <div class="flex items-center gap-6">
          <p class="w-[100px] text-sm font-semibold text-stone-600">Domain</p>
          <d-select :options="domainOptions" :label="$t('domain')" v-model="account.domain" class="flex-1"></d-select>
        </div>
        <div class="flex items-center gap-6">
          <p class="w-[100px] text-sm font-semibold text-stone-600">Users</p>
          <d-select
            v-model:search="userSearch"
            :options="userOptions"
            :label="$t('user', 2)"
            multiple
            v-model="account.users"
            class="flex-1"
          ></d-select>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-between">
        <d-button type="outline" size="md" @click="onCancel">{{ $t("cancel") }}</d-button>
        <d-button v-if="account.name" type="primary" size="md" @click="onSave">{{ $t("create") }}</d-button>
      </div>
    </template>
  </d-sidebar>
</template>

<script lang="ts" setup>
import DSidebar from "@/components/d-sidebar/d-sidebar.vue";
import DSelect from "@/components/d-select/d-select.vue";
import { Group } from "@/gql/graphql";
import { graphql } from "@/gql";
import DInput from "@/components/d-input/d-input.vue";
import DButton from "@/components/d-button/d-button.vue";
import { computed, ref, toRef } from "vue";
import { useRouter } from "vue-router";
import { useQuery } from "@urql/vue";

const router = useRouter();

const domainOptions = computed(
  () =>
    domainData?.value?.domains?.edges?.map((edge: any) => ({
      label: edge.name,
      value: edge.id,
    })) || []
);

export interface Props {
  emailAccount: Group;
  title: string;
  deletable?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["save", "delete"]);

const account = toRef(props, "emailAccount");

const { data: domainData } = useQuery({
  query: graphql(`
    query domains {
      domains {
        edges {
          id
          name
          createdAt
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
    }
  `),
});

const userSearch = ref("");
const { data: userData } = useQuery({
  query: graphql(`
    query groupUsers {
      emailAccounts(filter: { type: INDIVIDUAL }) {
        edges {
          id
          name
        }
      }
    }
  `),
});

const userOptions = computed(() => {
  return userData?.value?.emailAccounts?.edges?.map((edge: any) => ({
    label: edge.name,
    value: edge.id,
  }));
});

const onCancel = () => {
  router.push({ name: "admin-groups" });
};

const onDelete = () => {
  emit("delete");
};

const onSave = () => {
  emit("save");
};
</script>
