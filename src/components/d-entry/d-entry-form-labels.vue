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
import { computed, ref, toRef } from "vue";
import { Entry, Tag } from "@/gql/graphql";
import { useQuery } from "@urql/vue";
import DTag from "../d-tag/d-tag.vue";
import tagQuery from "@/queries/tags";
import DSelect from "@/components/d-select/d-select.vue";

const props = defineProps<{
  entry: Partial<Entry>;
}>();

const entry = toRef(props, "entry");

const tagSearch = ref("");

const { data: tagsData } = useQuery({
  query: tagQuery,
});

const selected = computed({
  get: () => {
    return entry.value.tags?.map((el: any) => el.id) || [];
  },
  set: (value: string[]) => {
    entry.value.tags = tagsData.value.tags.edges.filter((el: any) => value.includes(el.id));
  },
});

const filteredTagData = computed(() => {
  const searchValid = tagSearch.value && tagSearch.value !== "";
  if (!searchValid) return tagsData?.value?.tags?.edges || [];

  return (
    tagsData?.value?.tags?.edges?.filter((el: any) => el.name.toLowerCase().includes(tagSearch.value.toLowerCase())) ||
    []
  );
});

function removeTag(tag: Tag) {
  entry.value.tags = entry.value.tags?.filter((el: any) => el.id !== tag.id);
}

const tagOptions = computed(
  () =>
    filteredTagData.value.map((edge: any) => ({
      label: edge.name,
      value: edge.id,
    })) || []
);
</script>
