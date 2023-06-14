<template>
  <div class="rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm">
    <div class="flex items-baseline justify-between">
      <div class="p-1 text-base text-strong">
        {{ competence.name }}
      </div>
      <div class="flex items-center gap-2">
        <div class="px-1 text-default">
          {{ grades(competence) }}
        </div>
        <slot />
      </div>
    </div>
    <div class="flex gap-1 text-xs">
      <div v-for="(parent, index) in competence.parents" class="flex items-center py-0.5">
        <div v-if="index !== 0" class="mx-1 text-muted">/</div>
        <div
          :class="{
            'block rounded-full border border-stone-200 px-2 py-0.5 text-strong': index === 0,
            'pl-0.5 pr-0 text-subtle': index !== 0,
          }"
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
  competence: Partial<Competence>;
}

const props = defineProps<Props>();
const competence = toRef(props, "competence");

function grades(competence: Competence) {
  // return first and last grade and if only one grade only that one as string
  if (competence.grades.length === 1) {
    return competence.grades[0].toString();
  }
  return `${competence.grades[0]} - ${competence.grades[competence.grades.length - 1]}`;
}
</script>
