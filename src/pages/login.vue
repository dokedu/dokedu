<template>
  <div>
    <form @submit.prevent="signIn" class="flex flex-col max-w-md mx-auto gap-4 py-24">
      <div class="flex flex-col">
        <label class="mb-1 text-sm text-neutral-500" for="email">Email</label>
        <input v-model="email" type="email" name="email" id="email" class="rounded-md border border-neutral-200 shadow">
      </div>
      <div class="flex flex-col">
        <label class="mb-1 text-sm text-neutral-500" for="password">Password</label>
        <input v-model="password" type="password" name="password" id="password" class="rounded-md border border-neutral-200 shadow">
      </div>
      <button class="py-1.5 bg-black text-white shadow rounded-md" type="submit">Log in</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";

const email = ref("john@dokedu.org")
const password = ref("password")

function signIn() {
  console.log("signIn");
}
</script>