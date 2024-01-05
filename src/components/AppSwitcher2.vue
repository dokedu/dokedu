<template>
  <div class="w-full relative">
    <div class="group flex flex-1 justify-between rounded-md p-1 transition-colors">
      <div class="flex items-center gap-3">
        <div class="rounded-lg bg-neutral-200 p-1.5">
          <component v-if="app" :is="app.icon" class="fill-neutral-500 stroke-neutral-500" :size="16" />
        </div>
        <div class="text-sm text-neutral-700 transition-all duration-100 hover:text-neutral-950">
          {{ app?.name }} <span v-if="app?.beta" class="text-xs font-medium uppercase text-blue-700">Beta</span>
        </div>
      </div>
      <div
        class="rounded-md p-1.5 transition-all hover:bg-neutral-300"
        @click="visibleAppSwitcher = !visibleAppSwitcher"
      >
        <Grip :size="20" class="stroke-neutral-500" />
      </div>
    </div>
    <div ref="appSwitcher" v-show="visibleAppSwitcher" class="absolute right-[-160px] z-[100] p-1 w-[200px]">
      <div class="flex w-full flex-col gap-1 rounded-lg bg-white p-1 shadow-md">
        <div
          v-for="_app in enabledApps"
          class="flex items-center gap-3 rounded-lg border border-white p-2 text-sm hover:bg-neutral-100"
          :class="(activeApp as string) === _app.id ? `!border-neutral-200 bg-neutral-100 hover:!bg-neutral-100` : ''"
          @click="switchApp(_app.id)"
        >
          <component :is="_app.icon" class="fill-neutral-500 stroke-neutral-500" :size="20" />
          <span class="text-neutral-500" :class="activeApp === _app.id ? `!text-neutral-900` : ''">{{
            _app.name
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Grip } from "lucide-vue-next";
import { computed, ref } from "vue";
import useActiveApp from "@/composables/useActiveApp.ts";
import { apps, UserRole } from "@/components/d-sidebar/d-sidebar.ts";
import { onClickOutside, useStorage } from "@vueuse/core";
import { useRouter } from "vue-router/auto";
import { useMeQuery } from "@/gql/queries/auth/me.ts";

const visibleAppSwitcher = ref<boolean>(false);
const app = computed(() => apps.value.find((el) => el.id === activeApp.value) || null);

const { activeApp } = useActiveApp();
const router = useRouter();

const appSwitcher = ref();

onClickOutside(appSwitcher, () => {
  visibleAppSwitcher.value = false;
});

const enabledAppList = useStorage<string[]>("enabled_apps", []);
const { data: userData } = useMeQuery({});

function switchApp(appId: string | null = null) {
  if (appId) {
    activeApp.value = appId;
    visibleAppSwitcher.value = false;

    // Reroute to first link of app
    const app = apps.value.find((el) => el.id === appId);
    if (app) {
      router.push({ name: app.links[0].route });
    }
    return;
  }
  // start at first app of index is out of bounds
  const nextIndex = (enabledApps.value.findIndex((el) => el.id === activeApp.value) + 1) % enabledApps.value.length;
  activeApp.value = enabledApps.value[nextIndex].id;
}

const enabledApps = computed(() => {
  const enabled = apps.value.filter((el: { id: string }) => enabledAppList.value.includes(el.id));
  const role = userData.value?.me?.role;
  return enabled.filter((el: { allowedUserRoles: UserRole[] }) => el.allowedUserRoles.includes(role as UserRole));
});

// code here
</script>
