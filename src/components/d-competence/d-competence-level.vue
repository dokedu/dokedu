<template>
  <div
    class="relative rounded-lg border border-neutral-200 p-1.5"
    @click.prevent="open = true"
    :class="{ 'shadow-md': open }"
  >
    <d-competence-level-icon :level="level" />
    <div
      ref="menu"
      v-if="open"
      class="absolute -top-[1px] right-8 w-52 rounded-md border border-neutral-200 bg-white shadow-md"
    >
      <div class="flex flex-col border-b p-1">
        <div
          class="flex items-center justify-between gap-2 rounded-md px-3 py-1 text-sm text-neutral-700 hover:bg-neutral-100"
          @click="update(0)"
        >
          <div class="flex items-center gap-3">
            <d-competence-level-icon :level="0" />
            <div>{{ $t("no_level") }}</div>
          </div>
          <Check v-if="level === 0" :size="16" class="stroke-neutral-700" />
        </div>
      </div>
      <div class="flex flex-col p-1">
        <div
          class="flex items-center justify-between gap-2 rounded-md px-3 py-1 text-sm text-neutral-700 hover:bg-neutral-100"
          @click="update(1)"
        >
          <div class="flex items-center gap-3">
            <d-competence-level-icon :level="1" />
            <div>{{ $t("low") }}</div>
          </div>
          <Check v-if="level === 1" :size="16" class="stroke-neutral-700" />
        </div>
        <div
          class="flex items-center justify-between gap-2 rounded-md px-3 py-1 text-sm text-neutral-700 hover:bg-neutral-100"
          @click="update(2)"
        >
          <div class="flex items-center gap-3">
            <d-competence-level-icon :level="2" />
            <div>{{ $t("medium") }}</div>
          </div>
          <Check v-if="level === 2" :size="16" class="stroke-neutral-700" />
        </div>
        <div
          class="flex items-center justify-between gap-2 rounded-md px-3 py-1 text-sm text-neutral-700 hover:bg-neutral-100"
          @click="update(3)"
        >
          <div class="flex items-center gap-3">
            <d-competence-level-icon :level="3" />
            <div>{{ $t("high") }}</div>
          </div>
          <Check v-if="level === 3" :size="16" class="stroke-neutral-700" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { onClickOutside, onKeyStroke } from "@vueuse/core"
import DCompetenceLevelIcon from "./d-competence-level-icon.vue"
import { Check } from "lucide-vue-next"

const props = defineProps<{ id: string; level: number; editable: boolean }>()
const emit = defineEmits(["update"])

const open = ref(false)
const menu = ref<HTMLElement | null>(null)

onClickOutside(menu, () => (open.value = false))

onKeyStroke("Escape", () => {
  open.value = false
})

function update(level: number) {
  if (props.editable) {
    emit("update", { id: props.id, level })
  }
  open.value = false
}
</script>
