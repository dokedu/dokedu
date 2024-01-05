<template>
  <div class="rounded-lg border border-neutral-200 px-2 py-1 text-sm">
    <div class="flex items-baseline justify-between">
      <div class="flex items-center gap-1.5 p-1 text-strong">
        <Folder v-if="competence.type !== 'competence'" :size="12" class="fill-neutral-700 stroke-neutral-700" />
        {{ competence.name }}
      </div>
      <div class="flex items-center gap-2">
        <div v-if="competence.tendency" class="flex items-center gap-2 text-sm"
          :title="`${competence.tendency?.countLearnedCompetences} von ${competence.tendency?.countChildCompetences} Kompetenzen gelernt`">
          <div class="h-2 w-[75px] overflow-clip rounded-md bg-neutral-200">
            <div class="h-full bg-neutral-700" :style="`width: ${(competence.tendency?.countLearnedCompetences / competence.tendency?.countChildCompetences) * 100
              }%;`" />
          </div>
        </div>
        <div class="w-[50px] px-1 text-right text-default">
          {{ grades(competence) }}
        </div>
        <slot />
      </div>
    </div>

    <div class="flex max-w-full gap-1 overflow-hidden text-xs">
      <div v-for="(parent, index) in competence.parents" class="flex items-center py-0.5">
        <div v-if="index !== 0" class="mx-1 text-muted">/</div>
        <div :class="[
          index === 0 ? 'block rounded-full px-2 py-0.5 text-strong' : '',
          index !== 0 ? 'line-clamp-1 pl-0.5 pr-0 text-subtle' : '',
          parent.color && parent.color.length > 0
            ? `bg-${parent.color}-50 !text-${parent.color}-700`
            : index === 0
              ? 'border border-neutral-200'
              : ''
        ]">
          {{ parent.name }}
        </div>
      </div>
    </div>
    <slot name="footer" />
  </div>
</template>

<script lang="ts" setup>
import { toRef } from "vue"
import { Folder } from "lucide-vue-next"
import type { Competence } from "@/gql/schema"

export interface Props {
  competence: Pick<Competence, "grades" | "name" | "parents" | "type" | "tendency">
}

const props = defineProps<Props>()
const competence = toRef(props, "competence")

function grades(competence: Pick<Competence, "grades">) {
  // return first and last grade and if only one grade only that one as string
  if (competence.grades.length === 1) {
    return competence.grades[0].toString()
  }

  const sorted = competence.grades.sort((a, b) => a - b)
  return `${sorted[0]} - ${sorted[sorted.length - 1]}`
}
</script>
