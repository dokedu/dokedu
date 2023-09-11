<template>
  <div class="flex items-center gap-2">
    <div class="w-20 text-sm font-medium text-strong">{{ $t("type") }}</div>
    <div class="w-full">
      <DContextMenu
        :show="contextMenuOpen"
        @close="contextMenuOpen = false"
        :alignment="ContextMenuAlignment.Overlay"
        class="max-h-[150px] overflow-y-auto p-1"
      >
        <div class="flex w-full flex-col items-start rounded-md">
          <div
            @click="selectType(type)"
            v-for="type in types"
            class="flex w-full cursor-pointer items-center justify-between p-1 hover:bg-stone-100"
          >
            <div class="text-sm">{{ type.label }}</div>
            <Check
              v-show="selectedType?.kind === type.kind && selectedType?.format === type.format"
              class="h-4 w-4"
            ></Check>
          </div>
        </div>
      </DContextMenu>
      <div
        class="flex w-full flex-wrap items-start gap-2 rounded-md p-2 hover:bg-stone-50"
        @click="contextMenuOpen = true"
      >
        <div v-if="selectedType" class="text-sm text-strong">
          {{ selectedType.label }}
        </div>
        <div v-else class="text-sm text-subtle">{{ $t("select_type") }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DContextMenu from "@/components/d-context-menu/d-context-menu.vue";
import { ContextMenuAlignment } from "@/components/d-context-menu/d-context-menu.vue";
import { ref, computed } from "vue";
import { Check } from "lucide-vue-next";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["update"]);

export type ReportType = {
  label: string;
  kind: string;
  format: string;
};

const contextMenuOpen = ref(false);
const selectedType = ref<ReportType>();
const { t } = useI18n();

const types = computed(() => [
  { label: t("entry", 2), kind: "entries", format: "pdf" },
  { label: t("competence", 2), kind: "competences", format: "pdf" },
  { label: t("learned_competences", 2), kind: "learned_competences", format: "pdf" },
  { label: t("all_entries", 2), kind: "all_entries", format: "pdf" },
  // { label: "Subjects", kind: "subjects", format: "pdf" },
  // { label: "Entries in .docx", kind: "entries", format: "docx" },
  // { label: "Subjects in .docx", kind: "subjects", format: "docx" },
]);

function selectType(type: ReportType) {
  selectedType.value = type;
  emit("update", selectedType.value);
}
</script>
