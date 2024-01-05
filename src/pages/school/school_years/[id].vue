<template>
  <DSidebar :title="$t('schoolYear')" @cancel="onClose">
    <template #main>
      <DInput name="year" :label="$t('year')" type="number" v-model="year" :placeholder="$t('year')" />
    </template>
    <template #footer>
      <DButton type="outline" @click="onClose">{{ $t("cancel") }}</DButton>
      <DButton @click="onSave">{{ $t("save") }}</DButton>
    </template>
  </DSidebar>
</template>

<script lang="ts" setup>
import DSidebar from "@/components/d-sidebar/d-sidebar.vue"
import DInput from "@/components/d-input/d-input.vue"
import DButton from "@/components/d-button/d-button.vue"
import { useRouter, useRoute } from "vue-router/auto"
import { computed } from "vue"
import { useUpdateSchoolYearMutation } from "@/gql/mutations/schoolYears/updateSchoolYear"
import { useSchoolYearQuery } from "@/gql/queries/schoolYears/schoolYear"

const router = useRouter()
const route = useRoute("/school/school_years/[id]")

const { data } = useSchoolYearQuery({
  variables: {
    id: route.params.id
  }
})

const { executeMutation: updateSchoolYear } = useUpdateSchoolYearMutation()

const year = computed({
  get() {
    return data.value?.schoolYear.year || 0
  },
  set(value: number) {
    if (!data.value) return
    data.value.schoolYear.year = value
  }
})

function onClose() {
  router.push({ name: "/school/school_years" })
}

async function onSave() {
  await updateSchoolYear({ id: route.params.id, year: year.value })

  router.push({ name: "/school/school_years" })
}
</script>
