<template>
  <d-sidebar :title="title" :delete="deletable" @cancel="onCancel" @delete="onDelete">
    <template #main>
      <div class="flex flex-col gap-2">
        <d-input name="name" :label="$t('name')" v-model="emailAccount.name"></d-input>
        <d-select :options="domainOptions" :label="$t('domain')" v-model="domain">
          <div v-for="domain in domainData.domains.edges">{{ domain.name }}</div>
        </d-select>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-between">
        <d-button type="outline" size="md" @click="onCancel">{{ $t("cancel") }}</d-button>
        <d-button v-if="!emailAccount" type="primary" size="md" @click="onSave">{{ $t("create") }}</d-button>
      </div>
    </template>
  </d-sidebar>
</template>

<script lang="ts" setup>
import DSidebar from "@/components/d-sidebar/d-sidebar.vue";
import DSelect from "@/components/d-select/d-select.vue";
import { EmailAccount } from "@/gql/graphql";
import { graphql } from "@/gql";
import DInput from "@/components/d-input/d-input.vue";
import DButton from "@/components/d-button/d-button.vue";
import { computed, ref, toRef } from "vue";
import { useRouter } from "vue-router";
import { useQuery } from "@urql/vue";

const router = useRouter();
const domain = ref<string | undefined>(undefined);

const domainOptions = computed(
  () =>
    domainData?.value?.tags?.edges?.map((edge: any) => ({
      label: edge.name,
      value: edge.id,
    })) || []
);

export interface Props {
  emailAccount: EmailAccount;
  title: string;
  deletable?: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(["save", "delete"]);
const emailAccount = toRef(props, "emailAccount");

interface DNSRecord {
  hostname?: string;
  type: "MX" | "TXT";
  ttl?: number;
  value: string;
}

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

const records = computed<DNSRecord[]>(() => {
  return [
    {
      hostname: "",
      type: "MX",
      value: "10 mail.dokedu.org",
    },
    {
      type: "TXT",
      value: "v=spf1 ~all",
    },
    {
      // dkim
      type: "TXT",
      value: "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BA",
    },
  ] as DNSRecord[];
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
