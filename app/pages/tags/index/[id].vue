<script setup lang="ts">
const router = useRouter()
const id = useRouteParams<string>("id")
const store = useStore()
const { tags } = storeToRefs(store)

const currentTag = ref(undefined)
const name = ref("")
const color = ref<string | null>(null)

onMounted(async () => {
  currentTag.value = tags.value.find((el) => el.id === id.value)
  if (currentTag.value) {
    name.value = currentTag.value.name || ""
    color.value = currentTag.value.color || null
  }
})

async function close() {
  await router.push("/tags")
}

async function update() {
  if (!currentTag.value) return

  currentTag.value.name = name.value
  currentTag.value.color = color.value

  await store.updateTag({
    id: currentTag.value.id,
    name: currentTag.value.name,
    color: currentTag.value.color
  })
  await close()
}

const colors = useTailwindColors()
const colorOptions = colors.map((color) => ({
  value: color.key,
  display: color.title
}))

async function archiveTag() {
  if (!currentTag.value) return
  await store.updateTag({
    id: currentTag.value.id,
    name: currentTag.value.name,
    color: currentTag.value.color,
    deletedAt: new Date()
  })
  await close()
}
</script>

<template>
  <DModal titel="Tag" @close="close" @confirm="update" confirm-text="Aktualisieren">
    <div class="flex flex-col gap-4 p-4">
      <DInput v-model="name" name="name" placeholder="Name" />
      <DSelect v-model="color" name="color" id="color" placeholder="Bitte wähle eine Farbe" :options="colorOptions" />
    </div>
  </DModal>
</template>
