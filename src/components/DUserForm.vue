<template>
  <d-sidebar @cancel="onCancel" :title="title">
    <template #header v-if="deletable">
      <div class="select-none text-sm font-medium text-strong">{{ title }}</div>
      <div class="flex gap-2">
        <d-button v-if="!user.inviteAccepted" type="transparent" size="xs" :icon-left="Mail" @click="onSendInvite">{{
          $t("send_invite")
        }}</d-button>
        <d-button type="transparent" size="xs" :icon-left="Lock" @click="onResetPassword">{{
          $t("reset_password")
        }}</d-button>
        <d-button type="transparent" size="xs" :icon-left="Trash" @click="onDelete">{{ $t("delete") }}</d-button>
      </div>
    </template>
    <template #main>
      <div class="flex flex-col gap-2">
        <d-input name="firstName" :label="$t('first_name')" v-model="user.firstName"></d-input>
        <d-input name="lastName" :label="$t('last_name')" v-model="user.lastName"></d-input>
        <d-input name="email" :label="$t('email')" v-model="(user.email as string)"></d-input>
        <div class="flex flex-col">
          <label class="mb-1 text-sm text-stone-500" for="role">{{ $t("role") }}</label>
          <select
            v-model="(user.role as string)"
            name="role"
            id="role"
            class="rounded-md border border-stone-200 text-sm shadow"
            :disabled="!!user.id"
            :class="{ '!cursor-not-allowed': !!user.id }"
          >
            <option value disabled>{{ $t("select_role") }}</option>
            <option value="owner">{{ $t("owner") }}</option>
            <option value="admin">{{ $t("admin") }}</option>
            <option value="teacher">{{ $t("teacher") }}</option>
          </select>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-between">
        <d-button type="outline" size="md" @click="onCancel">{{ $t("cancel") }}</d-button>
        <d-button v-if="user.id" type="primary" size="md" @click="onSave">{{ $t("save") }}</d-button>
        <d-button v-else type="primary" size="md" @click="onSave">{{ $t("create") }}</d-button>
      </div>
    </template>
  </d-sidebar>
</template>

<script lang="ts" setup>
import DSidebar from "@/components/d-sidebar/d-sidebar.vue";
import { User } from "@/gql/graphql";
import { useRouter } from "vue-router/auto";
import DInput from "@/components/d-input/d-input.vue";
import DButton from "@/components/d-button/d-button.vue";
import { toRef } from "vue";
import { Trash, Mail, Lock } from "lucide-vue-next";

const router = useRouter();

export interface Props {
  user: User;
  title: string;
  deletable?: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(["save", "delete", "reset-password", "invite"]);
const user = toRef(props, "user");

const onCancel = () => {
  router.push({ name: "/admin/users" });
};

const onDelete = () => {
  emit("delete");
};

const onSave = () => {
  emit("save");
};

const onResetPassword = () => {
  emit("reset-password");
};

const onSendInvite = () => {
  emit("invite");
};
</script>
