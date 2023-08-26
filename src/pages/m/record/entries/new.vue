<template>
  <div class="flex h-screen w-full flex-col" style="height: -webkit-fill-available">
    <MPageHeader />
    <div class="flex-1 divide-y divide-stone-200 overflow-scroll text-sm">
      <textarea
        ref="textarea"
        v-model="input"
        name="description"
        id="description"
        class="min-h-[10em] w-full resize-none border-none p-4 text-stone-950 placeholder:text-stone-400 focus:ring-0"
        placeholder="Beschreibung..."
      />
      <MEntryFormCompetences />
      <MEntryFormProjects />
      <MEntryFormTags />
      <MEntryFormStudents />
      <MEntryFormDate />
    </div>
    <MPageFooter>
      <router-link
        to="/m/record/entries"
        class="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-8 py-2.5 text-center text-sm text-white"
      >
        <div>Speichern</div>
      </router-link>
    </MPageFooter>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "layout": "mobile"
  }
}
</route>

<script lang="ts" setup>
import MPageHeader from "@/components/mobile/m-page-header.vue";
import MPageFooter from "@/components/mobile/m-page-footer.vue";
import MEntryFormProjects from "@/components/mobile/record/m-entry-form-projects.vue";
import MEntryFormStudents from "@/components/mobile/record/m-entry-form-students.vue";
import MEntryFormTags from "@/components/mobile/record/m-entry-form-tags.vue";
import MEntryFormCompetences from "@/components/mobile/record/m-entry-form-competences.vue";
import MEntryFormDate from "@/components/mobile/record/m-entry-form-date.vue";
import { useTextareaAutosize } from "@vueuse/core";

const { textarea, input } = useTextareaAutosize();
</script>
