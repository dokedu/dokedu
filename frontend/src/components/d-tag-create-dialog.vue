<template>
  <DDialog :open="modalOpen" @close="onClose" :title="$t('create_tag')" class="p-4">
    <template #trigger>
      <slot name="trigger"></slot>
    </template>
    <template #main>
      <div class="pb-4">
        <div class="flex items-center gap-4">
          <div class="min-w-16 text-sm text-neutral-400">{{ $t("name") }}</div>
          <DInput name="name" v-model="name" class="flex-1" />
        </div>
        <div class="relative mt-4 flex items-center gap-4">
          <div class="min-w-16 text-sm text-neutral-400">{{ $t("color") }}</div>
          <DCombobox class="grow" :placeholder="$t('tag', 2)" v-model="tagColor" :options="colorOptions">
            <template v-slot="{ option }">
              <d-tag :color="option.value">
                {{ option.label }}
              </d-tag>
            </template>
          </DCombobox>
        </div>
      </div>
      <div v-if="error" class="text-xs font-semibold text-red-600">{{ error }}</div>
      <div class="flex justify-end">
        <DButton type="primary" size="md" @click="onCreate">{{ $t("create") }}</DButton>
      </div>
    </template>
  </DDialog>
</template>

<script setup lang="ts">
import DDialog from "@/components/d-dialog/d-dialog.vue"
import DButton from "@/components/d-button/d-button.vue"
import DInput from "@/components/d-input/d-input.vue"
import DCombobox from "./d-combobox/d-combobox.vue"
import DTag from "@/components/d-tag/d-tag.vue"
import { toRef, ref } from "vue"
import { useCreateTagMutation } from "@/gql/mutations/tags/createTag"

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "purple", "pink", "gray"]

const colorOptions = colors.map((c) => ({
  label: capitalize(c),
  value: c
}))

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const props = defineProps({
  open: Boolean
})
const emit = defineEmits(["close", "created"])

const modalOpen = toRef(props, "open")
const name = ref("")
const tagColor = ref({ label: "Gray", value: "gray" })
const error = ref("")

const { executeMutation: createTag } = useCreateTagMutation()

const onClose = () => {
  emit("close", false)
}

const onCreate = async () => {
  const mutation = await createTag({
    input: {
      name: name.value,
      color: tagColor.value.value
    }
  })

  if (mutation.error) {
    error.value = mutation.error.graphQLErrors[0].message
    return
  }

  name.value = ""
  tagColor.value = { label: "Gray", value: "gray" }

  emit("created")
}
</script>
