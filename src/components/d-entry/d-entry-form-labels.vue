<template>
  <div class="flex gap-4 text-sm">
    <label for="date" class="mt-2 min-w-[64px] text-neutral-500">{{ $t("label", 2) }}</label>

    <div class="flex w-full flex-col gap-4">
      <DSelect
        :options="tagOptions"
        :label="$t('label', 2)"
        multiple
        v-model="selected"
        v-model:search="tagSearch"
        class="w-full"
        searchable
      >
        <template v-slot="{ option }">
          <d-tag :color="tagsData?.tags.edges?.find((el: any) => el.id === option.value)?.color">
            {{ option.label }}
          </d-tag>
        </template>
      </DSelect>

      <div class="flex flex-wrap gap-1.5">
        <d-tag v-for="tag in entry.tags" :color="tag.color" removable @remove="removeTag(tag)">
          {{ tag.name }}
        </d-tag>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRef } from "vue"
import DTag from "../d-tag/d-tag.vue"
import DSelect from "@/components/d-select/d-select.vue"
import { useDeleteEntryTagInputMutation } from "@/gql/mutations/entries/deleteEntryTag"
import { useCreateEntryTagMutation } from "@/gql/mutations/entries/createEntryTag"
import { useTagLimitedQuery } from "@/gql/queries/tags/tags"
import type { Entry, Tag } from "@/gql/schema"

const { executeMutation: deleteEntryTag } = useDeleteEntryTagInputMutation()
const { executeMutation: createEntryTag } = useCreateEntryTagMutation()

const props = defineProps<{
  entry: Partial<Entry>
}>()

const entry = toRef(props, "entry")
const tagSearch = ref("")

const { data: tagsData } = useTagLimitedQuery({})

const selected = computed({
  get: () => {
    return entry.value.tags?.map((el: any) => el.id) || []
  },
  set: async (value: string[]) => {
    // value contains all selected ids, we need to compare it to the existing ones
    // and if there are any differences, we need to create or delete the entryTag
    const existing = entry.value.tags?.map((el: any) => el.id) || []

    const toDelete = existing.filter((el) => !value.includes(el))
    const toCreate = value.filter((el) => !existing.includes(el))

    for (const id of toDelete || []) {
      await deleteEntryTag({ input: { entryId: entry.value.id as string, tagId: id } })
    }

    for (const id of toCreate || []) {
      await createEntryTag({ input: { entryId: entry.value.id as string, tagId: id } })
    }
  }
})

const filteredTagData = computed(() => {
  const searchValid = tagSearch.value && tagSearch.value !== ""
  if (!searchValid) return tagsData?.value?.tags?.edges || []

  return (
    tagsData?.value?.tags?.edges?.filter((el: any) => el.name.toLowerCase().includes(tagSearch.value.toLowerCase())) ||
    []
  )
})

async function removeTag(tag: Tag) {
  await deleteEntryTag({ input: { entryId: entry.value.id as string, tagId: tag.id } })
}

const tagOptions = computed(
  () =>
    filteredTagData.value.map((edge: any) => ({
      label: edge.name,
      value: edge.id
    })) || []
)
</script>
