<script setup lang="ts">
import { ref } from 'vue'
import { gql, useMutation } from '@urql/vue'
import DInput from '@/components/d-input/d-input.vue'
import DButton from '@/components/d-button/d-button.vue'
import { useRouter } from 'vue-router/auto'
import { authToken } from '@/utils/authToken'

const router = useRouter()

const email = ref('')
const password = ref('')

const { executeMutation: signIn } = useMutation(gql`
  mutation signIn($input: SignInInput!) {
    signIn(input: $input) {
      token
      language
      user {
        id
        firstName
        lastName
      }
    }
  }
`)

async function submit() {
  const payload = { email: email.value, password: password.value }
  const { data, error } = await signIn({ input: payload })
  if (error) {
    alert(error.message)
    return
  }
  if (data?.signIn?.user) {
    authToken.value = data.signIn.token

    await router.push('/')
  }
}
</script>

<template>
  <div class="h-full p-4 text-orange-950">
    <form @submit.prevent="submit" class="mx-auto flex max-w-[300px] flex-col gap-4 pt-24">
      <d-input label="Email" type="email" v-model="email" placeholder="Your email" />
      <d-input label="Password" type="password" v-model="password" placeholder="Your password" />
      <d-button variant="primary" size="md" submit>Login</d-button>
    </form>
  </div>
</template>
