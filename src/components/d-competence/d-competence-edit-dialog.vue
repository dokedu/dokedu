<template>
  <dialog
    ref="dialog"
    class="w-full max-w-sm rounded-lg p-4 text-sm backdrop:bg-neutral-900/90"
    style="overflow: visible"
    @close.prevent="$emit('close')"
  >
    <div class="mb-4 flex items-center justify-between">
      <div class="font-medium text-strong">{{ $t("edit_competence") }}</div>
      <button @click="onClose">
        <X class="h-4 w-4"></X>
      </button>
    </div>
    <div class="pb-4">
      <div class="flex items-center gap-4">
        <div class="min-w-16 text-neutral-400">{{ $t("name") }}</div>
        <div class="px-1">{{ competence.name }}</div>
      </div>
      <div class="relative mt-4 flex items-center gap-4">
        <div class="min-w-16 text-neutral-400">{{ $t("color") }}</div>
        <DSelect :options="colorOptions" :label="$t('tag', 2)" multiple v-model="color" class="w-full">
          <template #display="{ displayedLabel }">
            <d-tag :color="color">
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
    <div class="flex justify-between">
      <DButton type="outline" size="md" @click="onClose">{{ $t("cancel") }}</DButton>
      <div class="flex gap-2">
        <DButton type="primary" size="md" @click="onUpdate">{{ $t("update") }}</DButton>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import DButton from "@/components/d-button/d-button.vue"
import DSelect from "@/components/d-select/d-select.vue"
import DTag from "@/components/d-tag/d-tag.vue"
import { X } from "lucide-vue-next"
import { toRef, ref, onMounted } from "vue"
import type { Competence } from "@/gql/schema"
import { useUpdateCompetenceMutation } from "@/gql/mutations/competences/updateCompetence"

const dialog = ref<HTMLDialogElement>()
const colors = [
  "stone", // bg-neutral-50 text-neutral-700
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
  "rose" // bg-rose-50 text-rose-700
]

const colorOptions = colors.map((color) => ({
  label: capitalize(color),
  value: color
}))

export interface Props {
  competence: Competence
}

onMounted(() => {
  dialog.value?.showModal()
})

const props = defineProps<Props>()
const emit = defineEmits(["close", "updated"])

const competence = toRef(props, "competence")
const color = ref<string>(competence.value?.color as string)
const error = ref("")

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const { executeMutation: updateCompetence } = useUpdateCompetenceMutation()

const onClose = () => {
  emit("close")
}

const onUpdate = async () => {
  if (!competence.value) {
    return
  }
  const mutation = await updateCompetence({
    input: {
      id: competence.value.id,
      color: color.value
    }
  })
  if (mutation.error) {
    error.value = mutation.error.graphQLErrors[0].message
  }
  emit("close")
}
</script>
