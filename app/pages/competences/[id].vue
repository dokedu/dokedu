<script setup lang="ts">
const route = useRoute()
const id = computed(() => route.params.id)

const search = ref("")

const { data: competences } = await useFetch("/api/competences", {
  params: {
    search: search,
    competenceId: id,
  }
})
</script>

<template>
  <DPage>
    <DHeader>
      <DHeaderTitle>Kompetenzen</DHeaderTitle>
      <DInputSearch v-model="search" />
    </DHeader>

    <div class="block min-h-0 px-4 pt-2.5">
      <div class="grid grid-cols-2 items-center justify-between gap-4 border-b border-neutral-200 px-2 pb-2" :style="{ gridTemplateColumns: '1fr 110px' }">
        <div class="border-r border-neutral-200 text-sm font-medium text-neutral-900">Name</div>
        <div class="border-r border-neutral-200 text-sm font-medium text-neutral-900">Klassenstufen</div>
      </div>
    </div>

    <DPageContent>
      <NuxtLink
        :to="competence.competenceType === 'competence' ? undefined : `/competences/${competence.id}`"
        v-for="competence in competences"
        class="grid grid-cols-2 items-center justify-between gap-4 rounded px-2 py-2 hover:bg-neutral-100"
        :style="{ gridTemplateColumns: '1fr 110px' }"
      >
        <div class="line-clamp-1 text-sm text-neutral-700 cursor-default">
          <span v-if="competence.competenceType === 'competence'" class="cursor-default">{{ competence.name }}</span>
          <DTag v-else class="w-fit cursor-default" :color="`gray`">{{ competence.name }}</DTag>
        </div>
        <div class="line-clamp-1 text-right text-sm text-neutral-700">
          <template v-if="competence.grades"> {{ competence.grades[0] }} - {{ competence.grades[competence.grades.length - 1] }} </template>
        </div>
      </NuxtLink>
    </DPageContent>
  </DPage>
</template>
