<script setup lang="ts">
import { CircleCheckIcon, CircleIcon } from "lucide-vue-next"
import type { DTag } from "~/types/models"

const emit = defineEmits(["toggle"])

interface Props {
  selected: string[]
}

defineProps<Props>()

const { data: tags } = useFetch("/api/tags")

const search = ref("")

const filtered = computed(() => {
  let items: DTag[] = tags.value

  // filter by search
  if (search.value) {
    items = items.filter((c) => c.name.toLowerCase().includes(search.value.toLowerCase()))
  }

  return items
})

function onClick(tag: DTag) {
  return emit("toggle", tag)
}

// text-red-700 text-orange-700 text-amber-700 text-yellow-700 text-lime-700 text-green-700 text-emerald-700 text-teal-700 text-cyan-700 text-sky-700 text-blue-700 text-indigo-700 text-violet-700 text-purple-700 text-fuchsia-700 text-pink-700 text-rose-700
</script>

<template>
  <div class="flex h-[500px] w-full flex-col">
    <div class="w-full border-b border-neutral-200">
      <input
        type="text"
        name="search"
        id="search"
        class="w-full border-none px-4 py-2 pb-1.5 text-sm outline-none focus:border-neutral-300 focus:ring-0 focus:outline-0"
        placeholder="Suche..."
        v-model="search"
      />
    </div>
    <div v-if="tags" class="flex-1 divide-y divide-neutral-200 overflow-auto">
      <div
        v-for="tag in filtered"
        :key="tag.id"
        class="flex cursor-default items-center justify-between gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
        @click="onClick(tag)"
      >
        <div class="flex items-center gap-1.5">
          <CircleCheckIcon v-if="selected.includes(tag.id)" class="size-4 text-blue-700" />
          <CircleIcon v-else class="size-4 text-neutral-400" />
          <DTag :color="tag.color">{{ tag.name }}</DTag>
        </div>
      </div>
      <div v-show="filtered.length === 0" class="px-4 py-2">
        <div class="text-sm text-neutral-500">Keine Ergebnisse...</div>
      </div>
    </div>
  </div>
</template>
