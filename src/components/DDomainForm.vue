<template>
  <d-sidebar :title="title" :delete="deletable" @cancel="onCancel" @delete="onDelete">
    <template #main>
      <div class="flex flex-col gap-2">
        <d-input name="name" :label="$t('name')" :disabled="!!domain.id" v-model="domain.name"></d-input>
        <div v-if="domain.id" class="select-none">
          <div class="mb-1 mt-2 text-sm text-subtle">Your DNS records</div>

          <div class="rounded-md border border-stone-300 p-1 text-subtle shadow-sm">
            <div class="grid gap-4 p-2 text-sm" style="grid-template-columns: 1fr 1fr 1fr 2fr">
              <div class="text-strong">Host name</div>
              <div class="text-strong">Type</div>
              <div class="text-strong">TTL</div>
              <div class="text-strong">Data</div>

              <template v-for="record in records">
                <div class="select-all">{{ record.hostname }}</div>
                <div class="select-all">{{ record.type }}</div>
                <div class="select-all">{{ record.ttl }}</div>
                <div class="select-all truncate">{{ record.value }}</div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-between">
        <d-button type="outline" size="md" @click="onCancel">{{ $t("cancel") }}</d-button>
        <d-button v-if="!domain.id" type="primary" size="md" @click="onSave">{{ $t("create") }}</d-button>
      </div>
    </template>
  </d-sidebar>
</template>

<script lang="ts" setup>
import DSidebar from "@/components/d-sidebar/d-sidebar.vue";
import { Domain } from "@/gql/graphql.ts";
import DInput from "@/components/d-input/d-input.vue";
import DButton from "@/components/d-button/d-button.vue";
import { computed, toRef } from "vue";
import { useRouter } from "vue-router/auto";

const router = useRouter();

export interface Props {
  domain: Domain;
  title: string;
  deletable?: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(["save", "delete"]);
const domain = toRef(props, "domain");

interface DNSRecord {
  hostname?: string;
  type: "MX" | "TXT";
  ttl?: number;
  value: string;
}

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
      type: "TXT",
      value:
        'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2iuKGW084CSLAV4eg+56nXs6rx/YCypG2ZRLJY8zhttyJm6UGoa2M78JBPyHmtO2fn8zQw7b1dVHjLYI79F+2GvjTF9K0RYIaUPXAvU1Hfh83OLbcvMwAQKgRPsYZSIF72Q6fHLSGs6Boqz9dFTPziQkoh1a86EnFbb4NoLt8CHYjqeW6mHP3ZaLZkwWsST1A" "HS133F4XMopYrZ/HGKFdpJg3LbmYGwuK6Yh0adRvVpFJLdB5GfcCoLGloo8UKw7tT1E2Nr6V5Hn3nuy5GniORAf5neXBEnHBM3rXv2JBUFrnAUKb7iAqaxJtm6BMT7MlXq76zSFR4JaRerzptPdrQIDAQAB',
    },
    {
      type: "TXT",
      value: "v=DMARC1; p=none; rua=mailto:postmaster@domain.com; ruf=mailto:postmaster@domain.com",
    },
  ] as DNSRecord[];
});

const onCancel = () => {
  router.push({ name: "/admin/domains" });
};

const onDelete = () => {
  emit("delete");
};

const onSave = () => {
  emit("save");
};
</script>
