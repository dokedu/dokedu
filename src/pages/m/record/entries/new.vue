<template>
  <div class="flex h-screen w-full flex-col" style="height: -webkit-fill-available">
    <MPageHeader />
    <!-- <MEntryForm /> -->
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
// import MEntryForm from "@/components/MEntryForm.vue";
</script>
