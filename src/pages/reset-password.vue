<template>
  <div class="select-none text-sm">
    <form @submit.prevent="onSubmit" class="mx-auto flex max-w-xs flex-col gap-2 py-24 text-strong">
      <div class="flex flex-col gap-4">
        <img height="67" width="100" class="mx-auto mb-4 w-2/5" src="/dokedu-logo.svg" alt="dokedu logo" />
        <div class="flex flex-col">
          <label class="mb-1 text-xs text-stone-500" for="password">Password</label>
          <input
            v-model="password"
            type="password"
            name="password"
            id="password"
            required
            min="8"
            class="block w-full rounded-md border-0 py-2 text-stone-900 shadow-sm ring-1 ring-inset ring-stone-300 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
            placeholder="Your new password"
          />
        </div>
        <div class="flex flex-col">
          <label class="mb-1 text-xs text-stone-500" for="password">Confirm password</label>
          <input
            v-model="passwordConfirm"
            type="password"
            name="confirm-password"
            id="confirm-password"
            required
            min="8"
            class="block w-full rounded-md border-0 py-2 text-stone-900 shadow-sm ring-1 ring-inset ring-stone-300 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
            placeholder="Please confirm your password"
          />
        </div>
      </div>
      <button
        class="block rounded-md bg-black px-2.5 py-2.5 text-sm font-medium leading-none text-white shadow-sm hover:bg-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        type="submit"
      >
        Reset password
      </button>
      <router-link
        class="mx-auto mt-2 block w-fit rounded-md text-center text-xs font-medium leading-none text-muted hover:text-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        to="/login"
      >
        Back to sign in
      </router-link>
    </form>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "layout": "auth"
  }
}
</route>

<script lang="ts" setup>
import { ref } from "vue";
import { useMutation } from "@urql/vue";
import { useRoute, useRouter } from "vue-router/auto";
import { graphql } from "@/gql";

const route = useRoute();
const router = useRouter();

const { executeMutation: passwordReset } = useMutation(
  graphql(`
    mutation resetPassword($input: ResetPasswordInput!) {
      resetPassword(input: $input) {
        success
      }
    }
  `)
);

const password = ref("");
const passwordConfirm = ref("");

async function onSubmit() {
  const token = route.hash.slice(1).split("&")[0].split("=")[1];

  if (password.value !== passwordConfirm.value) {
    alert("Passwords do not match");
    return;
  }

  if (!token) {
    alert("Invalid token");
    return;
  }

  if (password.value.length < 8) {
    alert("Password must be at least 8 characters long");
    return;
  }

  const { data } = await passwordReset({
    input: {
      token,
      password: password.value,
    },
  });

  if (data?.resetPassword?.success) {
    alert("Password reset successfully");
    await router.push("/login");
  } else {
    alert("Something went wrong");
  }
}
</script>
