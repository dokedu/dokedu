<script setup lang="ts">
const router = useRouter()

const store = useStore()

const name = ref("")
const color = ref<string | null>(null)

async function close() {
  await router.push("/tags")
}

async function create() {
  if (!name.value) return
  if (!color.value) return
  await store.createTag(name.value, color.value)
  await close()
}

const colors = useTailwindColors()

const colorOptions = colors.map((color) => ({
  value: color.key,
  display: color.title
}))
</script>

<template>
  <DModal titel="Tag erstellen" @close="close" @confirm="create" confirm-text="Erstellen">
    <div class="flex flex-col gap-4 p-4">
      <DInput v-model="name" name="name" placeholder="Name" />
      <DSelect v-model="color" name="color" id="color" placeholder="Bitte wähle eine Farbe" :options="colorOptions" />
    </div>
  </DModal>
</template>
