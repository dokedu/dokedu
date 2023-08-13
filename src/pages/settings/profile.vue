<template>
  <page-wrapper>
    <page-header class="select-none justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-stone-950">Profile</div>
      </div>
    </page-header>
    <div class="flex select-none gap-4 px-8 py-4 text-sm text-subtle">
      <div class="flex w-full max-w-xl flex-col gap-4 rounded-lg bg-stone-100 p-6">
        <div class="font-medium text-stone-950">Change your password</div>

        <d-input v-model="password" name="password" label="Password" type="password" placeholder="Password" />
        <d-input
          v-model="passwordConfirm"
          name="confirm-password"
          label="Confirm password"
          type="password"
          placeholder="Confirm password"
        />

        <d-button size="md" @click="onSave">Save password</d-button>
      </div>
    </div>
  </page-wrapper>
  <router-view />
</template>

<script lang="ts" setup>
import PageHeader from "@/components/PageHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import DButton from "@/components/d-button/d-button.vue";
import DInput from "@/components/d-input/d-input.vue";
import { ref } from "vue";
import { useMutation } from "@urql/vue";
import resetPasswordMutation from "@/queries/resetPasswordMutation";

const password = ref("");
const passwordConfirm = ref("");

const { executeMutation: passwordReset } = useMutation(resetPasswordMutation);

async function onSave() {
  if (password.value.length < 8) {
    alert("Password must be at least 8 characters");
    return;
  }
  if (password.value !== passwordConfirm.value) {
    alert("Passwords do not match");
    return;
  }

  const res = await passwordReset({ input: { password: password.value } });
  if (res.error) {
    alert("Error changing password");
    return;
  }

  alert("Password changed successfully");
}
</script>
