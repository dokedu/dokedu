<template>
  <div class="flex items-center gap-2">
    <div class="w-20 text-sm font-medium text-strong">{{ $t("type") }}</div>
    <div class="w-full">
      <DSelect :options="typeOptions" :label="$t('type')" multiple v-model="type" class="w-full">
        <template v-slot="{ option }">
          {{ option.label }}
        </template>
      </DSelect>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import DSelect from "@/components/d-select/d-select.vue";
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits(["update:modelValue"]);

const type = useVModel(props, "modelValue", emit);

export type ReportType = {
  label: string;
  kind: string;
  format: string;
};

const { t } = useI18n();

const types = computed(() => [
  { label: t("entry", 2), kind: "entries", format: "pdf" },
  { label: t("competence", 2), kind: "competences", format: "pdf" },
  { label: t("learned_competences", 2), kind: "learned_competences", format: "pdf" },
  { label: t("all_entries", 2), kind: "all_entries", format: "pdf" },
]);

const typeOptions = computed(() =>
  types.value.map((t) => ({
    label: t.label,
    value: t.kind,
  }))
);
</script>
