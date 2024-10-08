<template>
  <div class="px-2 py-4">
    <div class="mb-1 px-2 text-neutral-500">Tags</div>
    <div class="mb-2 flex flex-wrap gap-2 px-2">
      <DTag v-for="tag in tags" :color="tag.color" @remove="toggleTag(tag)" :key="tag.id" removable>
        {{ tag.name }}
      </DTag>
    </div>
    <button
      type="button"
      @click="addTag"
      class="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-neutral-500"
    >
      <Plus :size="18" />
      <div>Tag hinzufügen</div>
    </button>
    <template v-if="sheetOpen">
      <MSheet @close="sheetOpen = false">
        <div class="flex flex-col gap-2 overflow-scroll p-2 text-sm" :style="{ maxHeight: sheetHeight + 'px' }">
          <div
            v-for="tag in data?.tags.edges"
            class="flex items-center justify-between rounded-lg border px-2 py-2"
            :class="`bg-${tag?.color}-50 border-${tag?.color}-200`"
            @click="toggleTag(tag)"
          >
            <div>{{ tag?.name }}</div>
            <div class="rounded-md hover:bg-neutral-100">
              <Check v-if="activeTag(tag)" :size="20" :class="`stroke-${tag?.color}-500`" />
            </div>
          </div>
        </div>
      </MSheet>
    </template>
  </div>
</template>

<script lang="ts" setup>
import MSheet from "@/components/mobile/m-sheet.vue"
import DTag from "@/components/d-tag/d-tag.vue"
import { useVModel, useWindowSize } from "@vueuse/core"
import { Plus, Check } from "lucide-vue-next"
import { computed, ref } from "vue"
import { useDeleteEntryTagInputMutation } from "@/gql/mutations/entries/deleteEntryTag"
import { useCreateEntryTagMutation } from "@/gql/mutations/entries/createEntryTag"
import { useTagLimitedQuery } from "@/gql/queries/tags/tags"

const { executeMutation: deleteEntryTag } = useDeleteEntryTagInputMutation()
const { executeMutation: createEntryTag } = useCreateEntryTagMutation()

const sheetOpen = ref(false)

const { height } = useWindowSize()
const sheetHeight = computed(() => height.value - 72)

function addTag() {
  sheetOpen.value = true
}

const props = defineProps<{
  entry: any
  modelValue: any
}>()
const emit = defineEmits(["update:modelValue"])

const tags = useVModel(props, "modelValue", emit)

const { data } = useTagLimitedQuery({})

async function toggleTag(tag: any) {
  if (tags.value.find((p: any) => p.id === tag.id)) {
    await deleteEntryTag({ input: { entryId: props.entry.id, tagId: tag.id } })
  } else {
    await createEntryTag({ input: { entryId: props.entry.id, tagId: tag.id } })
  }
}

function activeTag(tag: any) {
  return tags.value.find((p: any) => p.id === tag.id)
}
</script>
