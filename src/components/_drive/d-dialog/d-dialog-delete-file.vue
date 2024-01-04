<template>
  <d-dialog :title="$t('move_to_trash_q')" :open="open" @close="onClose" class="p-4">
    <template #main>
      <div class="max-w-[300px] font-normal text-subtle">
        {{ $t("will_be_deleted_can_restore", { file: file?.name }) }}
      </div>
      <div class="flex justify-end mt-6">
        <d-button size="sm" @click="onSave">{{ $t("delete") }}</d-button>
      </div>
    </template>
  </d-dialog>
</template>

<script lang="ts" setup>
import DDialog from "@/components/d-dialog/d-dialog.vue";
import DButton from "@/components/d-button/d-button.vue";
import { toRef } from "vue";
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  modelValue: File | null;
  open: boolean;
}>();
const emit = defineEmits(["update:modelValue", "close", "delete"]);

const open = toRef(props, "open");

const file = useVModel(props, "modelValue", emit);

function onClose() {
  emit("close");
}

function onSave() {
  if (!file.value) return;
  emit("delete", file.value);
  emit("close");
}
</script>
