<template>
  <DDialog :open="modalOpen" @close="onClose" class="p-4" :title="$t('edit_tag')">
    <template #main>
      <div class="pb-4">
        <div class="flex items-center gap-4">
          <div class="min-w-16 text-sm text-stone-400">{{ $t("name") }}</div>
          <DInput v-if="tag" name="name" v-model="tag.name" class="flex-1" />
        </div>
        <div class="relative mt-4 flex items-center gap-4">
          <div class="min-w-16 text-sm text-stone-400">{{ $t("color") }}</div>
          <DSelect :options="colorOptions" :label="$t('tag', 2)" multiple v-model="tagColor" class="w-full">
            <template #display="{ displayedLabel }">
              <d-tag :color="tag?.color">
                {{ displayedLabel }}
              </d-tag>
            </template>
            <template v-slot="{ option }">
              <d-tag :color="option.value">
                {{ option.label }}
              </d-tag>
            </template>
          </DSelect>
        </div>
      </div>
      <div v-if="error" class="text-xs font-semibold text-red-600">{{ error }}</div>
      <div class="flex justify-between gap-2">
        <DButton type="outline" size="md" @click="onArchive">{{ $t("archive") }}</DButton>
        <DButton type="primary" size="md" @click="onUpdate">{{ $t("update") }}</DButton>
      </div>
    </template>
  </DDialog>
</template>

<script setup lang="ts">
import DDialog from "./d-dialog/d-dialog.vue";
import DButton from "./d-button/d-button.vue";
import DSelect from "@/components/d-select/d-select.vue";
import { toRef, ref, computed } from "vue";
import DInput from "./d-input/d-input.vue";
import DTag from "./d-tag/d-tag.vue";
import { useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { Tag } from "../gql/graphql";

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "purple", "pink", "gray"];

const colorOptions = colors.map((color) => ({
  label: capitalize(color),
  value: color,
}));

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export interface Props {
  open: boolean;
  tag: Tag | undefined;
}

const props = defineProps<Props>();
const emit = defineEmits(["close", "updated"]);

const modalOpen = toRef(props, "open");
const tag = toRef(props, "tag");
const error = ref("");

const tagColor = computed({
  get() {
    return tag.value?.color || "gray";
  },
  set(value: string) {
    if (tag.value) {
      tag.value.color = value;
    }
  },
});

const { executeMutation: updateTag } = useMutation(
  graphql(`
    mutation UpdateTag($id: ID!, $input: CreateTagInput!) {
      updateTag(id: $id, input: $input) {
        id
        name
        color
        deletedAt
        createdAt
      }
    }
  `)
);

const { executeMutation: archiveTag } = useMutation(
  graphql(`
    mutation ArchiveTag($id: ID!) {
      archiveTag(id: $id) {
        id
        name
        color
        deletedAt
        createdAt
      }
    }
  `)
);

function onClose() {
  emit("close", false);
}

async function onUpdate() {
  if (!tag.value) return;

  const res = await updateTag({
    id: tag.value.id,
    input: {
      name: tag.value.name,
      color: tag.value.color,
    },
  });

  if (res.error) {
    error.value = res.error.graphQLErrors[0].message;
  }

  emit("updated");
}

async function onArchive() {
  if (!tag.value) return;

  const res = await archiveTag({ id: tag.value.id });

  if (res.error) {
    error.value = res.error.graphQLErrors[0].message;
  }

  emit("updated");
}
</script>
