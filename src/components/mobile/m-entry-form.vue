<template>
  <div class="flex-1 divide-y divide-neutral-200 overflow-scroll text-sm">
    <textarea
      ref="textarea"
      v-model="input"
      name="description"
      id="description"
      class="min-h-[10em] w-full resize-none border-none p-4 text-neutral-950 placeholder:text-neutral-400 focus:ring-0"
      placeholder="Beschreibung..."
    />
    <MEntryFormCompetences v-model="entry" />
    <MEntryFormProjects v-model="entry.events" />
    <MEntryFormTags v-model="entry.tags" />
    <MEntryFormStudents v-model="entry.users" />
    <MEntryFormDate v-model="entry.date" />
  </div>
</template>

<script setup lang="ts">
import MEntryFormProjects from "@/components/mobile/record/m-entry-form-projects.vue";
import MEntryFormStudents from "@/components/mobile/record/m-entry-form-students.vue";
import MEntryFormTags from "@/components/mobile/record/m-entry-form-tags.vue";
import MEntryFormCompetences from "@/components/mobile/record/m-entry-form-competences.vue";
import MEntryFormDate from "@/components/mobile/record/m-entry-form-date.vue";
import { useTextareaAutosize, useVModel } from "@vueuse/core";
import { computed } from "vue";

const props = defineProps<{
  modelValue: any;
}>();
const emit = defineEmits(["update:modelValue"]);

const entry = useVModel(props, "modelValue", emit);

const body = computed({
  get() {
    return entry.value.body;
  },
  set(value) {
    entry.value.body = value;
  },
});

const { textarea, input } = useTextareaAutosize({
  input: body,
});
</script>
