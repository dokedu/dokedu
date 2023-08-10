<template>
  <d-dialog :open="open" @close="onClose">
    <template #header>
      <div class="mb-2 text-base font-medium text-strong">Move to trash?</div>
      <div class="max-w-[300px] font-normal text-subtle">
        "{{ file?.name }}" will be deleted. You can restore it anytime.
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <d-button size="sm" type="outline" @click="onClose">Cancel</d-button>
        <d-button size="sm" @click="onSave">Delete</d-button>
      </div>
    </template>
  </d-dialog>
</template>

<script lang="ts" setup>
import DDialog from "@/components/d-dialog/d-dialog.vue";
import DButton from "@/components/d-button/d-button.vue";
import { toRef } from "vue";
import { useVModel } from "@vueuse/core";
import { File } from "@/gql/graphql";

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
