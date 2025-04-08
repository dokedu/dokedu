<script setup lang="ts">
const { data: tags } = await useFetch("/api/tags")

const search = ref("")

const filtered = computed(() => {
  let items = tags.value ?? []

  if (search.value) {
    items = items.filter((s) => s.name.toLowerCase().includes(search.value.toLowerCase()))
  }

  return items
})
</script>

<template>
  <DPage>
    <DHeader>
      <DHeaderTitle>Tags</DHeaderTitle>
      <DInputSearch v-model="search" />

      <!-- <template #right>
        <DButton to="/tags/new" :icon-left="PlusIcon" @click="">Tag erstellen</DButton>
      </template> -->
    </DHeader>

    <DPageContent>
      <div v-for="tag in filtered" :to="`/tags/${tag.id}`" class="flex justify-between gap-4 rounded p-2 hover:bg-neutral-100">
        <DTag :color="tag.color">{{ tag.name }}</DTag>
      </div>
    </DPageContent>

    <NuxtPage />
  </DPage>
</template>
