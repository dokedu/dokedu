<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next"

const { data: tags, refresh } = await useFetch("/api/tags")

const search = ref("")

const filtered = computed(() => {
  let items = tags.value ?? []

  if (search.value) {
    items = items.filter((s) => s.name.toLowerCase().includes(search.value.toLowerCase()))
  }

  return items
})

const id = ref<string | null>(null)
const name = ref("")
const color = ref<string | null>(null)

const colorOptions = useTailwindColors().map((color) => ({
  value: color.key,
  display: color.title
}))

const modal = ref<string | null>(null)

function close() {
  modal.value = null
}

async function update() {
  if (!name.value) return
  if (!color.value) return
  await $fetch("/api/tags", {
    method: "PUT",
    body: {
      id: modal.value,
      name: name.value,
      color: color.value
    }
  })
  await refresh()
  reset()
  close()
}

async function create() {
  $fetch("/api/tags", {
    method: "POST",
    body: {
      name: name.value,
      color: color.value
    }
  })
  await refresh()
  reset()
  close()
}

function reset() {
  id.value = null
  name.value = ""
  color.value = null
}

function openCreateModal() {
  reset()
  modal.value = "new"
}

function openUpdateModal(tag: any) {
  id.value = tag.id
  name.value = tag.name
  color.value = tag.color
  modal.value = "update"
}
</script>

<template>
  <DPage>
    <DHeader>
      <DHeaderTitle>Tags</DHeaderTitle>
      <DInputSearch v-model="search" />

      <template #right>
        <DButton to="/tags/new" :icon-left="PlusIcon" @click="openCreateModal">Tag erstellen</DButton>
      </template>
    </DHeader>

    <DPageContent>
      <div v-for="tag in filtered" @click="openUpdateModal(tag)" class="flex justify-between gap-4 rounded p-2 hover:bg-neutral-100">
        <DTag :color="tag.color">{{ tag.name }}</DTag>
      </div>
    </DPageContent>

    <div v-if="modal === 'update'">
      <DModal titel="Tag" @close="close" @confirm="update" confirm-text="Aktualisieren">
        <div class="flex flex-col gap-4 p-4">
          <DInput v-model="name" name="name" placeholder="Name" />
          <DSelect v-model="color" name="color" id="color" placeholder="Bitte wähle eine Farbe" :options="colorOptions" />
        </div>
      </DModal>
    </div>

    <div v-if="modal === 'new'">
      <DModal titel="Tag erstellen" @close="close" @confirm="create" confirm-text="Erstellen">
        <div class="flex flex-col gap-4 p-4">
          <DInput v-model="name" name="name" placeholder="Name" />
          <DSelect v-model="color" name="color" id="color" placeholder="Bitte wähle eine Farbe" :options="colorOptions" />
        </div>
      </DModal>
    </div>
  </DPage>
</template>
