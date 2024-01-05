<template>
  <DSidebar :title="$t('school_year')" @cancel="onClose">
    <template #main>
      <DInput name="year" :label="$t('year')" type="number" v-model="year" :placeholder="$t('year')" />
    </template>
    <template #footer>
      <DButton type="outline" @click="onClose">{{ $t("cancel") }}</DButton>
      <DButton @click="onSave">{{ $t("create") }}</DButton>
    </template>
  </DSidebar>
</template>

<script lang="ts" setup>
import DSidebar from "@/components/d-sidebar/d-sidebar.vue"
import DInput from "@/components/d-input/d-input.vue"
import DButton from "@/components/d-button/d-button.vue"
import { useRouter } from "vue-router/auto"
import { ref } from "vue"
import { useCreateSchoolYearMutation } from "@/gql/mutations/schoolYears/createSchoolYear"

const router = useRouter()

const year = ref("")

const { executeMutation: createSchoolYear } = useCreateSchoolYearMutation()

function onClose() {
  router.push({ name: "/school/school_years" })
}

async function onSave() {
  const { error } = await createSchoolYear({ year: Number.parseInt(year.value) })
  if (error) {
    alert(error.message)
    return
  }

  year.value = ""

  await router.push({ name: "/school/school_years" })
}
</script>
