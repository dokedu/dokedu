<template>
  <div>
    <form @submit.prevent="onSubmit" class="flex flex-col max-w-md mx-auto gap-4 py-24">
      <div class="flex flex-col">
        <label class="mb-1 text-sm text-stone-500" for="email">Email</label>
        <input v-model="email" type="email" name="email" id="email" class="rounded-md border border-stone-200 shadow">
      </div>
      <div class="flex flex-col">
        <label class="mb-1 text-sm text-stone-500" for="password">Password</label>
        <input v-model="password" type="password" name="password" id="password"
          class="rounded-md border border-stone-200 shadow">
      </div>
      <button class="py-1.5 bg-black text-white shadow rounded-md" type="submit">Log in</button>
      <pre>{{ error }}</pre>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import signInMutation from "../queries/signIn.mutation.ts";
import { useMutation } from "@urql/vue";
import { useRouter } from "vue-router";

const router = useRouter()

const email = ref("john@dokedu.org")
const password = ref("password")

const error = ref<null | string>(null)

const { executeMutation: signIn } = useMutation(signInMutation);

async function onSubmit() {
  const { data: { signIn: { token } } } = await signIn({
    email: email.value,
    password: password.value
  })

  if (token) {
    // parse jwt token
    const claims = JSON.parse(atob(token.split(".")[1]))
    console.log(claims)

    localStorage.setItem("enabled_apps", JSON.stringify(claims.enabled_apps))


    localStorage.setItem("authorization", token)
    await router.push({ name: "home" })
  } else {
    error.value = "Wrong password or email"
  }
}
</script>