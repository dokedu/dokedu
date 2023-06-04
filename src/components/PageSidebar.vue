<template>
  <header class="flex h-screen w-full max-w-[230px] flex-col justify-between border-r border-gray-200 bg-gray-100 p-1">
    <div class="relative flex flex-col gap-2">
      <div class="flex items-center justify-between px-3 py-1">
        <div class="flex items-center gap-3">
          <component v-if="app" :is="app.icon" class="stroke-gray-500" :size="20" />
          <router-link
            :to="{ name: 'home' }"
            class="text-sm text-gray-700 transition-all duration-100 hover:text-gray-950"
          >
            Acme GmbH
          </router-link>
        </div>
        <div
          class="rounded-md border border-gray-300 p-2 transition-all hover:bg-gray-200"
          @click="visibleAppSwitcher = true"
        >
          <Grip :size="16" class="stroke-gray-700" />
        </div>
      </div>
      <div>
        <router-link
          v-for="link in app?.links"
          :to="{ name: link.route }"
          class="flex items-center gap-3 rounded-md p-1 px-3 text-gray-500 transition-all duration-100 hover:bg-gray-200 hover:text-gray-950"
          active-class="bg-gray-200 text-gray-700"
        >
          <component :is="link.icon" class="stroke-gray-500" :size="20" />
          <div>{{ link.name }}</div>
        </router-link>
      </div>
      <div v-show="visibleAppSwitcher" class="absolute flex w-full flex-col gap-1 rounded-lg bg-white p-1 shadow">
        <div
          v-for="_app in apps"
          class="flex items-center gap-3 rounded-lg border border-white p-2 hover:bg-gray-100"
          :class="activeApp === _app.id ? `!border-gray-200 bg-gray-100 hover:!bg-gray-100` : ''"
          @click="switchApp(_app.id)"
        >
          <component
            :is="_app.icon"
            class="stroke-gray-500"
            :size="20"
            :class="activeApp === _app.id ? `!stroke-gray-900` : ''"
          />
          <span class="text-gray-500" :class="activeApp === _app.id ? `!text-gray-900` : ''">{{ _app.name }}</span>
        </div>
      </div>
    </div>
    <div>
      <router-link :to="{ name: 'login' }" class="block px-4 py-4 text-gray-500">Log out</router-link>
    </div>
  </header>
</template>
<script setup lang="ts">
import { computed, FunctionalComponent, ref } from "vue";
import {
  CopyCheck,
  Flag,
  Grid,
  Pen,
  PieChart,
  Users,
  Grip,
  File,
  Trash,
  Star,
  Clock,
  FileArchive,
  Folder,
  Wrench,
  Calendar,
} from "lucide-vue-next";

const activeApp = ref<string>("record");
const visibleAppSwitcher = ref<boolean>(false);

interface AppLink {
  icon: FunctionalComponent;
  name: string;
  route: string;
}

interface App {
  id: string;
  icon: FunctionalComponent;
  name: string;
  links: AppLink[];
}

const app = computed(() => apps.find((el) => el.id === activeApp.value) || null);

const apps: App[] = [
  {
    id: "record",
    icon: Pen,
    name: "Dokumentation",
    links: [
      {
        // icon: "file-check-02",
        icon: Pen,
        name: "Entries",
        route: "record-entries",
      },
      {
        // icon: "users-01",
        icon: Users,
        name: "Students",
        route: "record-students",
      },
      {
        // icon: "flag-04",
        icon: Flag,
        name: "Goals",
        route: "home",
      },
      {
        // icon: "grid-01",
        icon: Grid,
        name: "Projects",
        route: "record-projects",
      },
      {
        // icon: "check-done-01",
        icon: CopyCheck,
        name: "Competences",
        route: "home",
      },
      {
        icon: PieChart,
        name: "Berichte",
        route: "record-reports",
      },
      {
        icon: Calendar,
        name: "Timetable",
        route: "record-projects",
      },
    ],
  },
  {
    id: "drive",
    icon: Folder,
    name: "Drive",
    links: [
      {
        icon: File,
        name: "My drive",
        route: "drive-my-drive",
      },
      {
        icon: FileArchive,
        name: "Shared drives",
        route: "admin-users",
      },
      {
        icon: Users,
        name: "Shared with me",
        route: "admin-users",
      },
      {
        icon: Clock,
        name: "Recent",
        route: "admin-users",
      },
      {
        icon: Star,
        name: "Starred",
        route: "admin-users",
      },
      {
        icon: Trash,
        name: "Trash",
        route: "admin-users",
      },
    ],
  },
  {
    id: "admin",
    icon: Wrench,
    name: "Admin",
    links: [
      {
        // icon: "👥",
        icon: PieChart,
        name: "Users",
        route: "admin-users",
      },
      {
        // icon: "👥",
        icon: PieChart,
        name: "Students",
        route: "admin-students",
      },
    ],
  },
];

function switchApp(appId: string | null = null) {
  if (appId) {
    activeApp.value = appId;
    visibleAppSwitcher.value = false;
    return;
  }
  // start at first app of index is out of bounds
  const nextIndex = (apps.findIndex((el) => el.id === activeApp.value) + 1) % apps.length;
  activeApp.value = apps[nextIndex].id;
}
</script>
