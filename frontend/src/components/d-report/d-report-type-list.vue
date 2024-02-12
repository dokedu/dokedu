<template>
  <div class="w-full">
    <DCombobox :options="typeOptions" :placeholder="$t('type')" v-model="type" class="w-full">
      <template #display>
        <div v-if="type" class="py-1">
          <div class="mb-1 text-sm font-medium">{{ types.find((t) => t.value === type)?.label }}</div>
          <div class="text-xs text-neutral-500">
            {{ types.find((t) => t.value === type)?.description }}
          </div>
        </div>
        <div v-else class="text-sm">
          {{ $t("select_type") }}
        </div>
      </template>
      <template v-slot="{ option }">
        <div>
          <div class="mb-1 font-medium">{{ option.label }}</div>
          <div class="text-xs text-neutral-500">
            {{ types.find((t) => t.value === option.value)?.description }}
          </div>
        </div>
      </template>
    </DCombobox>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import DCombobox from "../d-combobox/d-combobox.vue"
import { useVModel } from "@vueuse/core"

const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits(["update:modelValue"])

const type = useVModel(props, "modelValue", emit)

export type ReportType = {
  label: string
  kind: string
  format: string
}

const { t } = useI18n()

const types = computed(() => [
  { label: t("entry", 2), value: "entries", format: "pdf", description: "Alle Einträge von dem ausgewählten Schüler" },
  {
    label: t("competence", 2),
    value: "competences",
    format: "pdf",
    description: "Alle Kompetenzen von dem ausgewählten Schüler"
  },
  {
    label: t("learned_competences", 2),
    value: "learned_competences",
    format: "pdf",
    description: "Alle gelernten Kompetenzen von dem ausgewählten Schüler"
  }
  // { label: t("all_entries", 2), kind: "all_entries", format: "pdf", description: "Alle Einträge von allen Schülern" },
])

const typeOptions = computed(() =>
  types.value.map((t) => ({
    label: t.label,
    value: t.value
  }))
)
</script>
