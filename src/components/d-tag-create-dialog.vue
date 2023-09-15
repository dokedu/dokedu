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
          <DSelect :options="colorOptions" :label="$t('tag', 2)" multiple v-model="tagColor" class="w-full">
            <template #display="{ displayedLabel }">
              <d-tag :color="tagColor">
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
import DIconButton from "@/components/d-icon-button/d-icon-button.vue";
import DDialog from "@/components/d-dialog/d-dialog.vue";
import DButton from "@/components/d-button/d-button.vue";
import DInput from "@/components/d-input/d-input.vue";
import DSelect from "@/components/d-select/d-select.vue";
import DTag from "@/components/d-tag/d-tag.vue";
import { useMutation } from "@urql/vue";
import { X } from "lucide-vue-next";
import { toRef, ref } from "vue";
import { graphql } from "@/gql";

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "purple", "pink", "gray"];

const colorOptions = colors.map((c) => ({
  label: capitalize(c),
  value: c,
}));

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const props = defineProps({
  open: Boolean,
});
const emit = defineEmits(["close", "created"]);

const modalOpen = toRef(props, "open");
const name = ref("");
const tagColor = ref("gray");
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
