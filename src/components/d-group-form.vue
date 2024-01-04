<template>
  <d-sidebar :title="title" :delete="deletable" @cancel="onCancel" @delete="onDelete">
    <template #main>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-6">
          <p class="w-[100px] text-sm font-semibold text-neutral-600">{{ $t("description") }}</p>
          <div class="flex-1 space-y-1">
            <d-input name="name" :placeholder="$t('description')" v-model="account.description as string"></d-input>
            <p class="text-sm text-red-500" v-if="errors.description">{{ errors.description }}</p>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <p class="w-[100px] text-sm font-semibold text-neutral-600">{{ $t("name") }}</p>
          <div class="flex-1 space-y-1">
            <d-input name="name" :placeholder="$t('name')" v-model="name" class="flex-1"></d-input>
            <p class="text-sm text-red-500" v-if="errors.name">{{ errors.name }}</p>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <p class="w-[100px] text-sm font-semibold text-neutral-600">{{ $t("domain") }}</p>
          <div class="flex-1 space-y-1">
            <d-select :options="domainOptions" :label="$t('domain')" v-model="domain" class="flex-1" />
            <p class="text-sm text-red-500" v-if="errors.domain">{{ errors.domain }}</p>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <p class="w-[100px] text-sm font-semibold text-neutral-600">{{ $t("user", 2) }}</p>
          <d-select
            v-model:search="userSearch"
            :options="userOptions"
            searchable
            :label="$t('user', 2)"
            multiple
            v-model="members"
            class="flex-1"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-between">
        <d-button type="outline" size="md" @click="onCancel">{{ $t("cancel") }}</d-button>
        <d-button type="primary" size="md" @click="onSave">{{ deletable ? $t("save") : $t("create") }}</d-button>
      </div>
    </template>
  </d-sidebar>
</template>

<script lang="ts" setup>
import DSidebar from "@/components/d-sidebar/d-sidebar.vue";
import DSelect from "@/components/d-select/d-select.vue";
import DInput from "@/components/d-input/d-input.vue";
import DButton from "@/components/d-button/d-button.vue";
import { computed, ref, toRef, watch } from "vue";
import { useRouter } from "vue-router/auto";
import { useI18n } from "vue-i18n";
import { useDomainsQuery } from "@/gql/queries/domains/domains.ts";
import { useGroupUsersQuery } from "@/gql/queries/emailAccounts/groupUsers.ts";
import { EmailAccount } from "@/gql/schema.ts";

const router = useRouter();
const t = useI18n().t;

const domainOptions = computed(
  () =>
    domainData?.value?.domains?.edges?.map((edge: any) => ({
      label: edge.name,
      value: edge.name,
    })) || [],
);

export interface Props {
  emailAccount: EmailAccount;
  title: string;
  deletable?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["save", "delete"]);

const account = toRef(props, "emailAccount");
const name = ref(account.value.name.split("@")[0]);
const domain = ref(account.value.name.split("@")[1]);
const members = ref(
  account.value.members?.map((member) => {
    if (!member) return;
    return member.name;
  }) as string[],
);

const { data: domainData } = useDomainsQuery({});

const userSearch = ref("");
const { data: userData } = useGroupUsersQuery({});

const userOptions = computed(() => {
  return userData?.value?.emailAccounts?.edges?.map((edge: any) => ({
    label: edge.name,
    value: edge.name,
  }));
});

watch(
  () => account.value.description,
  (newValue, oldValue) => {
    if (!newValue) return;
    if (name.value != oldValue?.toLowerCase().replace(/\s/g, ".")) return;
    name.value = newValue.toLowerCase().replace(/\s/g, ".");
  },
);

const onCancel = () => {
  router.push({ name: "/admin/groups" });
};

const onDelete = () => {
  emit("delete");
};

const errors = ref({
  description: "",
  name: "",
  domain: "",
});

const onSave = () => {
  errors.value = {
    description: "",
    name: "",
    domain: "",
  };

  if (!account.value.description) {
    errors.value.description = t("description_required");
  }
  if (!name.value) {
    errors.value.name = t("name_required");
  }

  if (!domain.value) {
    errors.value.domain = t("domain_required");
  }

  // Check if name doesn't have spaces
  if (name.value.includes(" ")) {
    errors.value.name = t("name_spaces");
  }

  // Return if errors
  if (errors.value.description || errors.value.name || errors.value.domain) {
    return;
  }

  emit("save", {
    name: `${name.value}@${domain.value}`,
    domain: domain.value,
    members: members.value,
  });
};
</script>
