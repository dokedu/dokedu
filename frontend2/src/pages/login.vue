<script setup lang="ts">
import { useRouter } from 'vue-router/auto'

const router = useRouter()

function submit() {
  router.push({ name: 'index' })
}
</script>

<template>
  <div class="h-full p-4 text-orange-950">
    <form @submit="submit" class="mx-auto flex max-w-xs flex-col gap-4 pt-24">
      <input
        class="rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-900 shadow-sm drop-shadow-sm placeholder:text-neutral-400"
        type="email"
        placeholder="Your email"
      />
      <input
        class="rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-900 shadow-sm drop-shadow-sm placeholder:text-neutral-400"
        type="password"
        placeholder="Your password"
      />
      <button
        class="rounded-md bg-neutral-950 px-3 py-2 text-sm text-neutral-50 shadow-sm drop-shadow-sm"
        type="submit"
      >
        Login
      </button>
    </form>
  </div>
</template>
