<template>
  <div class="rounded-lg border border-gray-200 px-2 py-1 text-sm">
    <div class="flex items-baseline justify-between">
      <div class="p-1 text-strong">
        {{ competence.name }}
      </div>
      <div class="flex items-center gap-2">
        <div class="w-[50px] px-1 text-right text-default">
          {{ grades(competence) }}
        </div>
        <slot />
      </div>
    </div>
    <div class="flex gap-1 text-xs">
      <div v-for="(parent, index) in competence.parents" class="flex items-center py-0.5">
        <div v-if="index !== 0" class="mx-1 text-muted">/</div>
        <div
          :class="[
            index === 0 ? 'block rounded-full px-2 py-0.5 text-strong' : '',
            index !== 0 ? 'line-clamp-1 pl-0.5 pr-0 text-subtle' : '',
            parent.color && parent.color.length > 0
              ? `bg-${parent.color}-50 !text-${parent.color}-700`
              : index === 0
              ? 'border border-stone-200'
              : '',
          ]"
        >
          {{ parent.name }}
        </div>
      </div>
    </div>
    <slot name="footer" />
  </div>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import { Competence } from "../../gql/graphql";

export interface Props {
  competence: Pick<Competence, "grades" | "name" | "parents">;
}

const props = defineProps<Props>();
const competence = toRef(props, "competence");

function grades(competence: Pick<Competence, "grades">) {
  // return first and last grade and if only one grade only that one as string
  if (competence.grades.length === 1) {
    return competence.grades[0].toString();
  }
  return `${competence.grades[0]} - ${competence.grades[competence.grades.length - 1]}`;
}
</script>
