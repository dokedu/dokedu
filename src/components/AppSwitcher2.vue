<template>
  <div class="w-full relative">
    <div
      class="group flex flex-1 justify-between rounded-xl p-1 transition-colors hover:bg-strong user-select-none"
      @click="visibleAppSwitcher = !visibleAppSwitcher"
      :class="visibleAppSwitcher ? 'bg-strong' : ''"
      ref="appSwitcher"
    >
      <div class="flex items-center gap-3">
        <div class="rounded-lg size-7 grid place-items-center bg-muted border text-white group-hover:shadow-md">
          <component v-if="app" :is="app.icon" class="fill-neutral-900 stroke-neutral-900" :size="16" />
        </div>
        <div class="text-sm text-neutral-700 transition-all duration-100 hover:text-neutral-950">
          {{ app?.name }} <span v-if="app?.beta" class="text-xs font-medium uppercase text-blue-700">Beta</span>
        </div>
      </div>
      <d-icon-button :icon="Grip"></d-icon-button>
    </div>
    <transition name="popover">
      <d-popover :padding="false" v-show="visibleAppSwitcher" class="w-full min-w-[300px] top-[calc(100%+4px)]">
        <div class="py-2 px-2.5 text-xs text-subtle">
          <div class="font-medium">{{ userData?.me?.firstName }} {{ userData?.me?.lastName }}</div>
          <div>{{ userData?.me?.email }}</div>
        </div>
        <d-popover-item
          mode="slim"
          v-for="(_app, _) in enabledApps"
          :key="_"
          :active="(activeApp as string) === _app.id"
          @click="switchApp(_app.id)"
        >
          <div
            class="size-7 rounded-md grid place-items-center border"
            :class="(activeApp as string) === _app.id ? 'bg-white border-transparent text-white shadow-md' : 'bg-muted'"
          >
            <component
              :is="_app.icon"
              class=""
              :class="(activeApp as string) === _app.id ? 'fill-neutral-900 stroke-neutral-900' : 'bg-muted'"
              :size="16"
            />
          </div>
          <span class="text-neutral-500" :class="activeApp === _app.id ? `!text-neutral-900` : ''">{{
            _app.name
          }}</span>
        </d-popover-item>
        <div class="bg-subtle flex flex-col py-1">
          <d-popover-item mode="slim" to="/settings/profile">{{ $t("settings") }}</d-popover-item>
          <d-popover-item mode="slim" @click="loggingOut">{{ $t("log_out") }}</d-popover-item>
        </div>
      </d-popover>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { Grip } from "lucide-vue-next"
import { computed, ref } from "vue"
import useActiveApp from "@/composables/useActiveApp"
import { apps } from "@/components/d-sidebar/d-sidebar"
import type { UserRole } from "@/components/d-sidebar/d-sidebar"
import { onClickOutside, useStorage } from "@vueuse/core"
import { useRouter } from "vue-router/auto"
import { useMeWithInfoQuery } from "@/gql/queries/auth/meWithInfo"
import DPopover from "@/components/d-popover/d-popover.vue"
import DPopoverItem from "@/components/d-popover/d-popover-item.vue"
import DIconButton from "@/components/d-icon-button/d-icon-button.vue"
import { useAuth } from "@/composables/auth"

const visibleAppSwitcher = ref<boolean>(false)
const app = computed(() => apps.value.find((el) => el.id === activeApp.value) || null)

const { activeApp } = useActiveApp()
const router = useRouter()

const appSwitcher = ref()

onClickOutside(appSwitcher, () => {
  visibleAppSwitcher.value = false
})

const enabledAppList = useStorage<string[]>("enabled_apps", [])
const { data: userData } = useMeWithInfoQuery({})

function switchApp(appId: string | null = null) {
  if (appId) {
    activeApp.value = appId
    visibleAppSwitcher.value = false

    // Reroute to first link of app
    const app = apps.value.find((el) => el.id === appId)
    if (app) {
      router.push({ name: app.links[0].route, params: app.links[0].params || "" })
    }
    return
  }
  // start at first app of index is out of bounds
  const nextIndex = (enabledApps.value.findIndex((el) => el.id === activeApp.value) + 1) % enabledApps.value.length
  activeApp.value = enabledApps.value[nextIndex].id
}

const enabledApps = computed(() => {
  const enabled = apps.value.filter((el: { id: string }) => enabledAppList.value.includes(el.id))
  const role = userData.value?.me?.role
  return enabled.filter((el: { allowedUserRoles: UserRole[] }) => el.allowedUserRoles.includes(role as UserRole))
})

async function loggingOut() {
  await useAuth().signOut()
}

// code here
</script>
