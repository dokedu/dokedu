<template>
  <div class="flex h-screen w-full flex-col">
    <MPageHeader />
    <div class="flex-1 divide-y divide-stone-200 overflow-scroll text-sm">
      <router-link
        v-for="i in 10"
        :to="{ name: '/m/record/entries/[id]', params: { id: `${i}` } }"
        class="flex flex-col gap-2 p-4 text-stone-700"
      >
        <div class="line-clamp-3">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus harum autem magni, eaque numquam aliquid
          culpa ex quos consequuntur eveniet dolorum cupiditate? Culpa, voluptate magni!
        </div>
        <div class="flex gap-1 text-xs text-stone-500">
          <div>Max Mustermann</div>
          <div>⋅</div>
          <div>Heute um 11 Uhr</div>
        </div>
      </router-link>
    </div>
    <MPageFooter>
      <router-link
        to="/m/record/entries/new"
        class="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-8 py-2.5 text-center text-sm text-white"
      >
        <Plus :size="18" />
        <div>Eintrag erstellen</div>
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
import { Plus } from "lucide-vue-next";
</script>
