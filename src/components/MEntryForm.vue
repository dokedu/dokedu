<template>
  <div class="flex-1 divide-y divide-stone-200 overflow-scroll text-sm">
    <textarea
      ref="textarea"
      v-model="input"
      name="description"
      id="description"
      class="min-h-[10em] w-full resize-none border-none p-4 text-stone-950 placeholder:text-stone-400 focus:ring-0"
      placeholder="Beschreibung..."
    />
    <MEntryFormCompetences v-model="props.entry.userCompetences" />
    <MEntryFormProjects />
    <MEntryFormTags />
    <MEntryFormStudents />
    <MEntryFormDate v-model="props.entry.date" />
  </div>
</template>

<script setup lang="ts">
import MEntryFormProjects from "@/components/mobile/record/m-entry-form-projects.vue";
import MEntryFormStudents from "@/components/mobile/record/m-entry-form-students.vue";
import MEntryFormTags from "@/components/mobile/record/m-entry-form-tags.vue";
import MEntryFormCompetences from "@/components/mobile/record/m-entry-form-competences.vue";
import MEntryFormDate from "@/components/mobile/record/m-entry-form-date.vue";
import { useTextareaAutosize } from "@vueuse/core";
import { CreateEntryInput } from "@/gql/graphql";

const props = defineProps<{
  entry: CreateEntryInput;
}>();

const { textarea, input } = useTextareaAutosize({
  input: props.entry.body,
});
</script>
