<template>
  <dialog
    ref="dialog"
    class="w-full max-w-sm rounded-lg text-sm backdrop:bg-stone-900/90"
    style="overflow: visible"
    @close.prevent="$emit('close')"
  >
    <div class="mb-4 flex items-center justify-between">
      <div class="font-medium text-strong">{{ $t("edit_competence") }}</div>
      <button @click="onClose"><X class="h-4 w-4"></X></button>
    </div>
    <div class="pb-4">
      <div class="flex items-center gap-4">
        <div class="min-w-16 text-stone-400">{{ $t("name") }}</div>
        <div class="px-1">{{ competence.name }}</div>
      </div>
      <div class="relative mt-4 flex items-center gap-4">
        <div class="min-w-16 text-stone-400">{{ $t("color") }}</div>
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
                <DTag :color="color">{{ capitalizeFirstLetter(color) }}</DTag>
              </div>
            </div>
          </DContextMenu>
          <div
            class="flex w-full flex-wrap items-start gap-2 rounded-md p-2 hover:bg-stone-50"
            @click="contextMenuOpen = true"
          >
            <DTag v-if="competence.color" :color="competence.color">{{ capitalizeFirstLetter(competence.color) }}</DTag>
            <div v-else class="text-stone-400">{{ $t("set_color") }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="error" class="text-xs font-semibold text-red-600">{{ error }}</div>
    <div class="flex justify-between">
      <DButton type="outline" size="md" @click="onClose">{{ $t("cancel") }}</DButton>
      <div class="flex gap-2">
        <DButton type="primary" size="md" @click="onUpdate">{{ $t("update") }}</DButton>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import DButton from "@/components/d-button/d-button.vue";
import { X } from "lucide-vue-next";
import { toRef, ref, onMounted } from "vue";
import DContextMenu from "@/components/d-context-menu/d-context-menu.vue";
import { ContextMenuAlignment } from "@/components/d-context-menu/d-context-menu.vue";
import { useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { Competence } from "@/gql/graphql";
import DTag from "@/components/d-tag/d-tag.vue";

const dialog = ref<HTMLDialogElement>();
const colors = [
  "stone", // bg-stone-50 text-stone-700
  "red", // bg-red-50 text-red-700
  "orange", // bg-orange-50 text-orange-700
  "yellow", // bg-yellow-50 text-yellow-700
  "lime", // bg-lime-50 text-lime-700
  "green", // bg-green-50 text-green-700
  "emerald", // bg-emerald-50 text-emerald-700
  "teal", // bg-teal-50 text-teal-700
  "cyan", // bg-cyan-50 text-cyan-700
  "sky", // bg-sky-50 text-sky-700
  "blue", // bg-blue-50 text-blue-700
  "indigo", // bg-indigo-50 text-indigo-700
  "violet", // bg-violet-50 text-violet-700
  "purple", // bg-purple-50 text-purple-700
  "fuchsia", // bg-fuchsia-50 text-fuchsia-700
  "pink", // bg-pink-50 text-pink-700
  "rose", // bg-rose-50 text-rose-700
];

export interface Props {
  competence: Competence;
}

onMounted(() => {
  dialog.value?.showModal();
});

const props = defineProps<Props>();
const emit = defineEmits(["close", "updated"]);

const contextMenuOpen = ref(false);
const competence = toRef(props, "competence");
const error = ref("");

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const { executeMutation: updateCompetence } = useMutation(
  graphql(`
    mutation updateCompetence($input: UpdateCompetenceInput!) {
      updateCompetence(input: $input) {
        id
        name
        color
      }
    }
  `)
);

const onSelectColor = (color: string) => {
  console.log(color);
  if (competence.value) {
    competence.value.color = color.toLowerCase();
  }
  contextMenuOpen.value = false;
};

const onClose = () => {
  emit("close");
};

const onUpdate = async () => {
  if (!competence.value) {
    return;
  }
  const mutation = await updateCompetence({
    input: {
      id: competence.value.id,
      color: competence.value.color as string,
    },
  });
  if (mutation.error) {
    error.value = mutation.error.graphQLErrors[0].message;
  }
  emit("close");
};
</script>
