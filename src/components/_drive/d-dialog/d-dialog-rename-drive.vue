<template>
  <d-dialog :open="open" @close="onClose" class="p-4">
    <template #header>
      <div class="font-medium text-strong">{{ $t("rename_file") }}</div>
    </template>
    <template #main>
      <div class="min-w-[300px]">
        <d-input v-model="name" :placeholder="$t('new_shared_drive_name')" name="name" />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <d-button size="sm" type="outline" @click="onClose">{{ $t("cancel") }}</d-button>
        <d-button size="sm" @click="onSave">{{ $t("save") }}</d-button>
      </div>
    </template>
  </d-dialog>
</template>

<script lang="ts" setup>
import DDialog from "@/components/d-dialog/d-dialog.vue";
import DInput from "@/components/d-input/d-input.vue";
import DButton from "@/components/d-button/d-button.vue";
import { useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { ref, toRefs } from "vue";

const props = defineProps<{
  open: boolean;
  item: any;
}>();

const { item: drive, open } = toRefs(props);
const emit = defineEmits(["close"]);

const name = ref("");

function onClose() {
  emit("close");
}

const { executeMutation: updateBucket } = useMutation(
  graphql(`
    mutation renameSharedDrive($input: RenameSharedDriveInput!) {
      renameSharedDrive(input: $input) {
        id
        name
      }
    }
  `)
);

async function onSave() {
  if (!drive.value) return;
  // min length of name 3
  if (name.value.length < 2) return alert("Name must be at least 2 characters long");
  await updateBucket({
    input: {
      id: drive.value.id,
      name: name.value,
    },
  });
  name.value = "";
  emit("close");
}
</script>
