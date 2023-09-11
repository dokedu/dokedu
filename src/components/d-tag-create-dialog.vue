<template>
  <DDialog :open="modalOpen" @close="onClose" class="p-4">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="font-medium text-strong">{{ $t("create_tag") }}</div>
        <DIconButton :icon="X" size="md" @click="onClose"></DIconButton>
      </div>
    </template>
    <template #main>
      <div class="pb-4">
        <div class="flex items-center gap-4">
          <div class="min-w-16 text-sm text-stone-400">{{ $t("name") }}</div>
          <DInput name="name" v-model="name" />
        </div>
        <div class="relative mt-4 flex items-center gap-4">
          <div class="min-w-16 text-sm text-stone-400">{{ $t("color") }}</div>
          <div class="relative w-full">
            <DContextMenu
              :show="contextMenuOpen"
              @close="contextMenuOpen = false"
              :alignment="ContextMenuAlignment.Overlay"
              class="max-h-[150px] w-full overflow-y-auto p-1"
            >
              <div class="flex w-full flex-col items-start rounded-md">
                <div
                  class="w-full cursor-pointer p-1 hover:bg-stone-100"
                  v-for="color in colors"
                  @click="onSelectColor(color)"
                >
                  <DTag :color="color">{{ $t(color) }}</DTag>
                </div>
              </div>
            </DContextMenu>
            <div
              class="flex w-full flex-wrap items-start gap-2 rounded-md p-2 hover:bg-stone-50"
              @click="contextMenuOpen = true"
            >
              <DTag v-if="tagColor" :color="tagColor" class="w-1/4 p-2">{{ tagColor }}</DTag>
              <div v-else class="text-stone-400">{{ $t("set_tag") }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="error" class="text-xs font-semibold text-red-600">{{ error }}</div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <DButton type="outline" size="md" @click="onClose">{{ $t("cancel") }}</DButton>
        <DButton type="primary" size="md" @click="onCreate">{{ $t("create") }}</DButton>
      </div>
    </template>
  </DDialog>
</template>

<script setup lang="ts">
import DDialog from "@/components/d-dialog/d-dialog.vue";
import DButton from "@/components/d-button/d-button.vue";
import DIconButton from "@/components/d-icon-button/d-icon-button.vue";
import { X } from "lucide-vue-next";
import { toRef, ref } from "vue";
import DInput from "@/components/d-input/d-input.vue";
import DContextMenu from "@/components/d-context-menu/d-context-menu.vue";
import { ContextMenuAlignment } from "@/components/d-context-menu/d-context-menu.vue";
import DTag from "@/components/d-tag/d-tag.vue";
import { useMutation } from "@urql/vue";
import { graphql } from "@/gql";

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "purple", "pink", "gray"];

const props = defineProps({
  open: Boolean,
});
const emit = defineEmits(["close", "created"]);

const modalOpen = toRef(props, "open");
const name = ref("");
const tagColor = ref("");
const contextMenuOpen = ref(false);
const error = ref("");

const { executeMutation: createTag } = useMutation(
  graphql(`
    mutation CreateTag($input: CreateTagInput!) {
      createTag(input: $input) {
        id
        name
        color
        deletedAt
        createdAt
      }
    }
  `)
);

const onSelectColor = (color: string) => {
  tagColor.value = color;
  contextMenuOpen.value = false;
};

const onClose = () => {
  emit("close", false);
};

const onCreate = async () => {
  const mutation = await createTag({
    input: {
      name: name.value,
      color: tagColor.value,
    },
  });

  if (mutation.error) {
    error.value = mutation.error.graphQLErrors[0].message;
    return;
  }

  name.value = "";
  tagColor.value = "";

  emit("created");
};
</script>
