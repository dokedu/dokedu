<template>
  <div class="select-none text-sm">
    <form @submit.prevent="onSubmit" class="mx-auto flex max-w-xs flex-col gap-2 py-24 text-strong">
      <div class="flex flex-col">
        <img height="67" width="100" class="mx-auto mb-8 w-2/5" src="/dokedu-logo.svg" alt="dokedu logo" />
        <label class="mb-1 text-xs text-stone-500" for="email">Email</label>
        <input
          v-model="email"
          type="email"
          name="email"
          id="email"
          required
          class="block w-full rounded-md border-0 py-2 text-stone-900 shadow-sm ring-1 ring-inset ring-stone-300 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
          placeholder="Your email address"
        />

        <div class="mt-1 text-xs text-red-500">
          {{ error?.graphQLErrors[0].message }}
        </div>
      </div>
      <button
        class="block rounded-md bg-black px-2.5 py-2.5 text-sm font-medium leading-none text-white shadow-sm hover:bg-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        type="submit"
      >
        Send password reset email
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

<script lang="ts" setup>
import { ref } from "vue";
import signInMutation from "../queries/signIn.mutation.ts";
import { useMutation } from "@urql/vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");

const { executeMutation: signIn, error } = useMutation(signInMutation);

async function onSubmit() {
  const {
    data: {
      signIn: { token },
    },
  } = await signIn({
    email: email.value,
    password: password.value,
  });

  if (token) {
    // parse jwt token
    const claims = JSON.parse(atob(token.split(".")[1]));
    console.log(claims);

    localStorage.setItem("enabled_apps", JSON.stringify(claims.enabled_apps));

    localStorage.setItem("authorization", token);
    await router.push({ name: "record-entries" });
  } else {
    error.value = "Wrong password or email";
  }
}
</script>
